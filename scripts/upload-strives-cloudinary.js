import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const STRIVES_DIR = path.resolve('public/strives/images');
const UPLOAD_FOLDER = 'mallofbeauty_assets/strives';

// Read all referenced files
const initial = fs.readFileSync("src/data/initialProducts.js", "utf-8");
const full = fs.readFileSync("src/data/fullCatalogData.json", "utf-8");

const matches = new Set();
const regex = /["\x27](?:\.?\/)?strives\/images\/([^"\x27]+)["\x27]/g;
let m;
while ((m = regex.exec(initial)) !== null) matches.add(m[1]);
while ((m = regex.exec(full)) !== null) matches.add(m[1]);

const filesToUpload = Array.from(matches);
console.log(`Found ${filesToUpload.length} files to upload to Cloudinary folder ${UPLOAD_FOLDER}`);

const mapPath = 'scripts/strives_upload_map.json';
let strivesMap = {};
if (fs.existsSync(mapPath)) {
  try {
    strivesMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
  } catch (e) {}
}

async function uploadFile(fileName) {
  if (strivesMap[fileName]) {
    return { fileName, url: strivesMap[fileName] };
  }
  const filePath = path.join(STRIVES_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: UPLOAD_FOLDER,
    use_filename: true,
    unique_filename: false,
    overwrite: true
  });
  strivesMap[fileName] = result.secure_url;
  return { fileName, url: result.secure_url };
}

async function run() {
  const queue = [...filesToUpload];
  const CONCURRENCY = 6;
  let active = 0;
  let completed = 0;

  await new Promise((resolve, reject) => {
    function next() {
      if (completed === filesToUpload.length) {
        return resolve();
      }
      while (active < CONCURRENCY && queue.length > 0) {
        const file = queue.shift();
        active++;
        uploadFile(file)
          .then(res => {
            completed++;
            active--;
            if (res) {
              console.log(`[${completed}/${filesToUpload.length}] Uploaded: ${file}`);
            }
            next();
          })
          .catch(err => {
            console.error(`Error uploading ${file}:`, err.message);
            completed++;
            active--;
            next();
          });
      }
    }
    next();
  });

  fs.writeFileSync(mapPath, JSON.stringify(strivesMap, null, 2));
  console.log(`Uploaded all files. Map saved to ${mapPath}`);

  // Now replace in initialProducts.js and fullCatalogData.json
  const targetFiles = [
    'src/data/initialProducts.js',
    'src/data/fullCatalogData.json'
  ];

  for (const f of targetFiles) {
    let content = fs.readFileSync(f, 'utf-8');
    let count = 0;
    for (const [fileName, url] of Object.entries(strivesMap)) {
      const patterns = [
        `./strives/images/${fileName}`,
        `/strives/images/${fileName}`,
        `strives/images/${fileName}`
      ];
      for (const p of patterns) {
        if (content.includes(p)) {
          content = content.split(p).join(url);
          count++;
        }
      }
    }
    fs.writeFileSync(f, content, 'utf-8');
    console.log(`Updated ${f} with ${count} Cloudinary replacements.`);
  }
}

run().catch(console.error);
