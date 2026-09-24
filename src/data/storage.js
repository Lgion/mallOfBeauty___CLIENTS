import { INITIAL_PRODUCTS } from "./initialProducts.js";
import { STORE_INFO } from "./storeInfo.js";
import fullCatalogData from "./fullCatalogData.json";

const STORAGE_KEYS = {
  PRODUCTS: "mob_products_v3",
  FULL_CATALOG: "mob_full_catalog_v1",
  APPOINTMENTS: "mob_appointments_v3",
  PERSONAL_SHOPPER: "mob_personal_shopper_v3",
  LOYALTY_MEMBERS: "mob_loyalty_members_v3",
  CONTACTS: "mob_contacts_v3",
  ANALYTICS_CLICKS: "mob_analytics_clicks_v3",
  STORE_SETTINGS: "mob_store_settings_v1",
  CART: "mob_cart_v1",
  REVIEWS: "mob_reviews_v1"
};

const listeners = new Set();

function emitChange(event) {
  listeners.forEach(cb => {
    try {
      cb(event);
    } catch (e) {
      console.error("Error in storage listener", e);
    }
  });
}

export function subscribeToDataChanges(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// --- DONNÉES FACTICES RÉALISTES ABIDJAN (MoB) ---
export const DEFAULT_APPOINTMENTS = [
  {
    id: "rdv-101",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    fullName: "Aïcha Traoré",
    phone: "+225 07 48 12 34 56",
    email: "aicha.traore@gmail.com",
    type: "Femme Enceinte & Allaitante",
    mode: "En boutique (Les Vallons)",
    preferredDate: "2026-09-25",
    preferredTime: "11:00",
    notes: "Cherche une routine sans parfum pour traiter des taches apparues pendant la grossesse.",
    status: "Confirmé"
  },
  {
    id: "rdv-102",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    fullName: "Koffi Jean-Luc",
    phone: "+225 05 74 98 11 22",
    email: "jeanluc.koffi@yahoo.fr",
    type: "Soins Homme (Front sombre & Barbe)",
    mode: "En boutique (Les Vallons)",
    preferredDate: "2026-09-26",
    preferredTime: "15:30",
    notes: "Problème d'hyperpigmentation au front suite à de longues expositions au soleil et boutons récurrents sous le menton.",
    status: "En attente"
  },
  {
    id: "rdv-103",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    fullName: "Mariam Coulibaly",
    phone: "+225 07 01 23 45 67",
    email: "mariam.coulibaly@gmail.com",
    type: "Future Mariée (Coup d'Éclat)",
    mode: "En boutique (Les Vallons)",
    preferredDate: "2026-09-28",
    preferredTime: "14:00",
    notes: "Mariage prévu dans 3 semaines. Souhaite un diagnostic complet et un protocole coup d'éclat doux.",
    status: "Confirmé"
  },
  {
    id: "rdv-104",
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    fullName: "Sarah Bamba",
    phone: "+225 01 44 55 66 77",
    email: "sarah.bamba@outlook.fr",
    type: "Acné & Pores Dilatés (K-Beauty)",
    mode: "Téléphone / WhatsApp",
    preferredDate: "2026-09-29",
    preferredTime: "10:00",
    notes: "Peau mixte à grasse. A testé plusieurs sérums sans succès. Veut des conseils d'experte.",
    status: "En attente"
  },
  {
    id: "rdv-105",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    fullName: "Estelle N'Dri",
    phone: "+225 07 89 01 23 45",
    email: "estelle.ndri@ci-telecom.ci",
    type: "Anti-Âge & Rétinol",
    mode: "En boutique (Les Vallons)",
    preferredDate: "2026-09-23",
    preferredTime: "16:00",
    notes: "Première utilisation de rétinol. Diagnostic réalisé, routine personnalisée Anua + Centella adoptée.",
    status: "Terminé"
  }
];

export const DEFAULT_PERSONAL_SHOPPER = [
  {
    id: "ps-201",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    clientName: "Béatrice Konan",
    clientPhone: "+225 07 09 88 77 66",
    itemRequested: "Parfum Baccarat Rouge 540 Extrait (70ml)",
    category: "Parfumerie Exclusivité",
    targetBudget: "280 000 FCFA",
    notes: "Flacon rouge original introuvable sur Abidjan. Acompte de 60% versé via Wave.",
    status: "En recherche active",
    depositStatus: "Acompte 60% Reçu (168 000 FCFA)"
  },
  {
    id: "ps-202",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    clientName: "Ibrahim Touré",
    clientPhone: "+225 05 11 22 33 44",
    itemRequested: "Sac cuir italien Florence cuir grainé noir",
    category: "Maroquinerie de Luxe",
    targetBudget: "195 000 FCFA",
    notes: "Commandé spécialement pour un anniversaire de mariage. Pièce unique sourcée en Italie.",
    status: "Trouvé & En transit",
    depositStatus: "Acompte 60% Reçu (117 000 FCFA)"
  },
  {
    id: "ps-203",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    clientName: "Sokhna Diop",
    clientPhone: "+225 07 65 43 21 00",
    itemRequested: "Pagne Vlisco Grand Super Édition Collector Anniversaire 6 yards",
    category: "Pagnes Vlisco Collector",
    targetBudget: "220 000 FCFA",
    notes: "Motif rare vert émeraude et or. Acompte en cours de versement par virement.",
    status: "En attente d'acompte",
    depositStatus: "En attente d'acompte (132 000 FCFA)"
  },
  {
    id: "ps-204",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    clientName: "Patricia Gnahoré",
    clientPhone: "+225 07 98 76 54 32",
    itemRequested: "Coffret Medicube Age-R Booster Pro K-Beauty",
    category: "K-Beauty Tech",
    targetBudget: "240 000 FCFA",
    notes: "Appareil de beauté importé directement de Séoul. Prêt pour retrait aux Vallons.",
    status: "Arrivé en boutique",
    depositStatus: "Acompte 60% Reçu (144 000 FCFA)"
  }
];

export const DEFAULT_LOYALTY = [
  {
    id: "loyalty-01",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    fullName: "Marie-Josée Gbagbo",
    phone: "+225 07 12 34 56 78",
    birthDate: "1992-10-14",
    neighborhood: "Cocody Ambassades",
    favoriteCategory: "Pagnes Vlisco Grand Super & K-Beauty",
    discountStatus: "Anniversaire dans 3 semaines (-10% prêt)"
  },
  {
    id: "loyalty-02",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    fullName: "Dr. Armand Brou",
    phone: "+225 05 98 76 54 32",
    birthDate: "1985-04-20",
    neighborhood: "Les Deux Plateaux Vallons",
    favoriteCategory: "Gamme Homme & Parfumerie",
    discountStatus: "Carte Privilège Active"
  },
  {
    id: "loyalty-03",
    createdAt: new Date(Date.now() - 3600000 * 160).toISOString(),
    fullName: "Aminata Fofana",
    phone: "+225 07 55 66 77 88",
    birthDate: "1988-09-30",
    neighborhood: "Riviera 3 / Bonoumin",
    favoriteCategory: "Soins Corps Éclat & Glow",
    discountStatus: "Membre VIP Gold (-15% permanent)"
  },
  {
    id: "loyalty-04",
    createdAt: new Date(Date.now() - 3600000 * 200).toISOString(),
    fullName: "Marc-Olivier Kouassi",
    phone: "+225 01 23 45 67 89",
    birthDate: "1979-12-05",
    neighborhood: "Le Plateau & Les Vallons",
    favoriteCategory: "Maroquinerie & Cadeaux d'Affaires",
    discountStatus: "Carte Privilège Active"
  },
  {
    id: "loyalty-05",
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    fullName: "Sandrine Kra",
    phone: "+225 07 88 99 00 11",
    birthDate: "1995-09-28",
    neighborhood: "Angré 7e Tranche",
    favoriteCategory: "Soins Bébés Mustela & Maman",
    discountStatus: "Anniversaire ce mois-ci (-10% envoyé)"
  }
];

export const DEFAULT_CONTACTS = [
  {
    id: "msg-001",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    name: "Yasmine Sylla",
    phone: "+225 07 77 88 99 00",
    subject: "Renseignement K-Beauty",
    message: "Bonjour Mall of Beauty, avez-vous la gamme complète de Beauty of Joseon en stock actuellement à la boutique des Vallons ?",
    status: "Non lu"
  },
  {
    id: "msg-002",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    name: "Franck Bédié",
    phone: "+225 05 55 44 33 22",
    subject: "Livraison Intérieur",
    message: "Je voudrais savoir si vous livrez à Yamoussoukro pour une commande groupée de produits corporels de 100 000 FCFA.",
    status: "Répondu par WhatsApp"
  },
  {
    id: "msg-003",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    name: "Carole Zadi",
    phone: "+225 07 49 12 34 88",
    subject: "Réservation Pagne Vlisco",
    message: "Je recherche le pagne Vlisco Grand Super motif 'L'œil de bœuf' fond bleu royal. Pouvez-vous me le mettre de côté jusqu'à samedi ?",
    status: "En cours de traitement"
  },
  {
    id: "msg-004",
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    name: "David Ehui",
    phone: "+225 01 02 03 04 05",
    subject: "Conseils soins homme",
    message: "Quel savon et quelle crème me conseillez-vous pour éviter les boutons après le rasage de la barbe ?",
    status: "Résolu"
  }
];

export const DEFAULT_CLICKS = {
  total: 58,
  phone_call: 12,
  whatsapp: 22,
  instagram: 9,
  tiktok: 7,
  booking: 5,
  shopper: 4,
  loyalty: 5,
  lastEvent: "Initialisation du suivi analytique MoB",
  updatedAt: new Date().toISOString()
};

// --- INITIAL SEEDING AUTOMATIQUE & AUTO-RÉPARATION ---
function initData() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STORE_SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(STORE_INFO));
  }
  
  // Rendez-vous (auto-seed si vide ou moins de 3)
  try {
    const storedAppts = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || "[]");
    if (!Array.isArray(storedAppts) || storedAppts.length < 3) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
  }

  // Personal Shopper (auto-seed si vide ou moins de 2)
  try {
    const storedPS = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERSONAL_SHOPPER) || "[]");
    if (!Array.isArray(storedPS) || storedPS.length < 2) {
      localStorage.setItem(STORAGE_KEYS.PERSONAL_SHOPPER, JSON.stringify(DEFAULT_PERSONAL_SHOPPER));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_SHOPPER, JSON.stringify(DEFAULT_PERSONAL_SHOPPER));
  }

  // Carte Privilège (auto-seed si vide ou moins de 3)
  try {
    const storedLoyalty = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOYALTY_MEMBERS) || "[]");
    if (!Array.isArray(storedLoyalty) || storedLoyalty.length < 3) {
      localStorage.setItem(STORAGE_KEYS.LOYALTY_MEMBERS, JSON.stringify(DEFAULT_LOYALTY));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.LOYALTY_MEMBERS, JSON.stringify(DEFAULT_LOYALTY));
  }

  // Messages de Contact (auto-seed si vide ou moins de 2)
  try {
    const storedContacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || "[]");
    if (!Array.isArray(storedContacts) || storedContacts.length < 2) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
  }

  // Analytics Clics (auto-seed si total inexistant ou 0)
  try {
    const storedClicks = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS_CLICKS) || "null");
    if (!storedClicks || !storedClicks.total) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS_CLICKS, JSON.stringify(DEFAULT_CLICKS));
    }
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_CLICKS, JSON.stringify(DEFAULT_CLICKS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FULL_CATALOG)) {
    localStorage.setItem(STORAGE_KEYS.FULL_CATALOG, JSON.stringify(fullCatalogData));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  }

  // Synchronisation des images réelles téléchargées
  const IMAGES_SYNC_KEY = "mob_strives_images_synced_v1";
  if (!localStorage.getItem(IMAGES_SYNC_KEY)) {
    try {
      const storedProds = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
      if (Array.isArray(storedProds) && storedProds.length > 0) {
        const initMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
        const updated = storedProds.map(p => {
          const fresh = initMap.get(p.id);
          if (fresh && fresh.image && (fresh.image.includes("/strives/images/") || fresh.image.startsWith("./strives/images/"))) {
            return { ...p, image: fresh.image, gallery: fresh.gallery || [fresh.image] };
          }
          return p;
        });
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } else {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      }

      localStorage.setItem(STORAGE_KEYS.FULL_CATALOG, JSON.stringify(fullCatalogData));
      localStorage.setItem(IMAGES_SYNC_KEY, "true");
    } catch (e) {
      console.warn("Erreur synchronisation images strives:", e);
    }
  }

  // Auto-migration pour forcer les chemins relatifs (évite 404 sur sous-dossier GitHub Pages)
  const ASSETS_FIX_KEY = "mob_relative_assets_v2";
  if (!localStorage.getItem(ASSETS_FIX_KEY)) {
    try {
      const storedProds = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
      if (Array.isArray(storedProds) && storedProds.length > 0) {
        const fixed = storedProds.map(p => ({
          ...p,
          image: getAssetUrl(p.image),
          gallery: Array.isArray(p.gallery) ? p.gallery.map(getAssetUrl) : [getAssetUrl(p.image)]
        }));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(fixed));
      }
      
      const storedCatalog = JSON.parse(localStorage.getItem(STORAGE_KEYS.FULL_CATALOG) || "[]");
      if (Array.isArray(storedCatalog) && storedCatalog.length > 0) {
        const fixedCatalog = storedCatalog.map(c => ({
          ...c,
          image: c.image ? getAssetUrl(c.image) : c.image
        }));
        localStorage.setItem(STORAGE_KEYS.FULL_CATALOG, JSON.stringify(fixedCatalog));
      }

      const storedSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_SETTINGS) || "null");
      if (storedSettings && storedSettings.contacts && storedSettings.contacts.waveQrCode) {
        storedSettings.contacts.waveQrCode = getAssetUrl(storedSettings.contacts.waveQrCode);
        localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(storedSettings));
      }
      localStorage.setItem(ASSETS_FIX_KEY, "true");
    } catch (e) {
      console.warn("Erreur migration chemins relatifs:", e);
    }
  }
}

