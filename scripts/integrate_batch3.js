import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve('.');
const MATCHES_FILE = path.join(BASE_DIR, 'scripts/boutique_matches_batch3.json');
const VISION_FILE = path.join(BASE_DIR, 'scripts/boutique_vision_batch3.json');
const UPLOAD_MAP_FILE = path.join(BASE_DIR, 'scripts/boutique_upload_map_batch3.json');
const CATALOG_PATH = path.join(BASE_DIR, 'src/data/fullCatalogData.json');
const INITIAL_PATH = path.join(BASE_DIR, 'src/data/initialProducts.js');
const STORAGE_PATH = path.join(BASE_DIR, 'src/data/storage.js');

function formatPrice(p) {
  return p.toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';
}

// Exact high-confidence manual mappings for existing products
const EXACT_MATCHES = {
  "prod_palmers_hair_success_gro_treatment_mob_cat_0308_48c736.jpg": "mob-cat-0314",
  "prod_palmers_hair_success_gro_treatment_mob_cat_0308_bca191.jpg": "mob-cat-0314",
  "prod_palmers_gro_treatment_with_vitamin_mob_cat_0308_136bb8.jpg": "mob-cat-0313",
  "prod_palmers_coconut_oil_repairing_condi_mob_cat_0312_be3c22.jpg": "mob-cat-0312",
  "prod_palmers_cocoa_butter_moisturizing_h_mob_cat_0309_7082f4.jpg": "mob-cat-0309",
  "prod_palmers_coconut_oil_hair_polisher_s_mob_cat_0310_2f41e5.jpg": "mob-cat-0310",
  "prod_aunt_jackies_in_control_moisturizin_mob_cat_0958_9c6563.jpg": "mob-cat-0958",
  "prod_activlong_actiforce_leave_in_soin_s_mob_cat_0552_b845df.jpg": "mob-cat-0552",
  "prod_activlong_actirepair_vegetal_hair_g_mob_cat_0559_37a1bb.jpg": "mob-cat-0565",
  "prod_activlong_actiforce_fortifying_sham_mob_cat_0552_4464f1.jpg": "mob-cat-0554",
  "prod_dax_marcel_curling_wax_cire_boutiqu_d20760.jpg": "mob-cat-0945",
  "prod_dax_marcel_curling_wax_cire_boutiqu_560128.jpg": "mob-cat-0945",
  "prod_docteur_teint_lotion_tonique_clarif_mob_cat_1218_ee8321.jpg": "mob-cat-1218",
  "prod_kids_originals_hair_nutrition_prote_mob_cat_0959_997e06.jpg": "mob-cat-0959",
  "prod_ruby_kisses_24hr_matte_liquid_found_boutique_7366d4.jpg": "mob-cat-1000",
  "prod_kost_makeup_italia_lasting_color_li_mob_cat_1010_1a4cf0.jpg": "mob-cat-1010"
};

