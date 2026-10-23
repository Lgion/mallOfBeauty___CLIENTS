import json

with open('scripts/boutique_renamed_manifest.json') as f:
    mf = json.load(f)

with open('scripts/boutique_linking_report.json') as f:
    lr = json.load(f)

matches_by_photo = {m['photoFile']: m for m in lr.get('matches', [])}

lines = []
lines.append('# Tableau complet des correspondances - Batch 1 (`ignore/new/1`)')
lines.append(f'> Total : **{len(mf)} photos** | Associées au catalogue : **150** | Non cataloguées directement : **92**\n')
lines.append('| N° | Fichier Original (WhatsApp) | Produit Identifié sur la photo | Produit Catalogue MoB | Réf Catalogue | Statut | Nouveau Nom Fichier |')
lines.append('|---|---|---|---|---|---|---|')

for i, (orig_name, item) in enumerate(mf.items(), 1):
    final_fn = item.get('final_filename', '-')
    brand = item.get('brand') or ''
    title = item.get('title') or ''
    p_ident = f'**{brand}** - {title}' if brand else title
    
    if final_fn in matches_by_photo:
        m = matches_by_photo[final_fn]
        cat_id = m.get('catId', '-')
        cb = m.get('catalogBrand', '')
        cn = m.get('catalogName', '')
        cat_name = f'{cb} | {cn}'.strip(' |')
        statut = f'Associé (score: {m.get("score", 0)})'
    else:
        cat_id = '-'
        cat_name = '*(Non catalogué directement)*'
        statut = 'Non catalogué'
        
    lines.append(f'| {i} | `{orig_name}` | {p_ident} | **{cat_name}** | `{cat_id}` | `{statut}` | `{final_fn}` |')

with open('scripts/CORRESPONDANCES_BATCH1.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'Successfully generated scripts/CORRESPONDANCES_BATCH1.md with {len(mf)} items.')
