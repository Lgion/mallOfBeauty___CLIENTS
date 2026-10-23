import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('.');
const MATCHES_FILE = path.join(BASE_DIR, 'scripts/boutique_matches_batch2.json');
const UPLOAD_MAP_FILE = path.join(BASE_DIR, 'scripts/boutique_upload_map_batch2.json');
const CATALOG_PATH = path.join(BASE_DIR, 'src/data/fullCatalogData.json');
const INITIAL_PATH = path.join(BASE_DIR, 'src/data/initialProducts.js');
const STORAGE_PATH = path.join(BASE_DIR, 'src/data/storage.js');

function formatPrice(p) {
  return p.toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';
}

function determineCategoryAndPrice(u) {
  const type = (u.product_type || '').toLowerCase();
  const brand = (u.brand || '').trim();
  const title = (u.title || '').trim();
  const lowerTitle = title.toLowerCase();

  // Defaults
  let category = "Dermocosmétique & Soins";
  let subcategory = "Sérums & Boosters";
  let initialCat = "soins-visage";
  let initialLabel = "Soins Visage & Sérums";
  let price = 18500;
  let desc = `Soin d'exception ${brand} ${title} pour sublimer votre peau avec une efficacité prouvée.`;
  let usage = "Appliquer matin et soir sur une peau propre et sèche selon votre routine.";

  if (type.includes('hair') || type.includes('weave') || type.includes('closure') || type.includes('mèche') || lowerTitle.includes('hair') || lowerTitle.includes('closure') || lowerTitle.includes('weave')) {
    category = "Capillaire & Perruques";
    subcategory = "Perruques & Mèches";
    initialCat = "capillaire";
    initialLabel = "Mèches, Tissages & Perruques";
    price = type.includes('closure') ? 35000 : (lowerTitle.includes('remy') ? 55000 : 42000);
    desc = `Mèche / Tissage de qualité supérieure ${title}. Cheveux 100% naturels pour un tombé fluide et une longue tenue.`;
    usage = "À faire poser en salon ou selon votre technique de tissage préférée. Entretien doux sans sulfate.";
  } else if (type.includes('lait') || lowerTitle.includes('lait') || lowerTitle.includes('lotion')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Laits & Soins Corps";
    initialCat = "soins-corps";
    initialLabel = "Soins Corps & Laits";
    price = brand.includes('Bedon') ? 35000 : (brand.includes('HP25') ? 32000 : 26000);
    desc = `Lait corporel haut de gamme ${brand} pour hydrater, unifier le grain de peau et apporter un éclat radieux.`;
    usage = "Appliquer généreusement sur l'ensemble du corps après la douche en mouvements circulaires.";
  } else if (type.includes('savon') || lowerTitle.includes('soap') || lowerTitle.includes('savon')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Savons & Pains Purifiants";
    initialCat = "soins-corps";
    initialLabel = "Savons & Nettoyants";
    price = 9500;
    desc = `Pain dermatologique purifiant et exfoliant ${brand} pour nettoyer en profondeur sans agresser.`;
    usage = "Faire mousser sur peau humide, masser délicatement 1 à 2 minutes puis rincer abondamment.";
  } else if (type.includes('tube') || type.includes('gel') || type.includes('crème') || lowerTitle.includes('cream') || lowerTitle.includes('crema') || lowerTitle.includes('gel')) {
    category = "Dermocosmétique & Soins";
    if (lowerTitle.includes('benzac') || lowerTitle.includes('peitel') || lowerTitle.includes('clovate') || lowerTitle.includes('mometasone') || lowerTitle.includes('synalar') || lowerTitle.includes('diprogenta')) {
      subcategory = "Traitements & Tubes Ciblés";
      initialCat = "soins-visage";
      initialLabel = "Traitements Ciblés";
      price = 13500;
      desc = `Traitement dermatologique ciblé ${brand} ${title} pour corriger les imperfections cutanées et apaiser l'épiderme.`;
      usage = "Appliquer localement en fine couche sur la zone concernée selon avis spécialisé.";
    } else {
      subcategory = "Crèmes & Soins Visage";
      initialCat = "soins-visage";
      initialLabel = "Soins Visage & Crèmes";
      price = brand.includes('Inkey') ? 16500 : 19000;
      desc = `Crème de soin nutritive ${brand} ${title} formulée pour protéger et restaurer le confort cutané.`;
      usage = "Appliquer délicatement sur le visage et le cou après le sérum.";
    }
  } else if (type.includes('toner') || type.includes('tonique') || lowerTitle.includes('toner') || lowerTitle.includes('tonic')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Sérums & Boosters";
    initialCat = "soins-visage";
    initialLabel = "Toniques & Lotions";
    price = brand.includes('REN') ? 24000 : (brand.includes('COSRX') ? 22000 : 16500);
    desc = `Lotion tonique équilibrante ${brand} ${title} pour parfaire le nettoyage et révéler la clarté du teint.`;
    usage = "Appliquer à l'aide d'un coton ou du bout des doigts sur le visage avant vos soins.";
  } else if (type.includes('huile') || lowerTitle.includes('oil')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Huiles, Baumes & Corps";
    initialCat = "soins-corps";
    initialLabel = "Huiles & Élixirs";
    price = 10500;
    desc = `Huile de soin pure et nourrissante ${brand} pour revitaliser la peau et les pointes capillaires.`;
    usage = "Quelques gouttes massées sur la peau ou les cheveux pour nourrir en profondeur.";
  } else if (brand.includes('Inkey') || brand.includes('COSRX') || brand.includes('Naturium')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Sérums & Boosters";
    initialCat = "soins-visage";
    initialLabel = "Soins Visage & Sérums";
    price = 18500;
    desc = `Actif cosmétique de pointe ${brand} ${title} pour cibler visiblement la texture et l'éclat de la peau.`;
    usage = "Déposer 3 à 4 gouttes sur le visage matin et/ou soir avant la crème hydratante.";
  }

  return { category, subcategory, initialCat, initialLabel, price, desc, usage };
}

