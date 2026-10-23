import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('.');
const MATCHES_FILE = path.join(BASE_DIR, 'scripts/boutique_matches_batch2.json');
const UPLOAD_MAP_FILE = path.join(BASE_DIR, 'scripts/boutique_upload_map_batch2.json');
const CATALOG_PATH = path.join(BASE_DIR, 'src/data/fullCatalogData.json');
const INITIAL_PATH = path.join(BASE_DIR, 'src/data/initialProducts.js');

async function main() {
  if (!fs.existsSync(MATCHES_FILE) || !fs.existsSync(UPLOAD_MAP_FILE)) {
    console.error("Matches or Upload map file missing!");
    process.exit(1);
  }

  const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf-8'));
  const uploadMap = JSON.parse(fs.readFileSync(UPLOAD_MAP_FILE, 'utf-8'));
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));

  const validMatches = Object.values(matches).filter(m => m.matched_id && m.confidence !== 'not_found' && m.confidence !== 'error');
  console.log(`Loaded ${validMatches.length} valid product matches from Batch 2.`);

  // Map matched_id -> array of { url, title, brand, final_filename }
  const productPhotos = {};
  for (const m of validMatches) {
    const finalFilename = m.final_filename;
    const url = uploadMap[finalFilename];
    if (!url) {
      console.warn(`No Cloudinary URL found for: ${finalFilename}`);
      continue;
    }

    if (!productPhotos[m.matched_id]) {
      productPhotos[m.matched_id] = [];
    }
    productPhotos[m.matched_id].push({
      url,
      title: m.title,
      brand: m.brand,
      filename: m.filename
    });
  }

  console.log(`Unique catalog items to update: ${Object.keys(productPhotos).length}`);

  // 1. Update fullCatalogData.json
  console.log('\n--- 1. Updating src/data/fullCatalogData.json ---');
  let catalogUpdated = 0;
  for (const p of catalog) {
    if (productPhotos[p.id]) {
      const photos = productPhotos[p.id];
      const primaryUrl = photos[0].url;
      p.image = primaryUrl;
      catalogUpdated++;
      console.log(`✓ [${p.id}] ${p.brand} - ${p.name} -> ${primaryUrl}`);
    }
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Updated ${catalogUpdated} items in fullCatalogData.json`);

  // 2. Update initialProducts.js
  console.log('\n--- 2. Updating src/data/initialProducts.js ---');
  const initialContent = fs.readFileSync(INITIAL_PATH, 'utf-8');
  const prefix = "export const INITIAL_PRODUCTS = ";
  const jsonPart = initialContent.split(prefix)[1].trim().replace(/;$/, '');
  const initialProducts = JSON.parse(jsonPart);
  let initialUpdated = 0;

  for (const p of initialProducts) {
    // p.id is 'mob-excel-XXX' -> 'mob-cat-0XXX'
    const num = parseInt(p.id.replace('mob-excel-', ''), 10);
    const catId = `mob-cat-${String(num).padStart(4, '0')}`;

    if (productPhotos[catId]) {
      const photos = productPhotos[catId];
      const primaryUrl = photos[0].url;
      p.image = primaryUrl;

      if (!Array.isArray(p.gallery)) {
        p.gallery = [];
      }
      for (const ph of photos) {
        if (!p.gallery.includes(ph.url)) {
          p.gallery.push(ph.url);
        }
      }
      initialUpdated++;
      console.log(`✓ Initial [${p.id}] ${p.name} -> ${primaryUrl} (gallery: ${p.gallery.length})`);
    }
  }

  const newInitialContent = `${prefix}${JSON.stringify(initialProducts, null, 2)};\n`;
  fs.writeFileSync(INITIAL_PATH, newInitialContent, 'utf-8');
  console.log(`Updated ${initialUpdated} featured items in initialProducts.js`);

  // 3. Update MongoDB Atlas if available
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    console.log('\n--- 3. Updating MongoDB Atlas ---');
    try {
      const client = new MongoClient(mongoUri);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB || 'clients');
      const productsColl = db.collection('products');
      let mongoUpdated = 0;

      for (const p of initialProducts) {
        const num = parseInt(p.id.replace('mob-excel-', ''), 10);
        const catId = `mob-cat-${String(num).padStart(4, '0')}`;
        if (productPhotos[catId]) {
          await productsColl.updateOne(
            { id: p.id },
            { $set: { image: p.image, gallery: p.gallery } }
          );
          mongoUpdated++;
        }
      }
      console.log(`Updated ${mongoUpdated} documents in MongoDB.`);
      await client.close();
    } catch (err) {
      console.warn("MongoDB update warning:", err.message);
    }
  }

  console.log('\n✨ Linking Complete!');
}

main().catch(err => {
  console.error("Linking script failed:", err);
  process.exit(1);
});
