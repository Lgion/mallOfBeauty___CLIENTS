import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_DIR = path.resolve('.');
const IMAGES_DIR = path.join(BASE_DIR, 'ignore/new/1');
const STAGING_DIR = path.join(BASE_DIR, 'public/imgs/products/boutique');
const MATCHES_FILE = path.join(BASE_DIR, 'scripts/boutique_matches.json');
const MAP_FILE = path.join(BASE_DIR, 'scripts/boutique_upload_map.json');
const CATALOG_PATH = path.join(BASE_DIR, 'src/data/fullCatalogData.json');
const INITIAL_PATH = path.join(BASE_DIR, 'src/data/initialProducts.js');

const UPLOAD_FOLDER = 'mallofbeauty_assets/boutique';

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

let uploadMap = {};
if (fs.existsSync(MAP_FILE)) {
  try {
    uploadMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
  } catch (e) {
    uploadMap = {};
  }
}

async function main() {
  if (!fs.existsSync(MATCHES_FILE)) {
    console.error(`Matches file not found: ${MATCHES_FILE}`);
    process.exit(1);
  }

  const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf-8'));
  const validMatches = Object.entries(matches).filter(([_, info]) => {
    return info.matched_id && info.confidence !== 'not_found' && info.confidence !== 'error';
  });

  console.log(`Loaded ${Object.keys(matches).length} analyzed items, ${validMatches.length} with valid catalog match.`);

  // 1. Stage and Upload to Cloudinary
  console.log('\n--- 1. Staging & Cloudinary Upload ---');
  const productUrlMap = {}; // matched_id -> array of { url, slug }

  for (const [filename, info] of validMatches) {
    const origPath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(origPath)) {
      console.warn(`File not found: ${origPath}`);
      continue;
    }

    const shortHash = (info.hash || 'img').substring(0, 6);
    const slug = info.clean_slug || 'produit_boutique';
    const stagedFilename = `prod_${slug}_${shortHash}.jpg`;
    const stagedPath = path.join(STAGING_DIR, stagedFilename);

    if (!fs.existsSync(stagedPath)) {
      fs.copyFileSync(origPath, stagedPath);
    }

    let secureUrl = uploadMap[stagedFilename];
    if (!secureUrl) {
      console.log(`Uploading ${stagedFilename} to Cloudinary...`);
      try {
        const uploadRes = await cloudinary.uploader.upload(stagedPath, {
          folder: UPLOAD_FOLDER,
          use_filename: true,
          unique_filename: false,
          overwrite: true
        });
        secureUrl = uploadRes.secure_url;
        uploadMap[stagedFilename] = secureUrl;
        fs.writeFileSync(MAP_FILE, JSON.stringify(uploadMap, null, 2));
        console.log(`✅ Uploaded: ${secureUrl}`);
      } catch (err) {
        console.error(`❌ Upload failed for ${stagedFilename}:`, err.message);
        continue;
      }
    } else {
      console.log(`⚡ Already on Cloudinary: ${stagedFilename}`);
    }

    if (!productUrlMap[info.matched_id]) {
      productUrlMap[info.matched_id] = [];
    }
    productUrlMap[info.matched_id].push({
      url: secureUrl,
      excel_id: info.excel_id,
      brand: info.brand,
      name: info.product_name_on_bottle,
      filename
    });
  }

  // 2. Update fullCatalogData.json
  console.log('\n--- 2. Updating src/data/fullCatalogData.json ---');
  const fullCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  let catalogUpdatedCount = 0;

  for (const p of fullCatalog) {
    if (productUrlMap[p.id]) {
      const items = productUrlMap[p.id];
      const primaryUrl = items[0].url;
      p.image = primaryUrl;
      catalogUpdatedCount++;
      console.log(`✓ Catalog [${p.id}] ${p.brand} - ${p.name} -> ${primaryUrl}`);
    }
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(fullCatalog, null, 2), 'utf-8');
  console.log(`Updated ${catalogUpdatedCount} products in fullCatalogData.json`);

  // 3. Update initialProducts.js
  console.log('\n--- 3. Updating src/data/initialProducts.js ---');
  const initialContent = fs.readFileSync(INITIAL_PATH, 'utf-8');
  const prefix = "export const INITIAL_PRODUCTS = ";
  const jsonPart = initialContent.split(prefix)[1].trim().replace(/;$/, '');
  const initialProducts = JSON.parse(jsonPart);
  let initialUpdatedCount = 0;

  for (const p of initialProducts) {
    // Find if any cat_id matches this excel_id
    // p.id is 'mob-excel-100'
    const num = parseInt(p.id.replace('mob-excel-', ''), 10);
    const catId = `mob-cat-${String(num).padStart(4, '0')}`;
    
    if (productUrlMap[catId]) {
      const items = productUrlMap[catId];
      const primaryUrl = items[0].url;
      const allUrls = items.map(it => it.url);

      p.image = primaryUrl;
      if (!Array.isArray(p.gallery)) {
        p.gallery = [];
      }
      for (const u of allUrls) {
        if (!p.gallery.includes(u)) {
          p.gallery.push(u);
        }
      }
      initialUpdatedCount++;
      console.log(`✓ Initial [${p.id}] ${p.name} -> ${primaryUrl} (gallery: ${p.gallery.length})`);
    }
  }

  const newInitialContent = `${prefix}${JSON.stringify(initialProducts, null, 2)};\n`;
  fs.writeFileSync(INITIAL_PATH, newInitialContent, 'utf-8');
  console.log(`Updated ${initialUpdatedCount} products in initialProducts.js`);

  // 4. Update MongoDB Atlas
  console.log('\n--- 4. Updating MongoDB Atlas ---');
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn("MONGODB_URI not found in .env, skipping Mongo update.");
    return;
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'clients');
  const productsColl = db.collection('products');
  let mongoUpdatedCount = 0;

  for (const p of initialProducts) {
    const num = parseInt(p.id.replace('mob-excel-', ''), 10);
    const catId = `mob-cat-${String(num).padStart(4, '0')}`;
    if (productUrlMap[catId]) {
      const res = await productsColl.updateOne(
        { id: p.id },
        { 
          $set: { 
            image: p.image,
            gallery: p.gallery
          }
        }
      );
      if (res.modifiedCount > 0 || res.matchedCount > 0) {
        mongoUpdatedCount++;
        console.log(`✓ MongoDB updated [${p.id}]: ${p.name}`);
      }
    }
  }
  await client.close();
  console.log(`MongoDB update completed: ${mongoUpdatedCount} documents updated.`);

  console.log('\n=========================================');
  console.log(`🎉 Pipeline Summary:`);
  console.log(`- Catalog products updated: ${catalogUpdatedCount}`);
  console.log(`- Initial products updated: ${initialUpdatedCount}`);
  console.log(`- MongoDB products updated: ${mongoUpdatedCount}`);
  console.log('=========================================\n');
}

main().catch(err => {
  console.error("Error in sync_boutique_products:", err);
  process.exit(1);
});
