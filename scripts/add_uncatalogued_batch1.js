import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('.');
const MANIFEST_FILE = path.join(BASE_DIR, 'scripts/boutique_renamed_manifest.json');
const LINKING_REPORT_FILE = path.join(BASE_DIR, 'scripts/boutique_linking_report.json');
const UPLOAD_MAP_FILE = path.join(BASE_DIR, 'scripts/boutique_renamed_upload_map.json');
const CATALOG_PATH = path.join(BASE_DIR, 'src/data/fullCatalogData.json');
const INITIAL_PATH = path.join(BASE_DIR, 'src/data/initialProducts.js');
const STORAGE_PATH = path.join(BASE_DIR, 'src/data/storage.js');

function formatPrice(p) {
  return p.toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';
}

function determineCategoryAndPrice(brand, title) {
  const b = (brand || '').trim();
  const t = (title || '').trim();
  const lower = `${b} ${t}`.toLowerCase();

  let category = "Dermocosmétique & Soins";
  let subcategory = "Crèmes & Soins Visage";
  let initialCat = "soins-visage";
  let initialLabel = "Soins Visage & Crèmes";
  let price = 16500;
  let desc = `Soin authentique ${b} ${t} pour sublimer votre éclat et préserver la santé de votre peau.`;
  let usage = "Appliquer matin et soir sur une peau préalablement nettoyée et séchée.";

  if (lower.includes('scrub') || lower.includes('gommage') || lower.includes('exfoliat')) {
    subcategory = "Gommages & Exfoliants";
    initialCat = "soins-corps";
    initialLabel = "Gommages & Exfoliants";
    price = lower.includes('teal') || lower.includes('tree hut') ? 14500 : 12500;
    desc = `Gommage exfoliant ${b} ${t} aux micro-grains naturels pour éliminer les cellules mortes et lisser la peau.`;
    usage = "Masser délicatement sur peau humide 1 à 2 fois par semaine puis rincer à l'eau tiède.";
  } else if (lower.includes('lait') || lower.includes('body lotion') || lower.includes('milk') || lower.includes('body wash') || lower.includes('douche')) {
    if (lower.includes('body wash') || lower.includes('douche') || lower.includes('wash')) {
      subcategory = "Gels Douche & Nettoyants";
      initialCat = "soins-corps";
      initialLabel = "Gels Douche & Bains";
      price = 12500;
      desc = `Gel nettoyant soyeux ${b} ${t} pour purifier le corps tout en maintenant l'hydratation naturelle.`;
      usage = "Faire mousser sur l'ensemble du corps lors du bain ou de la douche, puis rincer.";
    } else {
      subcategory = "Laits & Soins Corps";
      initialCat = "soins-corps";
      initialLabel = "Soins Corps & Laits";
      price = lower.includes('samira') ? 35000 : 22000;
      desc = `Lait hydratant corporel ${b} ${t} pour unifier le teint et redonner souplesse et éclat à la peau.`;
      usage = "Appliquer chaque jour sur le corps après la douche en légers massages.";
    }
  } else if (lower.includes('savon') || lower.includes('soap')) {
    subcategory = "Savons & Pains Purifiants";
    initialCat = "soins-corps";
    initialLabel = "Savons & Nettoyants";
    price = 8500;
    desc = `Pain de toilette nettoyant et clarifiant ${b} ${t} pour purifier et revitaliser la peau au quotidien.`;
    usage = "Faire mousser sur peau humide, nettoyer délicatement puis rincer abondamment.";
  } else if (lower.includes('serum') || lower.includes('sérum') || lower.includes('ampoule') || lower.includes('booster')) {
    subcategory = "Sérums & Boosters";
    initialCat = "soins-visage";
    initialLabel = "Soins Visage & Sérums";
    price = lower.includes('beauty of joseon') || lower.includes('dr. jart') || lower.includes('medicube') ? 22500 : 18500;
    desc = `Sérum concentré ${b} ${t} aux principes actifs ciblés pour corriger les irrégularités et illuminer le teint.`;
    usage = "Déposer 3 à 4 gouttes sur le visage et le cou avant votre soin hydratant.";
  } else if (lower.includes('cleanser') || lower.includes('toner') || lower.includes('tonic') || lower.includes('lotion tonique') || lower.includes('nettoyant')) {
    subcategory = "Sérums & Boosters";
    initialCat = "soins-visage";
    initialLabel = "Toniques & Nettoyants";
    price = 15000;
    desc = `Soin équilibrant ${b} ${t} pour nettoyer les pores en profondeur et raviver la fraîcheur cutanée.`;
    usage = "Appliquer sur un coton ou directement du bout des doigts sur une peau propre.";
  } else if (lower.includes('oil') || lower.includes('huile')) {
    subcategory = "Huiles, Baumes & Corps";
    initialCat = "soins-corps";
    initialLabel = "Huiles & Élixirs";
    price = 12000;
    desc = `Huile précieuse ${b} ${t} pour nourrir intensément et restaurer le film hydrolipidique de la peau.`;
    usage = "Appliquer quelques gouttes sur le corps ou le visage en massant jusqu'à absorption.";
  } else if (lower.includes('spot corrector') || lower.includes('fade cream') || lower.includes('tube') || lower.includes('crema') || lower.includes('treatment')) {
    subcategory = "Traitements & Tubes Ciblés";
    initialCat = "soins-visage";
    initialLabel = "Traitements Ciblés";
    price = 14500;
    desc = `Soin correcteur ciblé ${b} ${t} pour estomper les taches pigmentaires et unifier les zones sombres.`;
    usage = "Appliquer localement sur les imperfections ou zones ciblées matin et soir.";
  }

  return { category, subcategory, initialCat, initialLabel, price, desc, usage };
}

