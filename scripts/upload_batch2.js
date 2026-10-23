import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_DIR = path.resolve('.');
const STAGING_DIR = path.join(BASE_DIR, 'public/imgs/products/boutique_v2');
const MAP_FILE = path.join(BASE_DIR, 'scripts/boutique_upload_map_batch2.json');
const UPLOAD_FOLDER = 'mallofbeauty_assets/boutique_v2';

let uploadMap = {};
if (fs.existsSync(MAP_FILE)) {
  try {
    uploadMap = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
  } catch (e) {
    uploadMap = {};
  }
}

async function uploadFile(fileName) {
  if (uploadMap[fileName]) {
    return { fileName, url: uploadMap[fileName], cached: true };
  }

  const filePath = path.join(STAGING_DIR, fileName);
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

  uploadMap[fileName] = result.secure_url;
  fs.writeFileSync(MAP_FILE, JSON.stringify(uploadMap, null, 2));
  return { fileName, url: result.secure_url, cached: false };
}

async function main() {
  if (!fs.existsSync(STAGING_DIR)) {
    console.error(`Staging directory not found: ${STAGING_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
  console.log(`Starting upload of ${files.length} images to Cloudinary (${UPLOAD_FOLDER})...`);

  const queue = [...files];
  const CONCURRENCY = 6;
  let active = 0;
  let completed = 0;

  await new Promise((resolve) => {
    function next() {
      if (completed === files.length) {
        return resolve();
      }

      while (active < CONCURRENCY && queue.length > 0) {
        const file = queue.shift();
        active++;
        uploadFile(file)
          .then((res) => {
            if (res) {
              const tag = res.cached ? '⚡ Cached' : '✅ Uploaded';
              console.log(`[${completed + 1}/${files.length}] ${tag}: ${res.fileName}`);
            }
          })
          .catch((err) => {
            console.error(`❌ Failed: ${file}`, err.message);
          })
          .finally(() => {
            active--;
            completed++;
            next();
          });
      }
    }
    next();
  });

  console.log(`\n🎉 Upload Complete! ${Object.keys(uploadMap).length} files hosted on Cloudinary.`);
  console.log(`Saved mapping to ${MAP_FILE}`);
}

main().catch(err => {
  console.error("Upload script failed:", err);
  process.exit(1);
});
