import os
import shutil
import urllib.request
import json
import re

DEST_DIR = "public/imgs/products/usa"
os.makedirs(DEST_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

PRODUCTS_TO_PROCESS = [
    # Palmer's
    {
        "id": "mob-excel-316",
        "name": "PALMER'S - LAIT RAW SHEA (gm)",
        "filename": "palmers_raw_shea_lotion.webp",
        "url": "https://cdn.shopify.com/s/files/1/0749/1387/4134/files/5165NFront.webp?v=1780073288",
        "local_copy": None
    },
    {
        "id": "mob-excel-317",
        "name": "PALMER'S - LAIT RAW SHEA (pm)",
        "filename": "palmers_raw_shea_lotion_pm.webp",
        "url": "https://cdn.shopify.com/s/files/1/0749/1387/4134/files/5165NFront.webp?v=1780073288",
        "local_copy": None
    },
    {
        "id": "mob-excel-318",
        "name": "PALMER'S - SAVON RAW SHEA",
        "filename": "palmers_raw_shea_soap.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0749/1387/4134/files/3543.jpg?v=1748505319",
        "local_copy": None
    },
    {
        "id": "mob-excel-323",
        "name": "PALMER'S - CREME RAW SHEA",
        "filename": "palmers_raw_shea_cream.webp",
        "url": "https://cdn.shopify.com/s/files/1/0749/1387/4134/files/5008Front.webp?v=1780073197",
        "local_copy": None
    },
    {
        "id": "mob-excel-305",
        "name": "PALMER'S - LAIT CLASSIC (GRAND)",
        "filename": "palmers_cocoa_butter_lotion.webp",
        "url": "https://cdn.shopify.com/s/files/1/0749/1387/4134/files/4165NFront.webp?v=1763580201",
        "local_copy": None
    },
    {
        "id": "mob-excel-308",
        "name": "PALMER'S - CREME CLASSIC HEALS",
        "filename": "palmers_cocoa_butter_solid_jar.webp",
        "url": "https://cdn.shopify.com/s/files/1/0749/1387/4134/files/4008_Front.webp?v=1762800446",
        "local_copy": None
    },

    # Neutrogena
    {
        "id": "mob-excel-470",
        "name": "NEUTROGENA - MASQUE CURCUMA",
        "filename": "neutrogena_clear_soothe_curcuma.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/files/neutrogena-clear-soothe-mousse-cleanser-150ml-front.jpg?v=1789124728",
        "local_copy": None
    },
    {
        "id": "mob-excel-471",
        "name": "NEUTROGENA - SAVON ORANGE VRAC",
        "filename": "neutrogena_facial_cleansing_bar_original.webp",
        "url": "https://images.ctfassets.net/3zfcttr0ztpr/6stosumrWCDy5HCJlAAMGz/f83082f3fa62100dc4ff95219bfeef1b/NTG_070501010105_US_FACIAL_CLEANSING_BAR_3.5OZ_00000.webp",
        "local_copy": None
    },
    {
        "id": "mob-excel-474",
        "name": "NEUTROGENA - SAVON NEUTROGENA ACNE PRONE SKIN",
        "filename": "neutrogena_facial_bar_acne_prone.webp",
        "url": "https://images.ctfassets.net/3zfcttr0ztpr/5TDEsTrTu3Ss3skr0GBHXn/0b1a94aa3d1d3ccdbf4eb15776e36b4e/NTG_070501013304_US_Facial_Cleansing_Bar_for_Acne-Prone_Skin_3.5OZ_00000.webp",
        "local_copy": None
    },

    # Shea Moisture
    {
        "id": "mob-excel-497",
        "name": "SHEA MOISTURE - SAVON NOIR (pm)",
        "filename": "shea_moisture_african_black_soap.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/files/african-black-soap.jpg?v=1718985973",
        "local_copy": None
    },
    {
        "id": "mob-excel-498",
        "name": "SHEA MOISTURE - SAVON NOIR (gm)",
        "filename": "shea_moisture_african_black_soap_gm.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/files/african-black-soap.jpg?v=1718985973",
        "local_copy": None
    },
    {
        "id": "mob-excel-500",
        "name": "SHEA MOISTURE - SAVON HIBISCUS",
        "filename": "shea_moisture_coconut_hibiscus_soap.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/files/sm-coconut-soap.jpg?v=1719225076",
        "local_copy": None
    },

    # Paula's Choice
    {
        "id": "mob-excel-754",
        "name": "SERUM TRAITANT - PAULAS CHOICE SERUM NIACINAMIDE 20%",
        "filename": "paulas_choice_niacinamide_20.jpg",
        "url": None,
        "local_copy": "public/strives/images/prod_10_Paula_s_Choice_-_S_rum_Niacinamide_20.jpg"
    },
    {
        "id": "mob-excel-882",
        "name": "DIVERS TRAITEMENT - PAULAS CHOICE C5 SUPER BOOST",
        "filename": "paulas_choice_c5_super_boost.jpg",
        "url": "https://media.paulaschoice-eu.com/image/upload/f_auto,q_auto/products/images/7850",
        "local_copy": None
    },
    {
        "id": "mob-excel-886",
        "name": "DIVERS TRAITEMENT - PAULAS CHOICE BOOSTER AZELAIC ACID 10%",
        "filename": "paulas_choice_azelaic_acid_booster.jpg",
        "url": "https://media.paulaschoice-eu.com/image/upload/f_auto,q_auto/products/images/7750",
        "local_copy": None
    },

    # Vaseline
    {
        "id": "mob-excel-264",
        "name": "VASELINE - LAIT MARRON GRAND",
        "filename": "vaseline_cocoa_radiant_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/products/cocoaradiant-1.jpg?v=1642985326",
        "local_copy": None
    },
    {
        "id": "mob-excel-262",
        "name": "VASELINE - LAIT JAUNE (GRAND)",
        "filename": "vaseline_essential_healing_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/products/VASehlotion-1.jpg?v=1642985459",
        "local_copy": None
    },
    {
        "id": "mob-excel-266",
        "name": "VASELINE - LAIT VERT (pm)",
        "filename": "vaseline_aloe_soothe_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/products/VASaloesotlotion-1.jpg?v=1642985324",
        "local_copy": None
    },
    {
        "id": "mob-excel-267",
        "name": "VASELINE - LAIT BLANC (pm)",
        "filename": "vaseline_advanced_repair_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/products/vasadvanrepairlotion-1.jpg?v=1642985461",
        "local_copy": None
    },
    {
        "id": "mob-excel-269",
        "name": "VASELINE - LAIT ALMOND SMOOTH MOURTADE",
        "filename": "vaseline_almond_smooth_lotion.jpg",
        "url": None,
        "local_copy": "public/strives/images/prod_07_Vaseline_Almond_Smooth.jpg"
    },
    {
        "id": "mob-excel-274",
        "name": "VASELINE - HUILE MARRON",
        "filename": "vaseline_cocoa_radiant_body_oil.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0551/9084/7626/products/vaseline_intensive_care_cocoa_radiant_body_gel_oil_200ml.jpg?v=1638515639",
        "local_copy": None
    },

    # Jergens
    {
        "id": "mob-excel-280",
        "name": "JERGENS - LAIT SHEA",
        "filename": "jergens_shea_butter_lotion.png",
        "url": None,
        "local_copy": "public/strives/images/cat_09_Jergens_Shea_Butter_01.png"
    },
    {
        "id": "mob-excel-283",
        "name": "JERGENS - LAIT ORIGINAL SCENT CHERRY ALMOND (621ml)",
        "filename": "jergens_cherry_almond_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0606/5910/6001/products/32256.jpg?v=1677142476",
        "local_copy": None
    },

    # EOS
    {
        "id": "mob-excel-302",
        "name": "EOS - VANILLA CASHMERE",
        "filename": "eos_vanilla_cashmere_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0102/6949/1258/files/EOS_BLFlipCap_PDP_VC_AllureBadge_2026_1000x1161_ed15a97a-0ada-46e9-b5ed-1bb9393b521e.jpg?v=1780655327",
        "local_copy": None
    },
    {
        "id": "mob-excel-303",
        "name": "EOS - COCONUT WATER",
        "filename": "eos_coconut_waters_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0102/6949/1258/files/EOS_BLFlipCap_PDP_CW_AllureBadge_2026_1000x1161_8dff48e0-4891-4368-8420-30cd3cec5af0.jpg?v=1780656128",
        "local_copy": None
    },
    {
        "id": "mob-excel-304",
        "name": "EOS - FRESH COZY",
        "filename": "eos_fresh_cozy_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0102/6949/1258/files/EOS_BLFlipCap_PDP_FC_AllureBadge_2026_1000x1161_b969797d-8a18-4ca3-a1b1-4f5d41053ff9.jpg?v=1780655767",
        "local_copy": None
    },

    # Dr Teal's
    {
        "id": "mob-excel-138",
        "name": "DR TEALS - LAIT DR TEALS COCONUT OIL",
        "filename": "dr_teals_coconut_oil_body_lotion.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0047/6875/9878/files/06.547_coconut_oil_body_lotion_front.jpg?v=1790140732",
        "local_copy": None
    },
    {
        "id": "mob-excel-142",
        "name": "DR TEALS - GEL DOUCHE",
        "filename": "dr_teals_coconut_oil_body_wash.jpg",
        "url": "https://cdn.shopify.com/s/files/1/0047/6875/9878/files/06.528_coconut_oil_body_wash_front.jpg?v=1790136797",
        "local_copy": None
    }
]

print("=== 1. TÉLÉCHARGEMENT DES PACKSHOTS OFFICIELS USA ===")
downloaded = 0
for item in PRODUCTS_TO_PROCESS:
    dest_path = os.path.join(DEST_DIR, item["filename"])
    if item["local_copy"] and os.path.exists(item["local_copy"]):
        shutil.copy(item["local_copy"], dest_path)
        print(f"[OK COPIE] {item['name']} -> {dest_path}")
        downloaded += 1
    elif item["url"]:
        try:
            req = urllib.request.Request(item["url"], headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as res, open(dest_path, 'wb') as out_f:
                shutil.copyfileobj(res, out_f)
            size = os.path.getsize(dest_path)
            print(f"[OK TELECHARGEMENT] {item['name']} ({size} octets) -> {dest_path}")
            downloaded += 1
        except Exception as e:
            print(f"[ERREUR] Impossible de télécharger {item['name']} : {e}")

print(f"\nTotal packshots USA prêts : {downloaded}/{len(PRODUCTS_TO_PROCESS)}")

print("\n=== 2. MISE À JOUR DE initialProducts.js ===")
with open("src/data/initialProducts.js", "r", encoding="utf-8") as f:
    js_content = f.read()

match = re.search(r'(export const INITIAL_PRODUCTS = )(\[[\s\S]*\])(;)', js_content)
if not match:
    print("[ERREUR] Impossible de trouver INITIAL_PRODUCTS dans le fichier.")
    exit(1)

products = json.loads(match.group(2))
id_map = {item["id"]: f"./imgs/products/usa/{item['filename']}" for item in PRODUCTS_TO_PROCESS}

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

new_js = js_content[:match.start(2)] + json.dumps(products, indent=2, ensure_ascii=False) + js_content[match.end(2):]
with open("src/data/initialProducts.js", "w", encoding="utf-8") as f:
    f.write(new_js)
print("[OK] initialProducts.js sauvegardé.")

print("\n=== 3. MISE À JOUR DE storage.js (BUMP VERSION) ===")
with open("src/data/storage.js", "r", encoding="utf-8") as f:
    storage_content = f.read()

if 'PRODUCTS: "mob_products_v5"' in storage_content:
    storage_content = storage_content.replace('PRODUCTS: "mob_products_v5"', 'PRODUCTS: "mob_products_v6"')
    with open("src/data/storage.js", "w", encoding="utf-8") as f:
        f.write(storage_content)
    print("[OK] Version passée à mob_products_v6 dans storage.js.")

print("\n=== TOUT EST TERMINÉ ! ===")
