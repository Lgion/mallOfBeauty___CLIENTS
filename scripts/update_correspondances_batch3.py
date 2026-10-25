import json

with open('scripts/boutique_matches_batch3.json') as f:
    b3 = json.load(f)

# Count photos per product
cat_counts = {}
for k, v in b3.items():
    cid = v.get('matched_id')
    cat_counts[cid] = cat_counts.get(cid, 0) + 1

lines = []
lines.append("# Tableau des correspondances - Batch 3 (`ignore/new/3`)")
lines.append("> 📌 **Explication des chiffres :**")
lines.append("> - **55 photos uniques** traitées et hébergées sur Cloudinary.")
lines.append("> - **48 nouveaux produits distincts créés** dans le catalogue (`mob-cat-1281` à `mob-cat-1328`).")
lines.append("> - **7 produits possèdent 2 photos** (face / dos / angles) regroupées dans leur fiche en galerie multi-photos, ce qui évite les doublons en boutique.")
lines.append("> - Le catalogue passe ainsi de **1 280 à 1 328 produits** (1 280 + 48 = 1 328).\n")
lines.append("| N° | Fichier Original (WhatsApp) | Produit Identifié sur la photo | Nouveau Produit Créé au Catalogue | Nouvelle Réf MoB | Photos fiche | Nom Fichier Hébergé (Cloudinary) |")
lines.append("|---|---|---|---|---|---|---|")

for i, (orig_name, item) in enumerate(b3.items(), 1):
    final_fn = item.get("final_filename", "-")
    brand = item.get("brand") or ""
    title = item.get("title") or ""
    p_ident = f"**{brand}** - {title}" if brand else title
    matched_name = item.get("matched_name") or "-"
    matched_id = item.get("matched_id") or "-"
    count = cat_counts.get(matched_id, 1)
    photo_info = f"2 photos (galerie)" if count > 1 else "1 photo"
    
    lines.append(f"| {i} | `{orig_name}` | {p_ident} | **{matched_name}** | `{matched_id}` | {photo_info} | `{final_fn}` |")

with open('scripts/CORRESPONDANCES_BATCH3.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Successfully updated scripts/CORRESPONDANCES_BATCH3.md")
