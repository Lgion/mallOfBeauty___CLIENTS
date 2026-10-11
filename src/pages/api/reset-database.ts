import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../lib/mongodb';
import { INITIAL_PRODUCTS } from '../../data/initialProducts.js';
import { STORE_INFO } from '../../data/storeInfo.js';
import {
  DEFAULT_APPOINTMENTS,
  DEFAULT_PERSONAL_SHOPPER,
  DEFAULT_LOYALTY,
  DEFAULT_CONTACTS,
  DEFAULT_CLICKS,
  DEFAULT_GALLERY_IMAGES
} from '../../data/seedData.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { db } = await connectToDatabase();

    // 1. Products
    const productsColl = db.collection('products');
    await productsColl.deleteMany({});
    if (INITIAL_PRODUCTS.length > 0) {
      for (let i = 0; i < INITIAL_PRODUCTS.length; i += 500) {
        const batch = INITIAL_PRODUCTS.slice(i, i + 500);
        await productsColl.insertMany(batch);
      }
    }

    // 2. Appointments (preserve real non-demo bookings if requested, or clean seed)
    const aptsColl = db.collection('appointments');
    await aptsColl.deleteMany({});
    const cleanedApts = DEFAULT_APPOINTMENTS.map(({ ...rest }: any) => rest);
    await aptsColl.insertMany(cleanedApts);

    // 3. Personal Shopper
    const psColl = db.collection('personal_shopper');
    await psColl.deleteMany({});
    await psColl.insertMany(DEFAULT_PERSONAL_SHOPPER);

    // 4. Loyalty Members
    const loyaltyColl = db.collection('loyalty_members');
    await loyaltyColl.deleteMany({});
    await loyaltyColl.insertMany(DEFAULT_LOYALTY);

    // 5. Contacts
    const contactsColl = db.collection('contacts');
    await contactsColl.deleteMany({});
    await contactsColl.insertMany(DEFAULT_CONTACTS);

    // 6. Store Settings
    const settingsColl = db.collection('store_settings');
    await settingsColl.deleteMany({});
    await settingsColl.insertOne({ id: "main-settings", ...STORE_INFO });

    // 7. Analytics Clicks
    const clicksColl = db.collection('analytics_clicks');
    await clicksColl.deleteMany({});
    await clicksColl.insertOne(DEFAULT_CLICKS);

    // 8. Gallery Images
    const galleryColl = db.collection('gallery_images');
    await galleryColl.deleteMany({});
    await galleryColl.insertMany(DEFAULT_GALLERY_IMAGES);

    return new Response(JSON.stringify({
      success: true,
      message: "Base de données MongoDB réinitialisée avec succès avec les données factices d'origine.",
      counts: {
        products: INITIAL_PRODUCTS.length,
        appointments: DEFAULT_APPOINTMENTS.length,
        personal_shopper: DEFAULT_PERSONAL_SHOPPER.length,
        loyalty_members: DEFAULT_LOYALTY.length,
        contacts: DEFAULT_CONTACTS.length,
        gallery_images: DEFAULT_GALLERY_IMAGES.length
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("Erreur lors de la réinitialisation de MongoDB:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Erreur serveur" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