// Helper pour normaliser tout chemin d'image en chemin relatif compatible avec GitHub Pages
export function getAssetUrl(path) {
  if (!path || typeof path !== "string") return "./imgs/stands_esthetique.jpg";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith("./")) return path;
  if (path.startsWith("/")) return "." + path;
  return "./" + path;
}

initData();

// --- PRODUCTS CRUD ---
export function getProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const list = data ? JSON.parse(data) : INITIAL_PRODUCTS;
    return list.map(p => ({
      ...p,
      image: getAssetUrl(p.image),
      gallery: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery.map(getAssetUrl) : [getAssetUrl(p.image)]
    }));
  } catch (e) {
    console.error(e);
    return INITIAL_PRODUCTS.map(p => ({
      ...p,
      image: getAssetUrl(p.image),
      gallery: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery.map(getAssetUrl) : [getAssetUrl(p.image)]
    }));
  }
}

export function getProductById(id) {
  const products = getProducts();
  const found = products.find(p => p.id === id);
  if (found) return found;

  // Si c'est un article du Grand Catalogue (mob-cat-XXXX ou mob-excel-N)
  if (id && (id.startsWith("mob-cat-") || id.startsWith("mob-excel-"))) {
    const full = getFullCatalog();
    const catItem = full.find(c => c.id === id || c.id === id.replace("mob-excel-", "mob-cat-000").replace(/mob-cat-000(\d{4})/, "mob-cat-$1"));
    if (catItem) {
      const img = getAssetUrl(catItem.image || "./imgs/stands_esthetique.jpg");
      return {
        id: catItem.id,
        name: `${catItem.brand} - ${catItem.name}`,
        brand: catItem.brand,
        price: catItem.price,
        category: catItem.category,
        categoryLabel: catItem.category,
        image: img,
        gallery: catItem.gallery && catItem.gallery.length > 0 ? catItem.gallery.map(getAssetUrl) : [img],
        shortDesc: catItem.description,
        description: catItem.description,
        usage: "Appliquer selon votre routine beauté habituelle.",
        stock: 25,
        rating: 4.8,
        reviewsCount: 12
      };
    }
  }
  return null;
}