async function run() {
  const mf = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
  const lr = JSON.parse(fs.readFileSync(LINKING_REPORT_FILE, 'utf-8'));
  const uploadMap = JSON.parse(fs.readFileSync(UPLOAD_MAP_FILE, 'utf-8'));
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));

  const initialContent = fs.readFileSync(INITIAL_PATH, 'utf-8');
  const prefix = "export const INITIAL_PRODUCTS = ";
  const jsonPart = initialContent.split(prefix)[1].trim().replace(/;$/, '');
  const initialProducts = JSON.parse(jsonPart);

  const matchedPhotoFiles = new Set(lr.matches.map(m => m.photoFile));
  
  // Extract unmatched entries from manifest
  const unmatchedEntries = Object.entries(mf).filter(([k, v]) => !matchedPhotoFiles.has(v.final_filename));
  console.log(`Found ${unmatchedEntries.length} uncatalogued photos in Batch 1.`);

  // Group by slug/title to avoid duplicating multi-photos of the same product
  const productsMap = {};
  for (const [origKey, item] of unmatchedEntries) {
    const slug = item.clean_slug || item.final_filename.replace(/\.jpg$/, '');
    // normalize base slug (remove trailing _01, _02 if any)
    const baseSlug = slug.replace(/_0\d+$/, '');
    if (!productsMap[baseSlug]) {
      productsMap[baseSlug] = {
        baseSlug,
        brand: (item.brand || 'MALL OF BEAUTY').trim(),
        title: (item.title || slug.replace(/_/g, ' ')).trim(),
        photos: []
      };
    }
    const fn = item.final_filename;
    const url = uploadMap[fn] || uploadMap[origKey];
    if (url) {
      productsMap[baseSlug].photos.push({ filename: fn, url, origKey });
    } else {
      console.warn(`No Cloudinary URL found for: ${fn}`);
    }
  }

  const uniqueProductList = Object.values(productsMap);
  console.log(`Aggregated into ${uniqueProductList.length} unique products to create.`);

  let maxCatNum = Math.max(...catalog.map(it => parseInt(it.id.replace('mob-cat-', ''), 10) || 0));
  let maxExcelNum = Math.max(...initialProducts.map(it => parseInt(it.id.replace('mob-excel-', ''), 10) || 0));

  console.log(`Current maxCatNum: ${maxCatNum}, maxExcelNum: ${maxExcelNum}`);

  const newCatalogItems = [];
  const newInitialItems = [];

  for (const p of uniqueProductList) {
    if (p.photos.length === 0) continue;

    maxCatNum++;
    maxExcelNum++;

    const catId = `mob-cat-${String(maxCatNum).padStart(4, '0')}`;
    const excelId = `mob-excel-${maxExcelNum}`;

    const brand = p.brand && p.brand !== 'Unknown' && p.brand !== 'Generic' ? p.brand : 'MALL OF BEAUTY';
    let cleanTitle = p.title;
    if (cleanTitle.toLowerCase().startsWith(brand.toLowerCase())) {
      cleanTitle = cleanTitle.substring(brand.length).trim().replace(/^[-–:]+/, '').trim();
    }
    if (!cleanTitle) cleanTitle = p.title;

    const primaryUrl = p.photos[0].url;
    const galleryUrls = p.photos.map(ph => ph.url);

    const { category, subcategory, initialCat, initialLabel, price, desc, usage } = determineCategoryAndPrice(brand, cleanTitle);

    // 1. Catalog item
    newCatalogItems.push({
      id: catId,
      brand: brand.toUpperCase(),
      name: cleanTitle.toUpperCase(),
      price: price,
      priceFormatted: formatPrice(price),
      category: category,
      description: desc,
      badge: "Nouveauté",
      inStock: true,
      image: primaryUrl,
      subcategory: subcategory
    });

    // 2. Initial item
    newInitialItems.push({
      id: excelId,
      name: `${brand.toUpperCase()} - ${cleanTitle.toUpperCase()}`,
      category: initialCat,
      categoryLabel: initialLabel,
      price: price,
      isFeatured: false,
      stock: 10,
      image: primaryUrl,
      gallery: galleryUrls,
      brand: brand.toUpperCase(),
      shortDesc: `${brand} - ${cleanTitle}. Soin authentique garanti.`,
      description: desc,
      usage: usage,
      rating: 4.8,
      reviewsCount: 14,
      tags: ["Nouveauté", "Boutique"]
    });
  }

  console.log(`Inserting ${newCatalogItems.length} new products into fullCatalogData.json...`);
  const updatedCatalog = [...catalog, ...newCatalogItems];
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedCatalog, null, 2), 'utf-8');

  console.log(`Inserting ${newInitialItems.length} new products into initialProducts.js...`);
  const updatedInitial = [...initialProducts, ...newInitialItems];
  fs.writeFileSync(INITIAL_PATH, `${prefix}${JSON.stringify(updatedInitial, null, 2)};\n`, 'utf-8');

  // Bump cache keys in storage.js
  let storageContent = fs.readFileSync(STORAGE_PATH, 'utf-8');
  storageContent = storageContent.replace(/mob_full_catalog_v\d+/, 'mob_full_catalog_v7');
  storageContent = storageContent.replace(/mob_products_v\d+/, 'mob_products_v10');
  fs.writeFileSync(STORAGE_PATH, storageContent, 'utf-8');
  console.log(`Bumped cache version in storage.js to mob_full_catalog_v7 & mob_products_v10`);

  // Update MongoDB Atlas
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
      console.log(`Upserted ${inserted} new products into MongoDB Atlas!`);
      await client.close();
    } catch (err) {
      console.warn("MongoDB sync warning:", err.message);
    }
  }

  console.log(`\n🎉 BATCH 1 INTEGRATION COMPLETE: Added ${newCatalogItems.length} new products! Catalog total: ${updatedCatalog.length}`);
}

run().catch(err => {
  console.error("Error adding batch 1 uncatalogued items:", err);
  process.exit(1);
});
