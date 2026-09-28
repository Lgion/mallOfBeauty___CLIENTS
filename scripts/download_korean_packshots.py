import os
import shutil
import urllib.request
import json
import re

DEST_DIR = "public/imgs/products/kbeauty"
os.makedirs(DEST_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

PRODUCTS_TO_PROCESS = [
    {
        "id": "mob-excel-671",
        "name": "DEMAQUILLANT - INNISFREE GEL DEMAQUILLANT",
        "filename": "innisfree_green_tea_cleanser.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0089/3367/1012/files/01_IF_GT-CF_Packshot_2024_01_1080x1080_daa6d2d0-d10c-4a1e-9a79-288ac1fa1fa1_1.jpg",
        "local_copy": None
    },
    {
        "id": "mob-excel-683",
        "name": "SERUM TRAITANT - COSRX BOOSTER AHA BHA Vit C",
        "filename": "cosrx_aha_bha_vitamin_c_booster.jpg",
        "url": None,
        "local_copy": "public/strives/images/prod_15_COSRX_-_AHA_BHA_Vitamin_C_Booster.jpg"
    },
    {
        "id": "mob-excel-697",
        "name": "SERUM TRAITANT - BEAUTY OF JOSEON GLOW SERUM PROPOLIS + NIACINAMIDE",
        "filename": "beauty_of_joseon_glow_serum_propolis.webp",
        "url": None,
        "local_copy": "public/strives/images/prod_14_Beauty_of_Joseon_-_Glow_Serum_Propolis_Niacinamide.webp"
    },
    {
        "id": "mob-excel-698",
        "name": "SERUM TRAITANT - BEAUTY OF JOSEON RICE",
        "filename": "beauty_of_joseon_glow_deep_rice_serum.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/02_0916__30ml_1.jpg?v=1789546505",
        "local_copy": None
    },
    {
        "id": "mob-excel-702",
        "name": "SERUM TRAITANT - ANUA NIACINAMIDE 10% TXA 4%",
        "filename": "anua_niacinamide_10_txa_4.jpg",
        "url": None,
        "local_copy": "public/strives/images/prod_13_Anua_-_Niacinamide_10_TXA_4.jpg"
    },
    {
        "id": "mob-excel-703",
        "name": "SERUM TRAITANT - ANUA BLEMISH 20%",
        "filename": "anua_peach_70_niacin_serum.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-global-ampoule-serum-peach-70-niacinamide-serum-1239193727.jpg?v=1779177611",
        "local_copy": None
    },
    {
        "id": "mob-excel-784",
        "name": "CREME TRAITEMENT - BEAUTY OF JOSEON RICE SPF50 (creme solaire)",
        "filename": "beauty_of_joseon_relief_sun_rice_spf50.jpg",
        "url": None,
        "local_copy": "public/strives/images/prod_19_Beauty_of_Joseon_-_Relief_Sun_Rice_SPF50.jpg"
    },
    {
        "id": "mob-excel-785",
        "name": "CREME TRAITEMENT - BEAUTY OF JOSEON RICE + B5 SPF50 (bleu)",
        "filename": "beauty_of_joseon_relief_sun_aqua_fresh_b5.webp",
        "url": "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/relief-sunscreen-aqua-fresh-1.webp?v=1770602802",
        "local_copy": None
    },
    {
        "id": "mob-excel-825",
        "name": "CREME TRAITEMENT - DR JART+ CICAPAIR CREME TIGER GRASS",
        "filename": "dr_jart_cicapair_tiger_grass_cream.jpg",
        "url": "https://cdn.shopify.com/s/files/1/1321/7315/files/AX6H2333w.jpg?v=1709542554",
        "local_copy": None
    },
    {
        "id": "mob-excel-833",
        "name": "TONER - ANUA 77%",
        "filename": "anua_heartleaf_77_soothing_toner.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-toner-heartleaf-77-soothing-toner-1239193744.jpg?v=1779181932",
        "local_copy": None
    },
    {
        "id": "mob-excel-836",
        "name": "TONER - BEAUTY OF JOSEON GLOW REPLENISHING RICE MILK",
        "filename": "beauty_of_joseon_rice_milk_toner.webp",
        "url": "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/glow-replenshing-rice-milk-1-front.webp?v=1769660112",
        "local_copy": None
    },
    {
        "id": "mob-excel-837",
        "name": "TONER - BEAUTY OF JOSEON ESSENCE RICE",
        "filename": "beauty_of_joseon_essence_water.webp",
        "url": "https://cdn.shopify.com/s/files/1/0558/4135/7989/files/ginseng-essence-water-1-front.webp?v=1770618733",
        "local_copy": None
    },
    {
        "id": "mob-excel-848",
        "name": "TONER - TIRTIR TONER",
        "filename": "tirtir_milk_skin_toner.jpg",
        "url": "https://cdn.shopify.com/s/files/1/1321/7315/files/AX6H2451W.jpg?v=1717017894",
        "local_copy": None
    },
    {
        "id": "mob-excel-852",
        "name": "TONER - ESSENCE CORSX ABVE D ESCARGOT",
        "filename": "cosrx_advanced_snail_96_mucin_essence.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0513/3775/6828/files/james_800x1067_1_1_4e9750cc-2cd6-4817-ace5-be2305a85806.jpg?v=1763111577",
        "local_copy": None
    },
    {
        "id": "mob-excel-858",
        "name": "DIVERS TRAITEMENT - COSRX TONER CICA 7 SOLUTION",
        "filename": "cosrx_pure_fit_cica_toner.png",
        "url": "https://cdn.shopify.com/s/files/1/0271/7351/9412/products/cosrx-cica-toner-main.png?v=1630290882",
        "local_copy": None
    }
]

print("=== 1. TÉLÉCHARGEMENT DES IMAGES OFFICIELLES ===")
downloaded_count = 0
for item in PRODUCTS_TO_PROCESS:
    dest_path = os.path.join(DEST_DIR, item["filename"])
    if item["local_copy"] and os.path.exists(item["local_copy"]):
        shutil.copy(item["local_copy"], dest_path)
        print(f"[OK COPIE] {item['name']} -> {dest_path}")
        downloaded_count += 1
    elif item["url"]:
        try:
            req = urllib.request.Request(item["url"], headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as response, open(dest_path, 'wb') as out_file:
                shutil.copyfileobj(response, out_file)
            size = os.path.getsize(dest_path)
            print(f"[OK TELECHARGEMENT] {item['name']} ({size} octets) -> {dest_path}")
            downloaded_count += 1
        except Exception as e:
            print(f"[ERREUR] Impossible de télécharger {item['name']} : {e}")

print(f"\nTotal images prêtes : {downloaded_count}/{len(PRODUCTS_TO_PROCESS)}")

print("\n=== 2. MISE À JOUR DE initialProducts.js ===")
with open("src/data/initialProducts.js", "r", encoding="utf-8") as f:
    js_content = f.read()

match = re.search(r'(export const INITIAL_PRODUCTS = )(\[[\s\S]*\])(;)', js_content)
if not match:
    print("[ERREUR] Impossible de trouver INITIAL_PRODUCTS dans le fichier.")
    exit(1)

prefix = match.group(1)
products_json = match.group(2)
suffix = match.group(3)

# Parse JSON array
products = json.loads(products_json)
id_map = {item["id"]: f"./imgs/products/kbeauty/{item['filename']}" for item in PRODUCTS_TO_PROCESS}

updated_prods = 0
for p in products:
    pid = p.get("id")
    if pid in id_map:
        new_img = id_map[pid]
        p["image"] = new_img
        p["gallery"] = [new_img]
        p["isFeatured"] = True
        updated_prods += 1

print(f"[OK] {updated_prods} produits mis à jour dans initialProducts.js.")

new_js_content = js_content[:match.start(2)] + json.dumps(products, indent=2, ensure_ascii=False) + js_content[match.end(2):]
with open("src/data/initialProducts.js", "w", encoding="utf-8") as f:
    f.write(new_js_content)

print("[OK] Fichier initialProducts.js sauvegardé avec succès.")

print("\n=== 3. MISE À JOUR DE storage.js (BUMP VERSION) ===")
with open("src/data/storage.js", "r", encoding="utf-8") as f:
    storage_content = f.read()

# Bump PRODUCTS key to mob_products_v5 to force cache invalidation in browser
if 'PRODUCTS: "mob_products_v4"' in storage_content:
    storage_content = storage_content.replace('PRODUCTS: "mob_products_v4"', 'PRODUCTS: "mob_products_v5"')
    with open("src/data/storage.js", "w", encoding="utf-8") as f:
        f.write(storage_content)
    print("[OK] Version de PRODUCTS passée à mob_products_v5 dans storage.js.")
elif 'PRODUCTS: "mob_products_v3"' in storage_content:
    storage_content = storage_content.replace('PRODUCTS: "mob_products_v3"', 'PRODUCTS: "mob_products_v5"')
    with open("src/data/storage.js", "w", encoding="utf-8") as f:
        f.write(storage_content)
    print("[OK] Version de PRODUCTS passée à mob_products_v5 dans storage.js.")
else:
    print("[INFO] Vérification de storage.js terminée.")

print("\n=== TOUT EST TERMINÉ AVEC SUCCÈS ! ===")