export function addProduct(productData) {
  const products = getProducts();
  const defaultImg = getAssetUrl(productData.image || "./imgs/devanture_face.jpg");
  const newProduct = {
    id: "mob-" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewsCount: 1,
    gallery: [defaultImg],
    tags: productData.tags || ["Nouveauté"],
    ...productData,
    image: defaultImg
  };
  products.unshift(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  emitChange({ type: "PRODUCT_ADDED", product: newProduct });
  return newProduct;
}

export function updateProduct(id, updatedFields) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedFields, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    emitChange({ type: "PRODUCT_UPDATED", product: products[index] });
    return products[index];
  }
  return null;
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  emitChange({ type: "PRODUCT_DELETED", id });
  return true;
}

export function toggleFeatured(id) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index].isFeatured = !products[index].isFeatured;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    emitChange({ type: "PRODUCT_UPDATED", product: products[index] });
    return products[index];
  }
  return null;
}

// --- APPOINTMENTS CRUD ---
export function getAppointments() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addAppointment(appointmentData) {
  const list = getAppointments();
  const newApt = {
    id: "rdv-" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    status: "En attente",
    ...appointmentData
  };
  list.unshift(newApt);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
  emitChange({ type: "APPOINTMENT_ADDED", appointment: newApt });
  return newApt;
}

