import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMGS_DIR = path.resolve('public/imgs');
const UPLOAD_FOLDER = 'mallofbeauty_assets';

const uploadedMap = {}; // mapping local path relative to 'imgs' to Cloudinary URL

async function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await walkDir(filePath));
    } else {
      if (!file.endsWith('.svg') && !file.endsWith('.xlsx')) { // SVGs might not upload cleanly without specific params or we can just leave them
        results.push(filePath);
      }
    }
  }
  return results;
}

async function uploadImages() {
  console.log('Finding images in', IMGS_DIR);
  const files = await walkDir(IMGS_DIR);
  
  for (const filePath of files) {
    const relPath = path.relative(IMGS_DIR, filePath);
    console.log(`Uploading ${relPath}...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `${UPLOAD_FOLDER}/${path.dirname(relPath) === '.' ? '' : path.dirname(relPath)}`,
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      uploadedMap[relPath] = result.secure_url;
      console.log(`✅ Success: ${result.secure_url}`);
    } catch (e) {
      console.error(`❌ Failed to upload ${relPath}:`, e.message);
    }
  }

  // Save the mapping for replacement
  fs.writeFileSync('scripts/upload_map.json', JSON.stringify(uploadedMap, null, 2));
  console.log('Upload complete. Map saved to scripts/upload_map.json');
}

uploadImages();
