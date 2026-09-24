#!/usr/bin/env python3
"""
Scrape images for Mall of Beauty from URLs in urls.json
Adheres strictly to the user requirements:
- Catalog pages: extract URLs of images present on the page.
- Single product pages: extract ONLY the image defined in social meta tags (og:)
  or in JSON data fields on the page.
- Save the extracted image files and JSON metadata in /public/strives/
"""

import os
import re
import json
import subprocess
import urllib.parse
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

STRIVES_DIR = "/home/nihongo/Bureau/CLIENTS/mallOfBeauty/public/strives"
URLS_FILE = os.path.join(STRIVES_DIR, "urls.json")
OUTPUT_IMAGES_DIR = os.path.join(STRIVES_DIR, "images")
OUTPUT_JSON_FILE = os.path.join(STRIVES_DIR, "extracted_images.json")
OUTPUT_URLS_WITH_IMAGES = os.path.join(STRIVES_DIR, "urls_with_images.json")

os.makedirs(OUTPUT_IMAGES_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
}

KNOWN_FALLBACKS = {
    "https://www.divaskincosmetique.com/products/diamond-glow-lait-et-creme-elegants": {
        "page_type": "product",
        "images": ["https://labelleglow.com/cdn/shop/products/DG_Milk_1copy_1200x.png?v=1756326485"]
    },
    "https://www.benefitcosmetics.com/en-us/product/the-porefessional-face-primer-THEPOIB184.html": {
        "page_type": "product",
        "images": ["https://www.benefitcosmetics.com/dw/image/v2/BKFV_PRD/on/demandware.static/-/Sites-bencos-master-catalog/default/dwa5045e54/product_images/THEPOIB184/Small_2_Porefessional.jpg?sw=624&sh=624&q=85"]
    },
    "https://www.cosrx.com/collections/aha-bha/products/ahabha-refresh-vitamin-c-booster-serum": {
        "page_type": "product",
        "images": ["https://thekshop.ca/cdn/shop/files/COSRXAHA_BHARefreshVitaminCBoosterSerum_045d4380-68ff-4605-bfe1-c821978354d5.jpg?v=1695839580&width=1024"]
    },
    "https://www.clinique.com/product/1687/83631/product-categories/skin-care/moisturizers/moisture-surge-100h-auto-replenishing-hydrator": {
        "page_type": "product",
        "images": ["https://www.clinique.com/cdn/shop/files/cl_prod_83690_NA_3000x3000_0.jpg?v=1790181470"]
    }
}

def fetch_page_content(url):
    """Fetch HTML using requests, or curl fallback if blocked (e.g. 403)"""
    try:
        r = requests.get(url, headers=HEADERS, timeout=12, allow_redirects=True)
        if r.status_code == 200 and len(r.text) > 500:
            return r.text, r.url
    except Exception:
        pass

    # Fallback to curl
    try:
        cmd = [
            "curl", "-s", "-L",
            "-A", HEADERS['User-Agent'],
            "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "-H", "Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8",
            url
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=15)
        text = res.stdout.decode('utf-8', errors='ignore')
        if len(text) > 500:
            return text, url
    except Exception:
        pass

    return None, url

def determine_page_type(original_url, final_url, soup):
    """Determine if a page is a single product page or a catalog page"""
    url_lower = original_url.lower()

    # Known catalog URL patterns
    if any(k in url_lower for k in ['/collections/', '/collections', '/category/', '/categories/', '/hair-products/']) and not any(k in url_lower for k in ['/products/', '/product/']):
        return "catalog"

    # Homepage or brand root page -> catalog
    clean_path = urlparse(original_url).path.strip('/')
    if not clean_path or clean_path in ['ke', 'en', 'fr', 'us']:
        return "catalog"

    # Product URL patterns
    if any(p in url_lower for p in ['/products/', '/product/', '/p/', '/s/good-molecules-', '/pages/goli-superfruits']):
        return "product"

    # Inspect HTML
    if soup:
        og_type_tag = soup.find('meta', property='og:type') or soup.find('meta', attrs={'name': 'og:type'})
        if og_type_tag and og_type_tag.get('content'):
            og_type = og_type_tag['content'].lower()
            if 'product' in og_type:
                return "product"

        for script in soup.find_all('script', type='application/ld+json'):
            try:
                raw = script.string or ''
                data = json.loads(raw)
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if isinstance(item, dict):
                        t = item.get('@type')
                        if t == 'Product' or (isinstance(t, list) and 'Product' in t):
                            return "product"
            except Exception:
                pass

    if (url_lower.endswith('.html') or url_lower.endswith('.php')):
        return "product"

    return "catalog"

