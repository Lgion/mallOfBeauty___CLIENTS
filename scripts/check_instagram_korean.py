import sys
import json
import re
from datetime import datetime

try:
    import instaloader
except ImportError:
    print("instaloader not installed")
    sys.exit(1)

TARGET_PRODUCTS = [
    {
        "id": "mob-excel-671",
        "name": "DEMAQUILLANT - INNISFREE GEL DEMAQUILLANT",
        "keywords": ["innisfree", "demaquillant"]
    },
    {
        "id": "mob-excel-683",
        "name": "SERUM TRAITANT - COSRX BOOSTER AHA BHA Vit C",
        "keywords": ["cosrx", "booster", "aha", "bha"]
    },
    {
        "id": "mob-excel-697",
        "name": "SERUM TRAITANT - BEAUTY OF JOSEON GLOW SERUM PROPOLIS + NIACINAMIDE",
        "keywords": ["joseon", "propolis", "glow serum"]
    },
    {
        "id": "mob-excel-698",
        "name": "SERUM TRAITANT - BEAUTY OF JOSEON RICE",
        "keywords": ["joseon", "rice", "serum"]
    },
    {
        "id": "mob-excel-702",
        "name": "SERUM TRAITANT - ANUA NIACINAMIDE 10% TXA 4%",
        "keywords": ["anua", "niacinamide", "txa"]
    },
    {
        "id": "mob-excel-703",
        "name": "SERUM TRAITANT - ANUA BLEMISH 20%",
        "keywords": ["anua", "blemish"]
    },
    {
        "id": "mob-excel-784",
        "name": "CREME TRAITEMENT - BEAUTY OF JOSEON RICE SPF50 (creme solaire)",
        "keywords": ["joseon", "spf", "solaire", "sunscreen"]
    },
    {
        "id": "mob-excel-785",
        "name": "CREME TRAITEMENT - BEAUTY OF JOSEON RICE + B5 SPF50 (bleu)",
        "keywords": ["joseon", "b5", "spf"]
    },
    {
        "id": "mob-excel-825",
        "name": "CREME TRAITEMENT - DR JART+ CICAPAIR CREME TIGER GRASS",
        "keywords": ["dr jart", "dr.jart", "cicapair", "tiger grass"]
    },
    {
        "id": "mob-excel-833",
        "name": "TONER - ANUA 77%",
        "keywords": ["anua", "77"]
    },
    {
        "id": "mob-excel-836",
        "name": "TONER - BEAUTY OF JOSEON GLOW REPLENISHING RICE MILK",
        "keywords": ["joseon", "rice milk"]
    },
    {
        "id": "mob-excel-837",
        "name": "TONER - BEAUTY OF JOSEON ESSENCE RICE",
        "keywords": ["joseon", "essence", "rice"]
    },
    {
        "id": "mob-excel-848",
        "name": "TONER - TIRTIR TONER",
        "keywords": ["tirtir"]
    },
    {
        "id": "mob-excel-852",
        "name": "TONER - ESSENCE CORSX ABVE D ESCARGOT",
        "keywords": ["cosrx", "corsx", "escargot", "snail", "mucin"]
    },
    {
        "id": "mob-excel-858",
        "name": "DIVERS TRAITEMENT - COSRX TONER CICA 7 SOLUTION",
        "keywords": ["cosrx", "cica"]
    }
]

GENERAL_KOREAN_KEYWORDS = [
    "k-beauty", "kbeauty", "corée", "coree", "korea", "korean",
    "cosrx", "joseon", "anua", "innisfree", "dr.jart", "dr jart",
    "tirtir", "skin1004", "laneige", "some by mi", "mixsoon", "round lab"
]

def check_instagram(username="mallofbeauty_mofb", max_posts=150):
    print(f"[*] Initialisation d'Instaloader pour le compte : @{username}")
    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False
    )
    
    try:
        profile = instaloader.Profile.from_username(L.context, username)
        print(f"[+] Profil trouvé : {profile.username}")
        print(f"[+] Nombre total de posts : {profile.mediacount}")
        print(f"[+] Followers : {profile.followers}")
        print(f"[*] Analyse des {max_posts} derniers posts...")
    except Exception as e:
        print(f"[-] Erreur lors de l'accès au profil @{username} : {e}")
        return

    matches = []
    scanned = 0

    for post in profile.get_posts():
        scanned += 1
        caption = post.caption or ""
        caption_lower = caption.lower()
        
        # Check general Korean keywords
        has_korean = any(k in caption_lower for k in GENERAL_KOREAN_KEYWORDS)
        
        matched_products = []
        for prod in TARGET_PRODUCTS:
            # Check if all keywords or brand + key term match
            kw_matches = [k for k in prod["keywords"] if k in caption_lower]
            if len(kw_matches) >= 2 or (len(prod["keywords"]) == 1 and len(kw_matches) == 1):
                matched_products.append(prod["id"])
            elif any(k in ["anua", "tirtir", "joseon", "innisfree", "dr jart", "cicapair"] for k in kw_matches) and len(kw_matches) >= 1:
                # Potential partial match
                matched_products.append(prod["id"])

        if has_korean or matched_products:
            match_data = {
                "shortcode": post.shortcode,
                "url": f"https://www.instagram.com/p/{post.shortcode}/",
                "date": post.date_utc.strftime("%Y-%m-%d %H:%M:%S"),
                "is_video": post.is_video,
                "image_url": post.url,
                "matched_products": list(set(matched_products)),
                "caption_snippet": caption[:250].replace("\n", " "),
            }
            matches.append(match_data)
            print(f"[MATCH #{len(matches)}] Date: {match_data['date']} | Shortcode: {post.shortcode}")
            print(f"    Produits ciblés: {match_data['matched_products']}")
            print(f"    Extrait: {match_data['caption_snippet'][:120]}...")
            print("-" * 50)
            
        if scanned >= max_posts:
            break

    print(f"\n[+] Scan terminé : {scanned} posts analysés, {len(matches)} correspondances K-Beauty / Produits trouvées.")
    
    with open("scripts/instagram_matches.json", "w", encoding="utf-8") as f:
        json.dump({
            "account": username,
            "scan_date": datetime.now().isoformat(),
            "scanned_posts": scanned,
            "total_matches": len(matches),
            "matches": matches
        }, f, ensure_ascii=False, indent=2)
    print("[+] Résultats enregistrés dans scripts/instagram_matches.json")

if __name__ == "__main__":
    max_p = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    check_instagram("mallofbeauty_mofb", max_p)
