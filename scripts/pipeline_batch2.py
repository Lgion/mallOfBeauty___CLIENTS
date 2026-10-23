#!/usr/bin/env python3
"""
pipeline_batch2.py
End-to-end pipeline for Batch 2 images (ignore/new/2):
1. Deduplication (156 files -> 153 unique)
2. Batch Vision analysis with Gemini Flash Lite (4 images per prompt, fast & quota safe)
3. Smart matching against fullCatalogData.json
4. Staging to public/imgs/products/boutique_v2/ with clean SEO filenames
5. Generates comprehensive linking report
"""

import os
import sys
import json
import base64
import hashlib
import time
import re
import shutil
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, 'ignore', 'new', '2')
CATALOG_PATH = os.path.join(BASE_DIR, 'src', 'data', 'fullCatalogData.json')
STAGING_DIR = os.path.join(BASE_DIR, 'public', 'imgs', 'products', 'boutique_v2')
VISION_CACHE = os.path.join(BASE_DIR, 'scripts', 'boutique_vision_batch2.json')
MATCHES_FILE = os.path.join(BASE_DIR, 'scripts', 'boutique_matches_batch2.json')

API_KEY = os.environ.get('GEMINI_API_KEY')
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable is missing.")
    sys.exit(1)

GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={API_KEY}"

os.makedirs(STAGING_DIR, exist_ok=True)

def sanitize_slug(text):
    text = (text or '').lower()
    text = re.sub(r'[\'\"«»’]', '', text)
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')[:55]

def normalize_str(s):
    if not s:
        return ""
    s = s.lower()
    replacements = {'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e', 'à': 'a', 'â': 'a', 'î': 'i', 'ï': 'i', 'ô': 'o', 'ù': 'u', 'û': 'u', 'ç': 'c'}
    for k, v in replacements.items():
        s = s.replace(k, v)
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return s.strip()

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