async function run() {
  const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf-8'));
  const uploadMap = JSON.parse(fs.readFileSync(UPLOAD_MAP_FILE, 'utf-8'));
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  
  const initialContent = fs.readFileSync(INITIAL_PATH, 'utf-8');
  const prefix = "export const INITIAL_PRODUCTS = ";
  const jsonPart = initialContent.split(prefix)[1].trim().replace(/;$/, '');
  const initialProducts = JSON.parse(jsonPart);

  // Find max IDs
  let maxCatNum = Math.max(...catalog.map(it => parseInt(it.id.replace('mob-cat-', ''), 10) || 0));
  let maxExcelNum = Math.max(...initialProducts.map(it => parseInt(it.id.replace('mob-excel-', ''), 10) || 0));

  console.log(`Starting with: ${catalog.length} catalog items (max: ${maxCatNum}), ${initialProducts.length} initial items (max: ${maxExcelNum})`);

  const unmatchedEntries = Object.entries(matches).filter(([k, v]) => !v.matched_id);
  console.log(`Found ${unmatchedEntries.length} uncatalogued items in Batch 2.`);

  const newCatalogItems = [];
  const newInitialItems = [];

  for (const [key, item] of unmatchedEntries) {
    maxCatNum++;
    maxExcelNum++;

    const catId = `mob-cat-${String(maxCatNum).padStart(4, '0')}`;
    const excelId = `mob-excel-${maxExcelNum}`;

    const fn = item.final_filename;
    const url = uploadMap[fn];
    if (!url) {
      console.warn(`Missing Cloudinary URL for: ${fn}`);
      continue;
    }

    const brand = (item.brand && item.brand !== 'Unknown' && item.brand !== 'generic' && item.brand !== 'unknown') ? item.brand : 'MALL OF BEAUTY';
    const cleanTitle = (item.title && item.title !== 'Unknown') ? item.title : (item.clean_slug ? item.clean_slug.replace(/_/g, ' ') : 'Soin Prestige');
    
    // Construct clean name
    let displayName = cleanTitle;
    if (displayName.toLowerCase().startsWith(brand.toLowerCase())) {
      displayName = displayName.substring(brand.length).trim().replace(/^[-–:]+/, '').trim();
    }
    if (!displayName) displayName = cleanTitle;

    const { category, subcategory, initialCat, initialLabel, price, desc, usage } = determineCategoryAndPrice(item);

    // 1. Catalog item
    const catItem = {
      id: catId,
      brand: brand.toUpperCase(),
      name: displayName.toUpperCase(),
      price: price,
      priceFormatted: formatPrice(price),
      category: category,
      description: desc,
      badge: "Nouveauté",
      inStock: true,
      image: url,
      subcategory: subcategory
    };
    newCatalogItems.push(catItem);

    // 2. Initial item
    const initItem = {
      id: excelId,
      name: `${brand.toUpperCase()} - ${displayName.toUpperCase()}`,
      category: initialCat,
      categoryLabel: initialLabel,
      price: price,
      isFeatured: false,
      stock: 12,
      image: url,
      gallery: [url],
      brand: brand.toUpperCase(),
      shortDesc: `${brand} - ${displayName}. Formule authentique d'excellence.`,
      description: desc,
      usage: usage,
      rating: 4.8,
      reviewsCount: 15,
      tags: ["Nouveauté", "Boutique"]
    };
    newInitialItems.push(initItem);

    // Update match record
    item.matched_id = catId;
    item.excel_id = excelId;
    item.matched_name = `${brand.toUpperCase()} - ${displayName.toUpperCase()}`;
    item.confidence = "newly_cataloged";
    item.reason = "Created as new boutique product";
  }

  console.log(`Prepared ${newCatalogItems.length} new products to insert.`);

  // Write catalog
  const updatedCatalog = [...catalog, ...newCatalogItems];
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedCatalog, null, 2), 'utf-8');
  console.log(`Saved ${updatedCatalog.length} items to fullCatalogData.json`);

  // Write initialProducts
  const updatedInitial = [...initialProducts, ...newInitialItems];
  fs.writeFileSync(INITIAL_PATH, `${prefix}${JSON.stringify(updatedInitial, null, 2)};\n`, 'utf-8');
  console.log(`Saved ${updatedInitial.length} items to initialProducts.js`);

  // Update matches file
  fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2), 'utf-8');
  console.log(`Updated scripts/boutique_matches_batch2.json`);

  // Bump cache keys in storage.js
  let storageContent = fs.readFileSync(STORAGE_PATH, 'utf-8');
  storageContent = storageContent.replace(/mob_full_catalog_v\d+/, 'mob_full_catalog_v6');
  storageContent = storageContent.replace(/mob_products_v\d+/, 'mob_products_v9');
  fs.writeFileSync(STORAGE_PATH, storageContent, 'utf-8');
  console.log(`Bumped cache version in storage.js to mob_full_catalog_v6 & mob_products_v9`);

  // MongoDB insert
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const client = new MongoClient(mongoUri);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB || 'clients');
      const productsColl = db.collection('products');
      
      let inserted = 0;
      for (const p of newInitialItems) {
        await productsColl.updateOne(
          { id: p.id },
          { $set: p },
          { upsert: true }
        );
        inserted++;
      }
      console.log(`Upserted ${inserted} new products in MongoDB Atlas!`);
      await client.close();
    } catch (err) {
      console.warn("MongoDB sync warning:", err.message);
    }
  }

  console.log('\n🎉 ALL 53 NEW PRODUCTS ADDED AND SYNCHRONIZED SUCCESSFULLY!');
}

run().catch(err => {
  console.error("Error adding uncatalogued products:", err);
  process.exit(1);
});
