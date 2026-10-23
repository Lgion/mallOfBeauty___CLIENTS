#!/usr/bin/env python3
"""
analyze_batch2.py
Analyzes WhatsApp boutique images from ignore/new/2 using Gemini 2.5 Flash Vision,
matches them against products in src/data/fullCatalogData.json,
and saves the mapping incrementally into scripts/boutique_matches_batch2.json.
Uses ThreadPoolExecutor for rapid, reliable processing with exponential backoff.
"""

import os
import sys
import json
import base64
import hashlib
import time
import urllib.request
import urllib.error
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, 'ignore', 'new', '2')
CATALOG_PATH = os.path.join(BASE_DIR, 'src', 'data', 'fullCatalogData.json')
MATCHES_FILE = os.path.join(BASE_DIR, 'scripts', 'boutique_matches_batch2.json')

API_KEY = os.environ.get('GEMINI_API_KEY')
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable is missing.")
    sys.exit(1)

GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

lock = threading.Lock()

def load_catalog():
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        products = json.load(f)
    catalog_lines = []
    for p in products:
        cid = p['id']
        brand = p.get('brand', '')
        name = p.get('name', '')
        price = p.get('priceFormatted', '')
        sub = p.get('subcategory', '')
        catalog_lines.append(f"{cid} | {brand} | {name} | {price} | {sub}")
    return products, "\n".join(catalog_lines)

def get_unique_images():
    files = sorted(os.listdir(IMAGES_DIR))
    unique_list = []
    seen_hashes = {}
    
    for f in files:
        if f.lower().endswith(('.jpeg', '.jpg', '.png')):
            full_path = os.path.join(IMAGES_DIR, f)
            with open(full_path, 'rb') as fp:
                h = hashlib.md5(fp.read()).hexdigest()
            if h not in seen_hashes:
                seen_hashes[h] = f
                unique_list.append({
                    'filename': f,
                    'hash': h,
                    'full_path': full_path,
                    'duplicates': []
                })
            else:
                for item in unique_list:
                    if item['hash'] == h:
                        item['duplicates'].append(f)
                        break
    return unique_list