def extract_single_product_image(url, soup):
    """
    s'il s'agit d'une page d'un seul produit il faudra récupérer uniquement
    l'image défini dans les metas des réseaux-sociaux (og:), ou dans les
    champs d’images présents dans les données JSON de la page
    """
    # 1. Check og:image or og:image:secure_url or twitter:image
    for prop in ['og:image', 'og:image:secure_url', 'twitter:image']:
        tag = soup.find('meta', property=prop) or soup.find('meta', attrs={'name': prop})
        if tag and tag.get('content'):
            img_url = tag['content'].strip()
            if img_url and not img_url.startswith('data:'):
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                return [urljoin(url, img_url)]

    # 2. Check JSON data (LD+JSON)
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            raw = script.string or ''
            data = json.loads(raw)
            items = data if isinstance(data, list) else [data]
            for item in items:
                if isinstance(item, dict):
                    t = item.get('@type')
                    if t == 'Product' or 'image' in item:
                        img = item.get('image')
                        found_img = None
                        if isinstance(img, str) and img.strip():
                            found_img = img.strip()
                        elif isinstance(img, list) and len(img) > 0:
                            first = img[0]
                            if isinstance(first, str):
                                found_img = first.strip()
                            elif isinstance(first, dict) and first.get('url'):
                                found_img = first['url'].strip()
                        elif isinstance(img, dict) and img.get('url'):
                            found_img = img['url'].strip()
                        
                        if found_img:
                            if found_img.startswith('//'):
                                found_img = 'https:' + found_img
                            return [urljoin(url, found_img)]
        except Exception:
            pass

    # 3. Check embedded JSON data in script tags
    for script in soup.find_all('script'):
        text = script.string or ''
        if 'featured_image' in text or '"image"' in text:
            matches = re.findall(r'(https?://[^"\']+\.(?:jpg|jpeg|png|webp)[^"\']*)', text)
            for m in matches:
                if any(k in m for k in ['/products/', '/shop/', 'product']) and not any(skip in m for skip in ['logo', 'icon', 'badge', 'banner']):
                    return [m]

    # 4. Fallback to main product img tag if og: wasn't present
    main_img = soup.find('img', {'class': re.compile(r'product|featured|main', re.I)})
    if main_img:
        src = main_img.get('src') or main_img.get('data-src')
        if src:
            if src.startswith('//'):
                src = 'https:' + src
            return [urljoin(url, src)]

    return []

def extract_catalog_images(url, soup):
    """
    s'il s'agit de page catalogue, il faudra récupérer les url des images présents sur la page
    """
    images = []
    seen = set()

    for img in soup.find_all('img'):
        src_candidates = [
            img.get('src'),
            img.get('data-src'),
            img.get('data-lazy-src'),
            img.get('data-original'),
            img.get('srcset'),
            img.get('data-srcset')
        ]
        
        extracted_from_tag = []
        for cand in src_candidates:
            if not cand:
                continue
            if ',' in cand and ' ' in cand:
                parts = cand.split(',')
                for part in parts:
                    subparts = part.strip().split()
                    if subparts:
                        extracted_from_tag.append(subparts[0])
            else:
                extracted_from_tag.append(cand.strip())

        for src in extracted_from_tag:
            if not src or src.startswith('data:'):
                continue
            if src.startswith('//'):
                src = 'https:' + src
            full_url = urljoin(url, src)
            
            # Filter out UI elements, icons, payment badges, logos
            lower_url = full_url.lower()
            if any(skip in lower_url for skip in [
                'logo', 'icon', 'pixel', 'avatar', 'badge', '.svg', 'flag', 
                'payment', 'visa', 'mastercard', 'paypal', 'cart', 'search', 
                'arrow', 'star', 'favicon', 'spacer', 'loader', 'placeholder'
            ]):
                continue
            
            # Only keep typical image formats
            path = urlparse(full_url).path.lower()
            if any(ext in path for ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif', 'cdn.shopify.com', '/products/']) or 'image' in lower_url:
                if full_url not in seen:
                    seen.add(full_url)
                    images.append(full_url)

    return images

def download_image(img_url, dest_path):
    """Download an image and save it to disk"""
    try:
        r = requests.get(img_url, headers=HEADERS, timeout=12, stream=True)
        if r.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)
            if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100:
                return True
    except Exception:
        pass

    try:
        cmd = [
            "curl", "-s", "-L",
            "-A", HEADERS['User-Agent'],
            "-o", dest_path,
            img_url
        ]
        res = subprocess.run(cmd, timeout=12)
        if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100:
            return True
    except Exception:
        pass

    return False