export function updateAppointmentStatus(id, newStatus) {
  const list = getAppointments();
  const index = list.findIndex(a => a.id === id);
  if (index !== -1) {
    list[index].status = newStatus;
    list[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    emitChange({ type: "APPOINTMENT_UPDATED", appointment: list[index] });
    return list[index];
  }
  return null;
}

export function deleteAppointment(id) {
  const list = getAppointments();
  const filtered = list.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filtered));
  emitChange({ type: "APPOINTMENT_DELETED", id });
  return true;
}

// --- PERSONAL SHOPPER CRUD ---
export function getPersonalShopperRequests() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PERSONAL_SHOPPER);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addPersonalShopperRequest(reqData) {
  const list = getPersonalShopperRequests();
  const newReq = {
    id: "ps-" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    status: "En attente de contact",
    depositStatus: "En attente de versement 60%",
    ...reqData
  };
  list.unshift(newReq);
  localStorage.setItem(STORAGE_KEYS.PERSONAL_SHOPPER, JSON.stringify(list));
  emitChange({ type: "PERSONAL_SHOPPER_ADDED", request: newReq });
  return newReq;
}

export function updatePersonalShopperStatus(id, status, depositStatus) {
  const list = getPersonalShopperRequests();
  const index = list.findIndex(r => r.id === id);
  if (index !== -1) {
    if (status) list[index].status = status;
    if (depositStatus) list[index].depositStatus = depositStatus;
    list[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PERSONAL_SHOPPER, JSON.stringify(list));
    emitChange({ type: "PERSONAL_SHOPPER_UPDATED", request: list[index] });
    return list[index];
  }
  return null;
}

