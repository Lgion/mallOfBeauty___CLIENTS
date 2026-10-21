#!/usr/bin/env python3
"""
analyze_boutique_images.py
Analyzes WhatsApp boutique images using Gemini 2.5 Flash Vision,
matches them to products in src/data/fullCatalogData.json,
and saves the mapping incrementally into scripts/boutique_matches.json.
"""

import os
import sys
import json
import base64
import hashlib
import urllib.request
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, 'ignore', 'new', '1')
CATALOG_PATH = os.path.join(BASE_DIR, 'src', 'data', 'fullCatalogData.json')
MATCHES_FILE = os.path.join(BASE_DIR, 'scripts', 'boutique_matches.json')

API_KEY = os.environ.get('GEMINI_API_KEY')
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable is missing.")
    sys.exit(1)

GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

def load_catalog():
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        products = json.load(f)
    catalog_lines = []
    for p in products:
        cid = p['id']
        brand = p.get('brand', '')
        name = p.get('name', '')
        price = p.get('priceFormatted', '')
        catalog_lines.append(f"{cid} | {brand} | {name} | {price}")
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
                # Track duplicate filenames
                for item in unique_list:
                    if item['hash'] == h:
                        item['duplicates'].append(f)
                        break
    return unique_list

def analyze_single_image(item, catalog_text):
    prompt = f"""You are an expert cosmetic catalog matching AI for 'Mall of Beauty'.
Analyze the product in this photograph taken in the boutique.
Identify the brand, exact product name/variant written on the packaging, product format (lait, crème visage, gel douche, savon, sérum, tube, gommage, etc.), and any volume (ml/oz/g).
Match it against the store catalog below.

CATALOG LIST:
{catalog_text}

Known Brand & Line Equivalences in Catalog:
- 'New York Fair & Lovely' -> in catalog as 'NEW YORK CLASSIC' (lait: mob-cat-0111, savon gommant: mob-cat-0112, baume/crème: mob-cat-0113, savon beauty: mob-cat-0114, gel douche: mob-cat-0115, tube: mob-cat-0116, serum: mob-cat-0117)
- 'New York Fair & Lovely Vitamin C' -> in catalog as 'NEW YORK VIT C'
- 'Zeenat Glow Booster' -> in catalog as 'ZEENAT' (lait: mob-cat-0053, serum: mob-cat-0055, baume/crème: mob-cat-0056, savon: mob-cat-0057, gel douche: mob-cat-0058, carotte serum: mob-cat-0059, crème carotte: mob-cat-0060, gel douche carotte: mob-cat-0061)
- 'Tomatine Skincare' -> in catalog as 'TOMATINE' (lait: mob-cat-0095, crème: mob-cat-0096, serum: mob-cat-0097, savon pm: mob-cat-0098, savon gm: mob-cat-0099, gel douche: mob-cat-0100)
- 'Carotis' -> in catalog as 'CAROTIS'
- 'LightenUp' / 'Lighten Up Girl' -> in catalog as 'LIGHTEN UP MILK' or 'AUTRE LIGHTEN UP'
- 'Fair & White' ranges: F&W Exclusive, F&W So White, F&W Gold, F&W Original, F&W FB Royal / Supreme, F&W Miss White
- 'Makari' ranges: Makari Classic, Makari 24K Rose Gold, Makari Exclusive, Makari Extreme Argan & Carrot, Makari Caviar, Makari Naturalle
- 'St. Ives' -> in catalog as 'GOMMAGE' or under 'ST IVES'
- 'Palmer\'s' -> in catalog as 'PALMER\'S'
- 'Vaseline' -> in catalog as 'VASELINE'
- 'HT26' -> in catalog as 'HT 26'

Rules:
1. If you find a direct or very probable match in the catalog, set 'matched_id' to the exact catalog ID (e.g. 'mob-cat-0100').
2. If it's a specific format (e.g. PM vs GM, savon vs lait), choose the corresponding catalog entry.
3. If the product definitely does NOT exist in the catalog, set 'matched_id' to null and 'confidence' to 'not_found'.
4. Confidence must be 'high', 'medium', or 'not_found'.
5. Provide a clean lowercase slug for renaming (e.g. 'tomatine_shower_gel').

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
    
    max_retries = 5
    delay = 2
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                text = data['candidates'][0]['content']['parts'][0]['text']
                parsed = json.loads(text)
                
                # calculate excel_id if matched
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
            if e.code in (429, 503) and attempt < max_retries - 1:
                import time
                wait_time = 15 + (10 * attempt)
                print(f"Server rate limited ({e.code}) for {item['filename']}, waiting {wait_time}s before retry...")
                time.sleep(wait_time)
                continue
            else:
                print(f"Error processing {item['filename']}: {e}")
                break
        except Exception as e:
            print(f"Error processing {item['filename']}: {e}")
            break

    return {
        "filename": item['filename'],
        "hash": item['hash'],
        "error": "Failed after retries",
        "matched_id": None,
        "excel_id": None,
        "confidence": "error"
    }

def main():
    parser = argparse.ArgumentParser(description="Analyze WhatsApp images and match catalog.")
    parser.add_argument('--limit', type=int, default=50, help="Max unique images to process")
    parser.add_argument('--offset', type=int, default=0, help="Offset index")
    parser.add_argument('--delay', type=float, default=4.0, help="Delay in seconds between requests")
    args = parser.parse_args()

    products, catalog_text = load_catalog()
    unique_items = get_unique_images()
    print(f"Total unique images detected: {len(unique_items)}")

    # Load existing matches if present
    matches = {}
    if os.path.exists(MATCHES_FILE):
        try:
            with open(MATCHES_FILE, 'r', encoding='utf-8') as f:
                matches = json.load(f)
            print(f"Loaded {len(matches)} already analyzed images from cache.")
        except Exception:
            matches = {}

    to_process = []
    selected = unique_items[args.offset : args.offset + args.limit]
    for item in selected:
        # If not present or previously failed with error, reprocess
        if item['filename'] not in matches or matches[item['filename']].get('confidence') == 'error':
            to_process.append(item)

    print(f"Batch selection: {len(selected)} items (offset {args.offset}, limit {args.limit})")
    print(f"Need to process: {len(to_process)} items")

    if not to_process:
        print("Nothing new to process in this batch.")
        return

    import time
    completed_count = 0
    for idx, item in enumerate(to_process, 1):
        res = analyze_single_image(item, catalog_text)
        matches[item['filename']] = res
        completed_count += 1
        matched_str = f"{res.get('matched_id')} ({res.get('matched_name')})" if res.get('matched_id') else "No match"
        print(f"[{completed_count}/{len(to_process)}] {item['filename']} -> {res.get('brand')} | {res.get('clean_slug')} | {matched_str}")
        
        # Save incrementally
        with open(MATCHES_FILE, 'w', encoding='utf-8') as f:
            json.dump(matches, f, indent=2, ensure_ascii=False)
            
        if idx < len(to_process) and args.delay > 0:
            time.sleep(args.delay)

    print(f"\nDone! Matches saved to {MATCHES_FILE}. Total analyzed so far: {len(matches)}")

if __name__ == '__main__':
    main()
