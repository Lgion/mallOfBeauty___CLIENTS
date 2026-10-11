// Données de départ pour le peuplement de la base de données MongoDB

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
  id: "main-analytics",
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

export const DEFAULT_GALLERY_IMAGES = [
  { id: "gal-1", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg", caption: "Façade Mall of Beauty • Les Vallons" },
  { id: "gal-2", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669197/mallofbeauty_assets/interieur.jpg", caption: "Salon d'Accueil VIP & Conseils" },
  { id: "gal-3", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669256/mallofbeauty_assets/stand_makeup.jpg", caption: "Bar à Maquillage & Cosmétiques" },
  { id: "gal-4", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669257/mallofbeauty_assets/stand_maroquinerie.jpg", caption: "Maroquinerie & Sacs de Luxe" },
  { id: "gal-5", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669259/mallofbeauty_assets/stand_pagnes.jpg", caption: "Espace Pagnes Vlisco Officiel" },
  { id: "gal-6", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669265/mallofbeauty_assets/stand_perruques.jpg", caption: "Haute Coiffure & Perruques HD" },
  { id: "gal-7", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669268/mallofbeauty_assets/stands_esthetique.jpg", caption: "Soins Visage & K-Beauty" },
  { id: "gal-8", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669193/mallofbeauty_assets/devanture_cote.jpg", caption: "Vue d'angle Rue des Jardins" }
];