def analyze_single_image(item, catalog_text):
    prompt = f"""You are an expert cosmetic catalog matching AI for 'Mall of Beauty' (Abidjan).
Analyze the cosmetic product in this photograph taken in the boutique.
Identify the brand, exact product name/variant written on the bottle or box, format (lait, crème visage, gel douche, savon, sérum, tube, gommage, huile, défrisant, etc.), and volume if visible.
Match it against the store catalog below.

STORE CATALOG:
{catalog_text}

Known Brands and Line Equivalences in Catalog:
- 'QEI+' / 'QEI Paris':
  - Orientale (Argan): lait (mob-cat-0388), creme (mob-cat-0389), serum (mob-cat-0390/0391), savon (mob-cat-0392)
  - Harmonie (Carrot): lait (mob-cat-0382), creme (mob-cat-0383), serum (mob-cat-0384/0385), savon (mob-cat-0386), gel douche (mob-cat-0387)
  - Privilège (Caviar): lait (mob-cat-0371), creme (mob-cat-0372), serum (mob-cat-0373/0374), savon (mob-cat-0375), gel douche (mob-cat-0376)
  - Efficacité Extreme: lait (mob-cat-0377), creme (mob-cat-0378), serum (mob-cat-0379/0380), savon (mob-cat-0381)
  - Active Performance: lait (mob-cat-0393), creme (mob-cat-0394), serum (mob-cat-0395/0396), savon (mob-cat-0397)
  - Bébé: lait (mob-cat-0398), creme (mob-cat-0399), savon (mob-cat-0400), huile (mob-cat-0401)
- 'Smooth & White' -> in catalog as 'SMOOTH WHITE' (lait: mob-cat-0208, baume/creme: mob-cat-0209, carotte: mob-cat-0210, savon: mob-cat-0211)
- 'New York Fair & Lovely' -> in catalog as 'NEW YORK CLASSIC' or 'NEW YORK VIT C'
- 'Zeenat Glow Booster' -> in catalog as 'ZEENAT'
- 'Tomatine' -> in catalog as 'TOMATINE'
- 'Carotis' -> in catalog as 'CAROTIS'
- 'LightenUp' -> in catalog as 'LIGHTEN UP MILK' or 'AUTRE LIGHTEN UP'
- 'Fair & White' ranges: Exclusive, So White, Gold, Original, FB Royal / Supreme, Miss White
- 'Makari' ranges: Classic, 24K Rose Gold, Exclusive, Extreme Argan & Carrot, Caviar, Naturalle, Bebe
- 'St. Ives' -> in catalog under 'ST IVES' or 'GOMMAGE'
- 'Palmer\'s' -> in catalog as 'PALMER\'S'
- 'Vaseline' -> in catalog as 'VASELINE'
- 'HT26' -> in catalog as 'HT 26'
- 'Kojie San' -> in catalog as 'KOJIE SAN'
- 'Gluta White' / 'Glutathione' -> in catalog under 'GLUTA'
- 'Paw Paw' -> in catalog as 'PAW PAW'
- 'Bismid' -> in catalog as 'BISMID'

Rules:
1. If you find a direct or very probable match in the catalog, set 'matched_id' to the exact catalog ID (e.g. 'mob-cat-0390').
2. If it's a specific format (e.g. savon vs lait vs sérum vs crème), choose the corresponding catalog entry.
3. If the product definitely does NOT exist in the catalog, set 'matched_id' to null and 'confidence' to 'not_found'.
4. Confidence must be 'high', 'medium', or 'not_found'.
5. Provide a clean lowercase slug for renaming (e.g. 'qei_orientale_argan_serum').

Return strict JSON:
{{
  "brand": "...",
  "product_name_on_bottle": "...",
  "product_type": "...",
  "volume": "...",
  "matched_id": "mob-cat-XXXX" or null,
  "matched_name": "...",
  "confidence": "high" | "medium" | "not_found",
  "clean_slug": "..."
}}
"""
    with open(item['full_path'], 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
        
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": b64}}
            ]
        }],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    
    req = urllib.request.Request(
        GEMINI_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    max_retries = 6
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=35) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                text = data['candidates'][0]['content']['parts'][0]['text']
                parsed = json.loads(text)
                
                matched_id = parsed.get('matched_id')
                excel_id = None
                if matched_id and matched_id.startswith('mob-cat-'):
                    try:
                        num = int(matched_id.replace('mob-cat-', ''))
                        excel_id = f"mob-excel-{num}"
                    except ValueError:
                        pass
                parsed['excel_id'] = excel_id
                parsed['filename'] = item['filename']
                parsed['hash'] = item['hash']
                parsed['duplicates'] = item['duplicates']
                return parsed
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                wait_time = 10 + (8 * attempt)
                print(f"[{item['filename']}] Rate limited ({e.code}), waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            else:
                print(f"[{item['filename']}] HTTP Error {e.code}: {e}")
                break
        except Exception as e:
            print(f"[{item['filename']}] Error: {e}")
            time.sleep(3)

    return {
        "filename": item['filename'],
        "hash": item['hash'],
        "error": "Failed after retries",
        "matched_id": None,
        "excel_id": None,
        "confidence": "error",
        "clean_slug": "produit_inconnu"
    }

def main():
    products, catalog_text = load_catalog()
    unique_items = get_unique_images()
    print(f"Total unique images to analyze: {len(unique_items)}")

    matches = {}
    if os.path.exists(MATCHES_FILE):
        try:
            with open(MATCHES_FILE, 'r', encoding='utf-8') as f:
                matches = json.load(f)
            print(f"Loaded {len(matches)} matches from existing cache.")
        except Exception:
            matches = {}

    to_process = [it for it in unique_items if it['filename'] not in matches or matches[it['filename']].get('confidence') == 'error']
    print(f"Images to process: {len(to_process)}")

    if not to_process:
        print("All images are already analyzed!")
        return

    completed = 0
    total = len(to_process)
    start_time = time.time()

    # Use 3 concurrent workers to respect Gemini rate limits while maintaining high speed
    with ThreadPoolExecutor(max_workers=3) as executor:
        future_to_item = {executor.submit(analyze_single_image, item, catalog_text): item for item in to_process}
        
        for future in as_completed(future_to_item):
            item = future_to_item[future]
            try:
                res = future.result()
            except Exception as e:
                print(f"Worker exception for {item['filename']}: {e}")
                res = {
                    "filename": item['filename'],
                    "hash": item['hash'],
                    "error": str(e),
                    "matched_id": None,
                    "excel_id": None,
                    "confidence": "error"
                }

            with lock:
                matches[item['filename']] = res
                completed += 1
                matched_str = f"-> {res.get('matched_id')} ({res.get('matched_name')})" if res.get('matched_id') else "-> No match"
                conf = res.get('confidence', '')
                brand = res.get('brand', '')
                slug = res.get('clean_slug', '')
                print(f"[{completed}/{total}] {item['filename']}: {brand} | {slug} | [{conf}] {matched_str}")
                
                # Save cache periodically
                if completed % 5 == 0 or completed == total:
                    with open(MATCHES_FILE, 'w', encoding='utf-8') as f:
                        json.dump(matches, f, indent=2, ensure_ascii=False)

    elapsed = time.time() - start_time
    print(f"\nAll {len(matches)} images analyzed in {elapsed:.1f}s.")
    print(f"Saved to {MATCHES_FILE}")

if __name__ == '__main__':
    main()