def call_gemini_batch(chunk):
    parts = [{
        'text': """You are a cosmetic packaging analysis expert for Mall of Beauty.
For EACH image provided, inspect the brand and product title/type visible on the packaging or container.
Identify:
1. "index": integer (1..N corresponding to the image)
2. "brand": brand name (e.g. QEI+, Smooth & White, Makari, Fair & White, Vaseline, Tomatine, Zeenat, Carotis, etc.)
3. "title": full product name and variant visible on bottle
4. "product_type": format (lait, crème, sérum, savon, gel douche, gommage, tube, huile, etc.)
5. "clean_slug": professional lowercase slug (e.g. qei_oriental_argan_serum)

Return a strict JSON array of objects with keys: index, brand, title, product_type, clean_slug.
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
    
    req = urllib.request.Request(
        GEMINI_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    max_retries = 5
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                raw_text = data['candidates'][0]['content']['parts'][0]['text']
                parsed = json.loads(raw_text)
                return parsed
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                wait_time = 12 * (attempt + 1)
                print(f"  [429/503] Rate limited, waiting {wait_time}s before retry...")
                time.sleep(wait_time)
            else:
                print(f"  HTTP error {e.code}: {e}")
                break
        except Exception as e:
            print(f"  Error on attempt {attempt+1}: {e}")
            time.sleep(4)
            
    return None

def step1_vision_analysis(unique_items):
    print("\n--- Étape 1 : Analyse Visuelle par Lots (Gemini Flash Lite) ---")
    vision_cache = {}
    if os.path.exists(VISION_CACHE):
        try:
            with open(VISION_CACHE, 'r', encoding='utf-8') as f:
                vision_cache = json.load(f)
            print(f"Images déjà analysées en cache : {len(vision_cache)}/{len(unique_items)}")
        except Exception:
            vision_cache = {}
            
    pending = [it for it in unique_items if it['filename'] not in vision_cache]
    print(f"Images restantes à analyser : {len(pending)}")
    
    batch_size = 4
    total_batches = (len(pending) + batch_size - 1) // batch_size
    
    for b_idx in range(total_batches):
        chunk = pending[b_idx * batch_size : (b_idx + 1) * batch_size]
        print(f"Traitement lot {b_idx + 1}/{total_batches} ({len(chunk)} images)...")
        
        results = call_gemini_batch(chunk)
        if results and isinstance(results, list):
            for res in results:
                idx = res.get('index', 1) - 1
                if 0 <= idx < len(chunk):
                    item = chunk[idx]
                    res['filename'] = item['filename']
                    res['hash'] = item['hash']
                    res['duplicates'] = item['duplicates']
                    res['clean_slug'] = sanitize_slug(res.get('clean_slug') or res.get('title') or 'produit_boutique')
                    vision_cache[item['filename']] = res
                    print(f"  ✓ {item['filename']} -> {res.get('brand')} | {res.get('clean_slug')}")
        else:
            print(f"  ⚠️ Échec du lot {b_idx + 1}, fallback individuel...")
            for item in chunk:
                single_res = call_gemini_batch([item])
                if single_res and isinstance(single_res, list) and len(single_res) > 0:
                    r = single_res[0]
                    r['filename'] = item['filename']
                    r['hash'] = item['hash']
                    r['duplicates'] = item['duplicates']
                    r['clean_slug'] = sanitize_slug(r.get('clean_slug') or r.get('title') or 'produit_boutique')
                    vision_cache[item['filename']] = r
                    print(f"    ✓ {item['filename']} -> {r.get('brand')} | {r.get('clean_slug')}")
                time.sleep(1.5)
                
        # Sauvegarde incrémentale
        with open(VISION_CACHE, 'w', encoding='utf-8') as f:
            json.dump(vision_cache, f, indent=2, ensure_ascii=False)
            
        time.sleep(1.5)
        
    print(f"Analyse visuelle terminée : {len(vision_cache)} images en cache.")
    return vision_cache

def step2_catalog_matching(vision_cache, catalog):
    print("\n--- Étape 2 : Appariement Intelligent avec le Catalogue ---")
    
    # Prétraitement et indexation du catalogue
    indexed_catalog = []
    for p in catalog:
        b_norm = normalize_str(p.get('brand', ''))
        n_norm = normalize_str(p.get('name', ''))
        sub_norm = normalize_str(p.get('subcategory', ''))
        cat_norm = normalize_str(p.get('category', ''))
        combined = f"{b_norm} {n_norm} {sub_norm} {cat_norm}"
        indexed_catalog.append({
            'product': p,
            'id': p['id'],
            'brand': p.get('brand', ''),
            'name': p.get('name', ''),
            'brand_norm': b_norm,
            'name_norm': n_norm,
            'combined_norm': combined,
            'tokens': set(combined.split())
        })
        
    BRAND_ALIASES = {
        'smooth white': ['smooth white', 'smooth and white'],
        'qei': ['qei', 'qei+', 'qei paris', 'qualite extreme intense'],
        'fair white': ['fair and white', 'fair white', 'f w', 'fw'],
        'new york': ['new york classic', 'new york vit c', 'new york fair and lovely'],
        'tomatine': ['tomatine'],
        'carotis': ['carotis'],
        'zeenat': ['zeenat', 'zeenat glow booster'],
        'lighten up': ['lighten up', 'lightenup', 'autre lighten up'],
        'makari': ['makari', 'makari de suisse'],
        'vaseline': ['vaseline'],
        'palmer': ['palmer', 'palmers', 'palmer s'],
        'ht26': ['ht26', 'ht 26'],
        'st ives': ['st ives', 'stives', 'saint ives'],
        'kojie san': ['kojie san', 'kojic'],
        'paw paw': ['paw paw', 'pawpaw'],
        'gluta': ['gluta', 'glutathione', 'gluta white']
    }
    
    matches_report = {}
    matched_count = 0
    
    for filename, info in vision_cache.items():
        v_brand = normalize_str(info.get('brand', ''))
        v_title = normalize_str(info.get('title', ''))
        v_type = normalize_str(info.get('product_type', ''))
        v_slug = normalize_str(info.get('clean_slug', ''))
        
        photo_text = f"{v_brand} {v_title} {v_slug} {v_type}"
        photo_tokens = set(photo_text.split())
        
        best_match = None
        best_score = 0
        best_reason = ""
        
        for item in indexed_catalog:
            score = 0
            
            # 1. Correspondance Marque
            brand_matched = False
            for canonical, aliases in BRAND_ALIASES.items():
                if any(al in v_brand for al in aliases) and any(al in item['brand_norm'] for al in aliases):
                    score += 40
                    brand_matched = True
                    break
            if not brand_matched and v_brand and (v_brand in item['brand_norm'] or item['brand_norm'] in v_brand):
                score += 35
                brand_matched = True
                
            # 2. Correspondance Type cosmétique
            types_list = ['lait', 'creme', 'serum', 'savon', 'gel douche', 'gommage', 'tube', 'huile', 'lotion', 'baume', 'defrisant', 'masque']
            for t in types_list:
                if t in photo_text and t in item['combined_norm']:
                    score += 25
                    break
                    
            # 3. Chevauchement de tokens significatifs (>2 lettres)
            overlap = 0
            for tok in photo_tokens:
                if len(tok) > 2 and tok in item['tokens']:
                    overlap += 1
            score += overlap * 8
            
            # Bonus spécifique pour sous-gamme (ex: argan, carotte, caviar, 24k, etc.)
            sublines = ['orientale', 'harmonie', 'privilege', 'argan', 'carotte', 'caviar', 'gold', 'exclusive', 'so white', 'original', 'concentre']
            for sl in sublines:
                if sl in photo_text and sl in item['combined_norm']:
                    score += 20
                    
            if score > best_score and score >= 45:
                best_score = score
                best_match = item
                best_reason = f"Score: {score} (Brand: {brand_matched}, Overlap: {overlap})"
                
        if best_match:
            matched_count += 1
            cat_id = best_match['id']
            excel_id = f"mob-excel-{int(cat_id.replace('mob-cat-', ''))}"
            matches_report[filename] = {
                'filename': filename,
                'hash': info.get('hash'),
                'duplicates': info.get('duplicates', []),
                'brand': info.get('brand'),
                'title': info.get('title'),
                'product_type': info.get('product_type'),
                'clean_slug': info.get('clean_slug'),
                'matched_id': cat_id,
                'matched_name': f"{best_match['brand']} - {best_match['name']}",
                'excel_id': excel_id,
                'confidence': 'high' if best_score >= 65 else 'medium',
                'score': best_score,
                'reason': best_reason
            }
            print(f"  🎯 [{cat_id}] {info.get('title')} -> {best_match['brand']} {best_match['name']} ({best_score} pts)")
        else:
            matches_report[filename] = {
                'filename': filename,
                'hash': info.get('hash'),
                'duplicates': info.get('duplicates', []),
                'brand': info.get('brand'),
                'title': info.get('title'),
                'product_type': info.get('product_type'),
                'clean_slug': info.get('clean_slug'),
                'matched_id': None,
                'excel_id': None,
                'confidence': 'not_found',
                'score': 0,
                'reason': 'No catalog entry reached threshold'
            }
            
    with open(MATCHES_FILE, 'w', encoding='utf-8') as f:
        json.dump(matches_report, f, indent=2, ensure_ascii=False)
        
    print(f"\nAppariement terminé : {matched_count}/{len(vision_cache)} photos associées à un produit du catalogue !")
    return matches_report

def step3_stage_files(matches_report):
    print("\n--- Étape 3 : Renommage Standardisé & Préparation des Fichiers ---")
    staged_count = 0
    for filename, info in matches_report.items():
        src_file = os.path.join(IMAGES_DIR, filename)
        if not os.path.exists(src_file):
            continue
            
        short_hash = (info.get('hash') or 'img')[:6]
        slug = info.get('clean_slug') or 'produit'
        cat_id = info.get('matched_id') or 'boutique'
        
        final_filename = f"prod_{slug}_{cat_id}_{short_hash}.jpg"
        dest_file = os.path.join(STAGING_DIR, final_filename)
        
        shutil.copy2(src_file, dest_file)
        info['final_filename'] = final_filename
        staged_count += 1
        
    with open(MATCHES_FILE, 'w', encoding='utf-8') as f:
        json.dump(matches_report, f, indent=2, ensure_ascii=False)
        
    print(f"Photos renommées et prêtes dans {STAGING_DIR} : {staged_count} fichiers.")

def main():
    catalog = json.load(open(CATALOG_PATH, 'r', encoding='utf-8'))
    unique_items = get_unique_images()
    print(f"Dossier source : {IMAGES_DIR}")
    print(f"Total fichiers uniques : {len(unique_items)}")
    
    vision_cache = step1_vision_analysis(unique_items)
    matches_report = step2_catalog_matching(vision_cache, catalog)
    step3_stage_files(matches_report)
    
    print("\n🎉 Traitement terminé avec succès !")

if __name__ == '__main__':
    main()
