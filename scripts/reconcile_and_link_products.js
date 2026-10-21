import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('.');
const MANIFEST_PATH = path.join(BASE_DIR, 'scripts/boutique_renamed_manifest.json');
const UPLOAD_MAP_PATH = path.join(BASE_DIR, 'scripts/boutique_renamed_upload_map.json');
const CATALOG_PATH = path.join(BASE_DIR, 'src/data/fullCatalogData.json');
const INITIAL_PATH = path.join(BASE_DIR, 'src/data/initialProducts.js');

function normalizeStr(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const uploadMap = JSON.parse(fs.readFileSync(UPLOAD_MAP_PATH, 'utf-8'));
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  
  const initialContent = fs.readFileSync(INITIAL_PATH, 'utf-8');
  const prefix = "export const INITIAL_PRODUCTS = ";
  const jsonPart = initialContent.split(prefix)[1].trim().replace(/;$/, '');
  const initialProducts = JSON.parse(jsonPart);

  console.log(`Total photos uploaded on Cloudinary: ${Object.keys(uploadMap).length}`);

  // Map each product in catalog to its tokens
  const indexedCatalog = catalog.map(p => {
    const brandNorm = normalizeStr(p.brand);
    const nameNorm = normalizeStr(p.name);
    return {
      id: p.id,
      brand: p.brand,
      name: p.name,
      brandNorm,
      nameNorm,
      combinedNorm: `${brandNorm} ${nameNorm}`,
      product: p
    };
  });

  const matchedLinks = []; // { catId, excelId, photoName, url, score, reason }
  const productPhotos = {}; // catId -> array of urls

  for (const [origFilename, info] of Object.entries(manifest)) {
    const finalName = info.final_filename;
    const url = uploadMap[finalName];
    if (!url) continue;

    const brandNorm = normalizeStr(info.brand);
    const titleNorm = normalizeStr(info.title);
    const slugNorm = normalizeStr(info.clean_slug);

    let bestMatch = null;
    let highestScore = 0;

    for (const catItem of indexedCatalog) {
      let score = 0;
      
      // Brand match check
      const brandMatch = brandNorm && (catItem.brandNorm.includes(brandNorm) || brandNorm.includes(catItem.brandNorm));
      if (brandMatch) score += 30;

      // Token overlap between photo title/slug and catalog product name
      const photoTokens = new Set(`${brandNorm} ${titleNorm} ${slugNorm}`.split(' ').filter(w => w.length > 2));
      const catTokens = new Set(catItem.combinedNorm.split(' ').filter(w => w.length > 2));

      let overlapCount = 0;
      for (const t of photoTokens) {
        if (catTokens.has(t)) overlapCount++;
      }
      score += overlapCount * 10;

      // Key cosmetic type matching bonus
      const types = ['lait', 'creme', 'serum', 'savon', 'gel douche', 'gommage', 'tube', 'toner', 'oil', 'baume'];
      for (const t of types) {
        if (titleNorm.includes(t) && catItem.combinedNorm.includes(t)) {
          score += 25;
        }
      }

      if (score > highestScore && score >= 45) {
        highestScore = score;
        bestMatch = catItem;
      }
    }

    if (bestMatch) {
      const num = parseInt(bestMatch.id.replace('mob-cat-', ''), 10);
      const excelId = `mob-excel-${num}`;
      
      if (!productPhotos[bestMatch.id]) {
        productPhotos[bestMatch.id] = [];
      }
      productPhotos[bestMatch.id].push(url);

      matchedLinks.push({
        catId: bestMatch.id,
        excelId,
        catalogBrand: bestMatch.brand,
        catalogName: bestMatch.name,
        photoFile: finalName,
        url,
        score: highestScore
      });
    }
  }

  console.log(`\nSuccessfully matched ${matchedLinks.length} photos to catalog products!`);
  console.log(`Unique catalog products enriched: ${Object.keys(productPhotos).length}`);

  // Update fullCatalogData.json
  let catUpdated = 0;
  for (const p of catalog) {
    if (productPhotos[p.id]) {
      const urls = productPhotos[p.id];
      p.image = urls[0];
      catUpdated++;
    }
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');

  // Update initialProducts.js
  let initUpdated = 0;
  for (const p of initialProducts) {
    const num = parseInt(p.id.replace('mob-excel-', ''), 10);
    const catId = `mob-cat-${String(num).padStart(4, '0')}`;
    if (productPhotos[catId]) {
      const urls = productPhotos[catId];
      p.image = urls[0];
      if (!Array.isArray(p.gallery)) p.gallery = [];
      for (const u of urls) {
        if (!p.gallery.includes(u)) p.gallery.push(u);
      }
      initUpdated++;
    }
  }
  const newInitialContent = `${prefix}${JSON.stringify(initialProducts, null, 2)};\n`;
  fs.writeFileSync(INITIAL_PATH, newInitialContent, 'utf-8');

  // Sync to MongoDB Atlas
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    console.log('\nSyncing enriched products to MongoDB Atlas...');
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'clients');
    const coll = db.collection('products');
    let mongoCount = 0;

    for (const p of initialProducts) {
      const num = parseInt(p.id.replace('mob-excel-', ''), 10);
      const catId = `mob-cat-${String(num).padStart(4, '0')}`;
      if (productPhotos[catId]) {
        await coll.updateOne(
          { id: p.id },
          { $set: { image: p.image, gallery: p.gallery } }
        );
        mongoCount++;
      }
    }
    await client.close();
    console.log(`✓ MongoDB Atlas updated: ${mongoCount} products enriched with real boutique photography!`);
  }

  // Save report
  fs.writeFileSync('scripts/boutique_linking_report.json', JSON.stringify({
    totalPhotos: Object.keys(manifest).length,
    uploadedPhotos: Object.keys(uploadMap).length,
    matchedPhotosCount: matchedLinks.length,
    uniqueProductsCount: Object.keys(productPhotos).length,
    matches: matchedLinks
  }, null, 2));

  console.log('Saved detailed report to scripts/boutique_linking_report.json');
}

main().catch(err => {
  console.error("Error in reconcile:", err);
  process.exit(1);
});
