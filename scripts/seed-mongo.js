import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { INITIAL_PRODUCTS } from '../src/data/initialProducts.js';
import { STORE_INFO } from '../src/data/storeInfo.js';
import {
  DEFAULT_APPOINTMENTS,
  DEFAULT_PERSONAL_SHOPPER,
  DEFAULT_LOYALTY,
  DEFAULT_CONTACTS,
  DEFAULT_CLICKS,
  DEFAULT_GALLERY_IMAGES
} from '../src/data/seedData.js';

async function seedMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('clients');

  console.log("Connected to MongoDB Atlas: clients database");

  // 1. Products (1113 products)
  console.log(`Seeding products (${INITIAL_PRODUCTS.length} items)...`);
  const productsColl = db.collection('products');
  await productsColl.deleteMany({});
  if (INITIAL_PRODUCTS.length > 0) {
    // Insert in batches of 500 to avoid payload size issues
    for (let i = 0; i < INITIAL_PRODUCTS.length; i += 500) {
      const batch = INITIAL_PRODUCTS.slice(i, i + 500);
      await productsColl.insertMany(batch);
    }
  }
  console.log(`✓ Products seeded: ${await productsColl.countDocuments()}`);

  // 2. Appointments: Keep any real user appointments (like ach) and merge with demo
  const aptsColl = db.collection('appointments');
  const existingApts = await aptsColl.find({}).toArray();
  const realUserApts = existingApts.filter(a => !a.id?.startsWith('rdv-10'));
  await aptsColl.deleteMany({});
  const allAppointments = [...realUserApts, ...DEFAULT_APPOINTMENTS];
  // Remove MongoDB _id before insert
  const cleanedApts = allAppointments.map(({ _id, ...rest }) => rest);
  await aptsColl.insertMany(cleanedApts);
  console.log(`✓ Appointments seeded: ${await aptsColl.countDocuments()}`);

  // 3. Personal Shopper
  const psColl = db.collection('personal_shopper');
  await psColl.deleteMany({});
  await psColl.insertMany(DEFAULT_PERSONAL_SHOPPER);
  console.log(`✓ Personal Shopper seeded: ${await psColl.countDocuments()}`);

  // 4. Loyalty Members
  const loyaltyColl = db.collection('loyalty_members');
  await loyaltyColl.deleteMany({});
  await loyaltyColl.insertMany(DEFAULT_LOYALTY);
  console.log(`✓ Loyalty Members seeded: ${await loyaltyColl.countDocuments()}`);

  // 5. Contacts
  const contactsColl = db.collection('contacts');
  await contactsColl.deleteMany({});
  await contactsColl.insertMany(DEFAULT_CONTACTS);
  console.log(`✓ Contacts seeded: ${await contactsColl.countDocuments()}`);

  // 6. Store Settings
  const settingsColl = db.collection('store_settings');
  await settingsColl.deleteMany({});
  const settingsDoc = { id: "main-settings", ...STORE_INFO };
  await settingsColl.insertOne(settingsDoc);
  console.log(`✓ Store Settings seeded: ${await settingsColl.countDocuments()}`);

  // 7. Analytics Clicks
  const clicksColl = db.collection('analytics_clicks');
  await clicksColl.deleteMany({});
  await clicksColl.insertOne(DEFAULT_CLICKS);
  console.log(`✓ Analytics Clicks seeded: ${await clicksColl.countDocuments()}`);

  // 8. Gallery Images
  const galleryColl = db.collection('gallery_images');
  await galleryColl.deleteMany({});
  await galleryColl.insertMany(DEFAULT_GALLERY_IMAGES);
  console.log(`✓ Gallery Images seeded: ${await galleryColl.countDocuments()}`);

  console.log("\n MongoDB Atlas successfully seeded with all initial data!");
  await client.close();
}

seedMongoDB().catch(err => {
  console.error("Failed to seed MongoDB:", err);
  process.exit(1);
});