export function updatePersonalShopperDeposit(id, depositStatus) {
  return updatePersonalShopperStatus(id, null, depositStatus);
}

export function deletePersonalShopperRequest(id) {
  const list = getPersonalShopperRequests();
  const filtered = list.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.PERSONAL_SHOPPER, JSON.stringify(filtered));
  emitChange({ type: "PERSONAL_SHOPPER_DELETED", id });
  return true;
}

// --- STORE SETTINGS CRUD ---
export function getStoreSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STORE_SETTINGS);
    const parsed = data ? JSON.parse(data) : STORE_INFO;
    if (parsed && parsed.contacts) {
      if (!parsed.contacts.instagram || parsed.contacts.instagram.includes("mallofbeauty_abidjan")) {
        parsed.contacts.instagram = STORE_INFO.contacts.instagram;
      }
      if (!parsed.contacts.tiktok || parsed.contacts.tiktok.includes("mallofbeauty_ci")) {
        parsed.contacts.tiktok = STORE_INFO.contacts.tiktok;
      }
      if (!parsed.contacts.facebook) parsed.contacts.facebook = STORE_INFO.contacts.facebook;
      if (!parsed.contacts.x) parsed.contacts.x = STORE_INFO.contacts.x;
      if (!parsed.contacts.wave) parsed.contacts.wave = STORE_INFO.contacts.wave;
      if (!parsed.contacts.waveDisplay) parsed.contacts.waveDisplay = STORE_INFO.contacts.waveDisplay;
      if (!parsed.contacts.wavePaymentUrl) parsed.contacts.wavePaymentUrl = STORE_INFO.contacts.wavePaymentUrl;
      if (!parsed.contacts.waveQrCode) parsed.contacts.waveQrCode = STORE_INFO.contacts.waveQrCode;
    }
    return parsed;
  } catch (e) {
    return STORE_INFO;
  }
}

