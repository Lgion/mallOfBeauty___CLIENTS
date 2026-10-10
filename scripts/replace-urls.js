import fs from 'fs';
import path from 'path';

const mapFile = 'scripts/upload_map.json';
if (!fs.existsSync(mapFile)) {
  console.error("Map file not found");
  process.exit(1);
}

const uploadedMap = JSON.parse(fs.readFileSync(mapFile, 'utf-8'));

const filesToUpdate = [
  'src/data/initialProducts.js',
  'src/data/storeInfo.js',
  'src/components/AdminDashboard.js',
  'src/pages/index.astro',
  'src/data/storage.js', // It has defaults like './imgs/stands_esthetique.jpg'
  'src/data/fullCatalogData.json'
];

for (const file of filesToUpdate) {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;

  for (const [relPath, cloudUrl] of Object.entries(uploadedMap)) {
    // Look for variations of the local path
    const local1 = `./imgs/${relPath}`;
    const local2 = `/imgs/${relPath}`;
    const local3 = `imgs/${relPath}`;
    
    // We do a global replace
    if (content.includes(local1)) { content = content.split(local1).join(cloudUrl); changes++; }
    if (content.includes(local2)) { content = content.split(local2).join(cloudUrl); changes++; }
    if (content.includes(local3)) { content = content.split(local3).join(cloudUrl); changes++; }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file} (${changes} replacements)`);
  } else {
    console.log(`No changes needed in ${file}`);
  }
}