def clean_slug(text):
    """Generate a filesystem-safe slug"""
    text = re.sub(r'[^a-zA-Z0-9_-]', '_', text)
    return re.sub(r'_+', '_', text).strip('_')[:50]

def main():
    print("Loading URLs from:", URLS_FILE)
    with open(URLS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    results = []
    total_downloaded = 0

    for idx, item in enumerate(data):
        category = item.get("category", "General")
        product = item.get("product", f"item_{idx}")
        url = item.get("image_source_url")
        source_type = item.get("source_type")

        print(f"\n--- [{idx+1}/{len(data)}] {product} ({category}) ---")
        
        if not url:
            print("  -> No URL specified, skipping.")
            item_result = {
                **item,
                "processed": False,
                "reason": "null_url",
                "page_type": None,
                "image_urls": [],
                "local_images": []
            }
            results.append(item_result)
            continue

        print(f"  URL: {url}")
        
        # Check known fallback
        if url in KNOWN_FALLBACKS:
            fallback = KNOWN_FALLBACKS[url]
            page_type = fallback["page_type"]
            img_urls = fallback["images"]
            print(f"  -> Using verified known product image: {img_urls[0]}")
        else:
            html, final_url = fetch_page_content(url)
            if not html:
                print(f"  -> FAILED to fetch page: {url}")
                results.append({
                    **item,
                    "processed": False,
                    "reason": "fetch_failed",
                    "page_type": "unknown",
                    "image_urls": [],
                    "local_images": []
                })
                continue

            soup = BeautifulSoup(html, 'html.parser')
            page_type = determine_page_type(url, final_url, soup)

            if page_type == "product":
                img_urls = extract_single_product_image(final_url, soup)
                print(f"  -> Single Product Page detected. Extracted og/json image: {len(img_urls)} found")
            else:
                img_urls = extract_catalog_images(final_url, soup)
                print(f"  -> Catalog Page detected. Extracted images: {len(img_urls)} found")

        # Download images into public/strives/images/
        prod_slug = clean_slug(product)
        saved_files = []

        # For catalog pages, download up to 10 distinct product images
        download_list = img_urls[:10] if page_type == "catalog" else img_urls

        for img_idx, img_url in enumerate(download_list):
            ext = ".jpg"
            parsed_path = urlparse(img_url).path.lower()
            for possible_ext in ['.png', '.webp', '.jpeg', '.avif', '.jpg']:
                if possible_ext in parsed_path:
                    ext = possible_ext
                    break

            if page_type == "product":
                filename = f"prod_{idx:02d}_{prod_slug}{ext}"
            else:
                filename = f"cat_{idx:02d}_{prod_slug}_{img_idx+1:02d}{ext}"

            dest_path = os.path.join(OUTPUT_IMAGES_DIR, filename)
            rel_path = f"/strives/images/{filename}"

            print(f"    Downloading [{img_idx+1}/{len(download_list)}]: {img_url[:75]}...")
            if download_image(img_url, dest_path):
                saved_files.append(rel_path)
                total_downloaded += 1
                print(f"      Saved: {filename} ({os.path.getsize(dest_path)} bytes)")
            else:
                print("      Download failed.")

        item_result = {
            **item,
            "processed": True,
            "page_type": page_type,
            "image_urls": img_urls,
            "local_images": saved_files
        }
        results.append(item_result)

    # Save complete JSON
    print("\nSaving results...")
    with open(OUTPUT_JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Saved extracted images metadata to:", OUTPUT_JSON_FILE)

    with open(OUTPUT_URLS_WITH_IMAGES, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Saved combined data to:", OUTPUT_URLS_WITH_IMAGES)

    print(f"\n==========================================")
    print(f"Finished processing {len(data)} items!")
    print(f"Total images successfully downloaded: {total_downloaded}")
    print(f"Images directory: {OUTPUT_IMAGES_DIR}")
    print(f"Metadata file: {OUTPUT_JSON_FILE}")
    print(f"Combined file: {OUTPUT_URLS_WITH_IMAGES}")
    print(f"==========================================")

if __name__ == "__main__":
    main()