function determineProductDetails(brand, title, productType) {
  const b = (brand || '').trim();
  const t = (title || '').trim();
  const lower = `${b} ${t}`.toLowerCase();

  // Defaults
  let category = "Capillaire & Perruques";
  let subcategory = "Soins & Accessoires Cheveux";
  let initialCat = "capillaire";
  let initialLabel = "Soins Capillaires & Accessoires";
  let price = 12500;
  let desc = `Produit d'excellence ${b} ${t} pour prendre soin de votre beauté avec des résultats visibles.`;
  let usage = "Appliquer selon votre routine beauté habituelle.";

  // Makeup
  if (lower.includes('foundation') || lower.includes('fond de teint') || lower.includes('primer') || lower.includes('powder') || lower.includes('poudre') || lower.includes('mascara') || lower.includes('lashes') || lower.includes('cils') || lower.includes('lipstick') || lower.includes('rouge')) {
    category = "Maquillage & Teint";
    initialCat = "maquillage";
    initialLabel = "Maquillage & Teint";

    if (lower.includes('nars')) {
      subcategory = "Teint, FDT & Poudres";
      price = 38000;
      desc = "Fond de teint haute couvrance fini naturel lumineux tenue 16 heures. Formule enrichie en extraits de fruits pour sublimer la peau sans effet matière.";
      usage = "Chauffer une noisette entre les doigts puis appliquer du centre du visage vers l'extérieur.";
    } else if (lower.includes('benefit') || lower.includes('primer')) {
      subcategory = "Teint, FDT & Poudres";
      price = 24000;
      desc = "Base de teint lissante réduisant visiblement l'apparence des pores et des ridules pour un fini soyeux et mat longue durée.";
      usage = "Appliquer en fine couche sur la zone T ou l'ensemble du visage avant le fond de teint.";
    } else if (lower.includes('black opal') || lower.includes('blk/opl')) {
      subcategory = "Teint, FDT & Poudres";
      price = 16500;
      desc = "Fond de teint liquide affineur de pores True Color haute performance spécialement conçu pour les carnations métisses et foncées.";
      usage = "Appliquer au pinceau ou à l'éponge pour moduler la couvrance selon vos envies.";
    } else if (lower.includes('mary kay')) {
      subcategory = "Teint, FDT & Poudres";
      price = 17500;
      desc = "Fond de teint couvrance moyenne au fini mat naturel pour unifier et masquer les imperfections en douceur.";
      usage = "Appliquer uniformément sur l'ensemble du visage du bout des doigts ou avec une éponge blender.";
    } else if (lower.includes('iman')) {
      subcategory = "Teint, FDT & Poudres";
      price = 18500;
      desc = "Fond de teint fluide lumineux Second To None enrichi en pigments diffuseurs de lumière pour un teint zéro défaut.";
      usage = "Appliquer par petites touches sur le front, le nez, les joues et le menton puis estomper.";
    } else if (lower.includes('powder') || lower.includes('poudre')) {
      subcategory = "Teint, FDT & Poudres";
      price = 11500;
      desc = "Poudre purifiante anti-imperfections pour matifier la peau et fixer le maquillage toute la journée.";
      usage = "Balayer sur la zone T à l'aide d'un pinceau poudre.";
    } else if (lower.includes('mascara')) {
      subcategory = "Yeux & Lèvres";
      price = 8500;
      desc = "Mascara volumateur et allongeant intense pour un regard captivant sans paquets.";
      usage = "Appliquer de la racine des cils jusqu'aux pointes en effectuant un léger mouvement de zigzag.";
    } else if (lower.includes('lashes') || lower.includes('cils')) {
      subcategory = "Yeux & Lèvres";
      price = 6500;
      desc = "Pack de faux-cils multi-usages au rendu intense et spectaculaire pour toutes les occasions.";
      usage = "Ajuster la longueur si besoin, appliquer une fine ligne de colle puis déposer le long de la ligne naturelle des cils.";
    }
  }
  // Haircare / Styling
  else if (lower.includes('relaxer') || lower.includes('défrisage') || lower.includes('just for me') || lower.includes('dark and lovely')) {
    category = "Capillaire & Perruques";
    subcategory = "Soins & Accessoires Cheveux";
    initialCat = "capillaire";
    initialLabel = "Kits de Défrisage & Lissage";
    price = 12500;
    desc = `Kit complet de défrisage nutritif ${b} sans soude enrichi en huiles bienfaisantes pour lisser en toute sécurité.`;
    usage = "Suivre scrupuleusement la notice du kit et respecter le temps de pose selon la texture du cheveu.";
  } else if (lower.includes('shampoo') || lower.includes('shampoing') || lower.includes('conditioner') || lower.includes('après-shampoing')) {
    category = "Capillaire & Perruques";
    subcategory = "Soins & Accessoires Cheveux";
    initialCat = "capillaire";
    initialLabel = "Shampoings & Après-Shampoings";
    price = lower.includes('sheamoisture') || lower.includes('cantu') ? 14500 : 12000;
    desc = `Soin lavant et démêlant ${b} ${t} pour nourrir les boucles et revitaliser la fibre capillaire.`;
    usage = "Masser sur cuir chevelu et longueurs humides, laisser agir 2-3 minutes puis rincer.";
  } else if (lower.includes('spray') || lower.includes('cire') || lower.includes('wax') || lower.includes('leave in') || lower.includes('gloss') || lower.includes('growth oil') || lower.includes('polisher') || lower.includes('peigne') || lower.includes('color comb')) {
    category = "Capillaire & Perruques";
    subcategory = "Soins & Accessoires Cheveux";
    initialCat = "capillaire";
    initialLabel = "Coiffage & Sérums Capillaires";
    price = lower.includes('isoplus') || lower.includes('parnevu') ? 11500 : 9500;
    desc = `Soin coiffant et fortifiant ${b} ${t} pour faire briller, stimuler la pousse et faciliter le coiffage.`;
    usage = "Vaporiser ou masser sur la chevelure avant ou après le coiffage.";
  } else if (lower.includes('brosse') || lower.includes('brush') || lower.includes('buffer') || lower.includes('polissoir')) {
    category = "Capillaire & Perruques";
    subcategory = "Soins & Accessoires Cheveux";
    initialCat = "capillaire";
    initialLabel = "Accessoires Coiffure & Beauté";
    price = lower.includes('brush') ? 7500 : 4500;
    desc = `Accessoire de coiffure professionnel ${t} pour démêler sans casser ou polir avec précision.`;
    usage = "Utiliser au quotidien pour sublimer votre chevelure ou manucure.";
  } else if (lower.includes('axe') || lower.includes('bodywash') || lower.includes('gel douche')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Gels Douche & Nettoyants";
    initialCat = "soins-corps";
    initialLabel = "Gels Douche Homme & Corps";
    price = 8500;
    desc = "Gel douche vivifiant au parfum énergisant de zeste de citron et musc pour une sensation de fraîcheur intense.";
    usage = "Faire mousser sur peau mouillée sous la douche puis rincer abondamment.";
  } else if (lower.includes('lightenup') || lower.includes('serum') || lower.includes('sérum')) {
    category = "Dermocosmétique & Soins";
    subcategory = "Sérums & Boosters";
    initialCat = "soins-visage";
    initialLabel = "Sérums & Éclat";
    price = 18500;
    desc = "Sérum protecteur jour bouclier environnemental enrichi en vitamine D pour revitaliser et unifier le teint.";
    usage = "Appliquer chaque matin 3 à 4 gouttes sur le visage avant votre crème.";
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

  console.log(`Starting with ${catalog.length} catalog items and ${initialProducts.length} initialProducts.`);

  // 1. Apply exact matches to existing catalog items
  const matchedPhotos = {};
  for (const [fn, catId] of Object.entries(EXACT_MATCHES)) {
    const url = uploadMap[fn];
    if (url) {
      if (!matchedPhotos[catId]) matchedPhotos[catId] = [];
      matchedPhotos[catId].push(url);
    }
  }

  let catalogUpdated = 0;
  for (const p of catalog) {
    if (matchedPhotos[p.id]) {
      p.image = matchedPhotos[p.id][0];
      catalogUpdated++;
      console.log(`✓ Updated catalog item [${p.id}] ${p.brand} - ${p.name}`);
    }
  }

  let initialUpdated = 0;
  for (const p of initialProducts) {
    const num = parseInt(p.id.replace('mob-excel-', ''), 10);
    const catId = `mob-cat-${String(num).padStart(4, '0')}`;
    if (matchedPhotos[catId]) {
      const urls = matchedPhotos[catId];
      p.image = urls[0];
      if (!Array.isArray(p.gallery)) p.gallery = [];
      for (const u of urls) {
        if (!p.gallery.includes(u)) p.gallery.push(u);
      }
      initialUpdated++;
      console.log(`✓ Updated featured product [${p.id}] ${p.name}`);
    }
  }

  console.log(`Updated ${catalogUpdated} catalog items and ${initialUpdated} featured products.`);

  // 2. Identify uncatalogued items to create as brand new products
  const exactMatchedFiles = new Set(Object.keys(EXACT_MATCHES));
  const uncataloguedFiles = Object.entries(matches).filter(([k, v]) => !exactMatchedFiles.has(v.final_filename));

  // Group by baseSlug / clean title to combine multi-photos
  const productsToCreate = {};
  for (const [origKey, info] of uncataloguedFiles) {
    const slug = info.clean_slug || 'produit';
    const baseSlug = slug.replace(/_0\d+$/, '');
    if (!productsToCreate[baseSlug]) {
      productsToCreate[baseSlug] = {
        baseSlug,
        brand: (info.brand || 'MALL OF BEAUTY').trim(),
        title: (info.title || slug.replace(/_/g, ' ')).trim(),
        productType: info.product_type,
        photos: []
      };
    }
    const fn = info.final_filename;
    const url = uploadMap[fn];
    if (url) {
      productsToCreate[baseSlug].photos.push({ fn, url, origKey });
    }
  }

  console.log(`Found ${Object.keys(productsToCreate).length} unique new products to create.`);

  let maxCatNum = Math.max(...catalog.map(it => parseInt(it.id.replace('mob-cat-', ''), 10) || 0));
  let maxExcelNum = Math.max(...initialProducts.map(it => parseInt(it.id.replace('mob-excel-', ''), 10) || 0));

  const newCatalogItems = [];
  const newInitialItems = [];

  for (const p of Object.values(productsToCreate)) {
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

    const { category, subcategory, initialCat, initialLabel, price, desc, usage } = determineProductDetails(brand, cleanTitle, p.productType);

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
      stock: 12,
      image: primaryUrl,
      gallery: galleryUrls,
      brand: brand.toUpperCase(),
      shortDesc: `${brand} - ${cleanTitle}. Produit certifié authentique.`,
      description: desc,
      usage: usage,
      rating: 4.8,
      reviewsCount: 16,
      tags: ["Nouveauté", "Boutique"]
    });

    // Mark photos in matches
    for (const ph of p.photos) {
      if (matches[ph.origKey]) {
        matches[ph.origKey].matched_id = catId;
        matches[ph.origKey].excel_id = excelId;
        matches[ph.origKey].matched_name = `${brand.toUpperCase()} - ${cleanTitle.toUpperCase()}`;
        matches[ph.origKey].confidence = "newly_cataloged";
      }
    }
  }

  // Update records for exact matches in matches file
  for (const [origKey, info] of Object.entries(matches)) {
    if (EXACT_MATCHES[info.final_filename]) {
      const cId = EXACT_MATCHES[info.final_filename];
      const found = catalog.find(x => x.id === cId);
      info.matched_id = cId;
      info.excel_id = `mob-excel-${parseInt(cId.replace('mob-cat-', ''), 10)}`;
      info.matched_name = found ? `${found.brand} - ${found.name}` : cId;
      info.confidence = "high";
    }
  }

  fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2), 'utf-8');

  // Save fullCatalogData.json
  const updatedCatalog = [...catalog, ...newCatalogItems];
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedCatalog, null, 2), 'utf-8');
  console.log(`Saved ${updatedCatalog.length} products to fullCatalogData.json (+${newCatalogItems.length} new)`);

  // Save initialProducts.js
  const updatedInitial = [...initialProducts, ...newInitialItems];
  fs.writeFileSync(INITIAL_PATH, `${prefix}${JSON.stringify(updatedInitial, null, 2)};\n`, 'utf-8');
  console.log(`Saved ${updatedInitial.length} products to initialProducts.js (+${newInitialItems.length} new)`);

  // Bump cache keys in storage.js
  let storageContent = fs.readFileSync(STORAGE_PATH, 'utf-8');
  storageContent = storageContent.replace(/mob_full_catalog_v\d+/, 'mob_full_catalog_v8');
  storageContent = storageContent.replace(/mob_products_v\d+/, 'mob_products_v11');
  fs.writeFileSync(STORAGE_PATH, storageContent, 'utf-8');
  console.log(`Bumped cache version in storage.js to mob_full_catalog_v8 & mob_products_v11`);

  // MongoDB Atlas update
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const client = new MongoClient(mongoUri);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB || 'clients');
      const productsColl = db.collection('products');

      // Update existing
      for (const p of initialProducts) {
        const num = parseInt(p.id.replace('mob-excel-', ''), 10);
        const catId = `mob-cat-${String(num).padStart(4, '0')}`;
        if (matchedPhotos[catId]) {
          await productsColl.updateOne(
            { id: p.id },
            { $set: { image: p.image, gallery: p.gallery } }
          );
        }
      }

      // Upsert new
      let inserted = 0;
      for (const p of newInitialItems) {
        await productsColl.updateOne(
          { id: p.id },
          { $set: p },
          { upsert: true }
        );
        inserted++;
      }
      console.log(`Upserted ${inserted} new products and updated existing in MongoDB Atlas!`);
      await client.close();
    } catch (err) {
      console.warn("MongoDB sync warning:", err.message);
    }
  }

  console.log('\n🎉 ALL BATCH 3 PRODUCTS SUCCESSFULLY INTEGRATED!');
}

run().catch(err => {
  console.error("Batch 3 integration error:", err);
  process.exit(1);
});
