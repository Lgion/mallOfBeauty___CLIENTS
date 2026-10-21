#!/usr/bin/env python3
"""
rename_and_stage_boutique.py
Uses Gemini Flash Lite to identify and rename all 242 unique boutique photos.
Batches 4 images per call for speed and quota safety.
Stages renamed files into public/imgs/products/boutique_renamed/.
"""

import os
import sys
import json
import base64
import hashlib
import time
import re
import shutil
import requests

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(BASE_DIR, 'ignore', 'new', '1')
STAGING_DIR = os.path.join(BASE_DIR, 'public', 'imgs', 'products', 'boutique_renamed')
MANIFEST_PATH = os.path.join(BASE_DIR, 'scripts', 'boutique_renamed_manifest.json')

API_KEY = os.environ.get('GEMINI_API_KEY')
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable is missing.")
    sys.exit(1)

GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={API_KEY}"

os.makedirs(STAGING_DIR, exist_ok=True)

def sanitize_slug(text):
    text = text.lower()
    text = re.sub(r'[\'\"«»’]', '', text)
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

def get_unique_images():
    files = sorted(os.listdir(SOURCE_DIR))
    unique_list = []
    seen_hashes = {}
    
    for f in files:
        if f.lower().endswith(('.jpeg', '.jpg', '.png')):
            full_path = os.path.join(SOURCE_DIR, f)
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

def process_batch(chunk):
    parts = [{
        'text': """You are a cosmetic packaging analysis expert.
For EACH of the images provided, inspect the brand and product title/type visible on the packaging or container.
Generate a clean, professional lowercase filename slug formatted as: brand_product_type_variant (alphanumeric and underscores only, max 50 chars).
Return a JSON array of objects with:
- "index": integer (1 to number of images in this batch)
- "brand": string (brand name)
- "title": string (product name and type in French/English as on packaging)
- "clean_slug": string (e.g. "st_ives_radiant_skin_scrub", "zeenat_glow_booster_body_wash")
"""
    }]
    
    for idx, item in enumerate(chunk, 1):
        with open(item['full_path'], 'rb') as fp:
            b64 = base64.b64encode(fp.read()).decode('utf-8')
        parts.append({'text': f"Image {idx}: {item['filename']}"})
        parts.append({'inline_data': {'mime_type': 'image/jpeg', 'data': b64}})
        
    payload = {
        'contents': [{'parts': parts}],
        'generationConfig': {'response_mime_type': 'application/json'}
    }
    
    for attempt in range(4):
        try:
            r = requests.post(GEMINI_URL, json=payload, timeout=30)
            if r.status_code == 200:
                raw_text = r.json()['candidates'][0]['content']['parts'][0]['text']
                data = json.loads(raw_text)
                return data
            elif r.status_code == 429:
                wait_time = 15 * (attempt + 1)
                print(f"Rate limited (429), waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"Error {r.status_code}: {r.text[:200]}")
                time.sleep(5)
        except Exception as e:
            print(f"Request exception: {e}")
            time.sleep(5)
            
    return None

def main():
    unique_items = get_unique_images()
    print(f"Total unique images to rename: {len(unique_items)}")
    
    manifest = {}
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r', encoding='utf-8') as fp:
                manifest = json.load(fp)
            print(f"Loaded {len(manifest)} previously renamed images from manifest.")
        except Exception:
            manifest = {}

    to_process = [it for it in unique_items if it['filename'] not in manifest]
    print(f"Remaining images to process: {len(to_process)}")

    CHUNK_SIZE = 4
    for i in range(0, len(to_process), CHUNK_SIZE):
        chunk = to_process[i:i + CHUNK_SIZE]
        print(f"\nProcessing batch {i//CHUNK_SIZE + 1}/{(len(to_process) + CHUNK_SIZE - 1)//CHUNK_SIZE} ({len(chunk)} images)...")
        results = process_batch(chunk)
        
        if results and isinstance(results, list):
            for res in results:
                idx = res.get('index', 1) - 1
                if 0 <= idx < len(chunk):
                    orig_item = chunk[idx]
                    slug = sanitize_slug(res.get('clean_slug', 'produit_cosmetique'))
                    manifest[orig_item['filename']] = {
                        'original_filename': orig_item['filename'],
                        'brand': res.get('brand', ''),
                        'title': res.get('title', ''),
                        'clean_slug': slug,
                        'hash': orig_item['hash'],
                        'duplicates': orig_item['duplicates']
                    }
                    print(f"  ✓ {orig_item['filename']} -> {slug}")
        else:
            print("  ⚠️ Batch failed, using fallback naming based on hash")
            for orig_item in chunk:
                slug = f"produit_boutique_{orig_item['hash'][:8]}"
                manifest[orig_item['filename']] = {
                    'original_filename': orig_item['filename'],
                    'brand': 'Inconnu',
                    'title': 'Produit Boutique',
                    'clean_slug': slug,
                    'hash': orig_item['hash'],
                    'duplicates': orig_item['duplicates']
                }

        # Save manifest after each batch
        with open(MANIFEST_PATH, 'w', encoding='utf-8') as fp:
            json.dump(manifest, fp, indent=2, ensure_ascii=False)
            
        time.sleep(2.0)

    # Now stage all files with non-colliding clean names
    print("\n--- Staging renamed images ---")
    used_names = {}
    for filename, info in manifest.items():
        orig_path = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(orig_path):
            continue
            
        base_slug = info['clean_slug']
        count = used_names.get(base_slug, 0) + 1
        used_names[base_slug] = count
        
        final_filename = f"{base_slug}_{count:02d}.jpg" if count > 1 else f"{base_slug}.jpg"
        info['final_filename'] = final_filename
        staged_path = os.path.join(STAGING_DIR, final_filename)
        shutil.copy2(orig_path, staged_path)

    with open(MANIFEST_PATH, 'w', encoding='utf-8') as fp:
        json.dump(manifest, fp, indent=2, ensure_ascii=False)

    print(f"\n🎉 Finished! {len(manifest)} images staged and renamed in {STAGING_DIR}")
    print(f"Manifest saved to {MANIFEST_PATH}")

if __name__ == '__main__':
    main()