export function updateStoreSettings(newSettings) {
  const current = getStoreSettings();
  const merged = { ...current, ...newSettings };
  localStorage.setItem(STORAGE_KEYS.STORE_SETTINGS, JSON.stringify(merged));
  emitChange({ type: "SETTINGS_UPDATED", settings: merged });
  return merged;
}

// --- CART MANAGEMENT ---
export function getCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  emitChange({ type: "CART_UPDATED", cart });
  return cart;
}

export function updateCartQuantity(productId, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(item => item.productId !== productId);
  } else {
    const item = cart.find(i => i.productId === productId);
    if (item) item.quantity = quantity;
  }
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  emitChange({ type: "CART_UPDATED", cart });
  return cart;
}

export function removeFromCart(productId) {
  return updateCartQuantity(productId, 0);
}

export function clearCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  emitChange({ type: "CART_UPDATED", cart: [] });
  return [];
}

// --- LOYALTY PRIVILEGE MEMBERS CRUD ---
export function getLoyaltyMembers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOYALTY_MEMBERS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function addLoyaltyMember(memberData) {
  const members = getLoyaltyMembers();
  const newMember = {
    id: "loyalty-" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    fullName: memberData.fullName || "Adhérent MoB",
    phone: memberData.phone || "",
    birthDate: memberData.birthDate || "",
    neighborhood: memberData.neighborhood || "Abidjan",
    favoriteCategory: memberData.favoriteCategory || "Toutes collections",
    discountStatus: "Adhésion confirmée (-10% pour votre anniversaire)"
  };
  members.unshift(newMember);
  localStorage.setItem(STORAGE_KEYS.LOYALTY_MEMBERS, JSON.stringify(members));
  emitChange({ type: "LOYALTY_MEMBER_ADDED", member: newMember });
  trackClick("loyalty", `Adhésion: ${newMember.fullName}`);
  return newMember;
}

export function deleteLoyaltyMember(id) {
  const members = getLoyaltyMembers();
  const filtered = members.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOYALTY_MEMBERS, JSON.stringify(filtered));
  emitChange({ type: "LOYALTY_MEMBER_DELETED", id });
  return true;
}

// --- ANALYTICS CLICKS TRACKING ---
export function getAnalyticsClicks() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS_CLICKS);
    return data ? JSON.parse(data) : {
      total: 0, phone_call: 0, whatsapp: 0, instagram: 0, tiktok: 0,
      booking: 0, shopper: 0, loyalty: 0, lastEvent: "", updatedAt: new Date().toISOString()
    };
  } catch (e) {
    return { total: 0, phone_call: 0, whatsapp: 0, instagram: 0, tiktok: 0 };
  }
}

export function trackClick(actionType, targetLabel = "") {
  try {
    const stats = getAnalyticsClicks();
    stats.total = (stats.total || 0) + 1;
    if (actionType in stats) {
      stats[actionType] = (stats[actionType] || 0) + 1;
    } else {
      stats[actionType] = 1;
    }
    stats.lastEvent = targetLabel ? `${actionType.toUpperCase()}: ${targetLabel}` : actionType;
    stats.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_CLICKS, JSON.stringify(stats));
    emitChange({ type: "ANALYTICS_UPDATED", stats });
    return stats;
  } catch (e) {
    console.error("Error tracking click", e);
  }
}

export function resetAnalyticsClicks() {
  const clean = {
    total: 0, phone_call: 0, whatsapp: 0, instagram: 0, tiktok: 0,
    booking: 0, shopper: 0, loyalty: 0, lastEvent: "Compteurs réinitialisés",
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.ANALYTICS_CLICKS, JSON.stringify(clean));
  emitChange({ type: "ANALYTICS_UPDATED", stats: clean });
  return clean;
}

// --- GRAND CATALOGUE EXCEL (1 136 ARTICLES) ---
export function getFullCatalog() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FULL_CATALOG);
    const list = data ? JSON.parse(data) : fullCatalogData;
    return list.map(item => item.image ? { ...item, image: getAssetUrl(item.image) } : item);
  } catch (e) {
    return fullCatalogData.map(item => item.image ? { ...item, image: getAssetUrl(item.image) } : item);
  }
}

export function searchFullCatalog({ query = "", category = "all", brand = "all", page = 1, perPage = 0 } = {}) {
  const catalog = getFullCatalog();
  const q = query.trim().toLowerCase();
  
  let filtered = catalog;

  if (category && category !== "all") {
    filtered = filtered.filter(item => item.category === category);
  }

  if (brand && brand !== "all") {
    filtered = filtered.filter(item => item.brand.toLowerCase() === brand.toLowerCase());
  }

  if (q) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  let items = filtered;
  let totalPages = 1;
  let currentPage = 1;

  if (perPage && perPage > 0) {
    totalPages = Math.ceil(total / perPage) || 1;
    currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * perPage;
    items = filtered.slice(start, start + perPage);
  }

  return {
    items,
    total,
    totalPages,
    currentPage,
    perPage: perPage || total
  };
}

// --- MESSAGES DE CONTACT CRUD ---
export function getContacts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : DEFAULT_CONTACTS;
  } catch (e) {
    console.error("Error reading contacts", e);
    return DEFAULT_CONTACTS;
  }
}

export function addContact(contactData) {
  const contacts = getContacts();
  const newContact = {
    id: "msg-" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    name: contactData.name || "Client MoB",
    phone: contactData.phone || "",
    subject: contactData.subject || "Renseignement général",
    message: contactData.message || "",
    status: "Non lu"
  };
  contacts.unshift(newContact);
  localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  emitChange({ type: "CONTACT_ADDED", contact: newContact });
  trackClick("contact_form", `Message: ${newContact.name}`);
  return newContact;
}

export function updateContactStatus(id, newStatus) {
  const contacts = getContacts();
  const idx = contacts.findIndex(c => c.id === id);
  if (idx !== -1) {
    contacts[idx].status = newStatus;
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    emitChange({ type: "CONTACT_UPDATED", contact: contacts[idx] });
    return contacts[idx];
  }
  return null;
}

export function deleteContact(id) {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filtered));
  emitChange({ type: "CONTACT_DELETED", id });
  return true;
}

// --- RECHARGER TOUTES LES DONNÉES FACTICES ---
export function reloadAllDummyData() {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
  localStorage.setItem(STORAGE_KEYS.PERSONAL_SHOPPER, JSON.stringify(DEFAULT_PERSONAL_SHOPPER));
  localStorage.setItem(STORAGE_KEYS.LOYALTY_MEMBERS, JSON.stringify(DEFAULT_LOYALTY));
  localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
  localStorage.setItem(STORAGE_KEYS.ANALYTICS_CLICKS, JSON.stringify(DEFAULT_CLICKS));
  emitChange({ type: "DUMMY_DATA_RELOADED" });
  return true;
}

// --- FACTORY RESET HELPER ---
export function resetToFactory() {
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.FULL_CATALOG);
  localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
  localStorage.removeItem(STORAGE_KEYS.PERSONAL_SHOPPER);
  localStorage.removeItem(STORAGE_KEYS.LOYALTY_MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.CONTACTS);
  localStorage.removeItem(STORAGE_KEYS.ANALYTICS_CLICKS);
  localStorage.removeItem(STORAGE_KEYS.STORE_SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.CART);
  initData();
  emitChange({ type: "FACTORY_RESET" });
}

