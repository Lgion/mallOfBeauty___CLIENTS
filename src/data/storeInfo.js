export const STORE_INFO = {
  name: "Mall of Beauty",
  acronym: "MoB",
  slogan: "La beauté n'a pas de prix",
  tagline: "Votre temple d'exception aux Vallons : spécialiste en dermocosmétique d'origine Américaine (70% de notre sélection certifiée USA), K-Beauty de prestige, pagnes Vlisco officiels & maroquinerie italienne.",
  yearsOfExcellence: "Près de 10 ans d'expertise",
  address: {
    street: "Rue des Jardins, Numéro PADA 3077",
    district: "Les Vallons, Cocody",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    landmark: "En face de la pharmacie Saint-Gilles",
    coordinates: {
      lat: 5.358245,
      lng: -3.992812
    }
  },
  openingHours: {
    days: "Du Lundi au Samedi",
    hours: "09h00 - 19h00",
    closed: "Dimanche",
    openHour: 9,
    closeHour: 19,
    openDays: [1, 2, 3, 4, 5, 6] // 0 is Sunday, 1 is Monday
  },
  contacts: {
    // Premier contact officiel pour passer les commandes
    orderPhone: "+2250777027235",
    orderPhoneDisplay: "+225 07 77 02 72 35",
    whatsapp: "+2250777027235",
    whatsappDisplay: "+225 07 77 02 72 35",
    phoneService: "+2250777027235",
    phoneServiceDisplay: "+225 07 77 02 72 35",
    phoneSecondary: "+2250759937849",
    phoneSecondaryDisplay: "+225 07 59 93 78 49",
    wave: "+2250777027235",
    waveDisplay: "+225 07 77 02 72 35",
    wavePaymentUrl: "https://pay.wave.com/m/M_CI_mallofbeauty",
    waveQrCode: "./imgs/wave_qr_code.svg",
    email: "contact@mallofbeauty.ci",
    instagram: "https://www.instagram.com/mallofbeauty_mofb?stkn=cDQ3N2gxb2kzZXli&utm_source=qr",
    tiktok: "https://www.tiktok.com/@mallofbeauty1?_r=1&_t=ZS-99xD0ZjS2OP",
    facebook: "https://www.facebook.com/mallofbeautyci",
    x: "https://x.com/MallOfBeautyCI",
    // Avis et Fiche Google Maps
    googleRating: "4.9",
    googleReviewCount: "128",
    googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=5.358245,-3.992812",
    googleReviewWriteUrl: "https://search.google.com/local/writereview?placeid=ChIJ-mallofbeauty-abidjan",
    googlePlacesApiKey: "",
    googlePlaceId: "ChIJ-mallofbeauty-abidjan",
    googleWidgetCode: ""
  },
  announcement: "✨ Mall of Beauty Les Vallons — 70% Produits Américains Authentiques & K-Beauty • Partenaire Officiel Vlisco • Commandes : +225 07 77 02 72 35",
  currency: "FCFA",
  deliveryPartners: [
    { name: "Yango Delivery", type: "Locale (Abidjan)", time: "Moins de 2h", desc: "Livraison express sur tout le district d'Abidjan" },
    { name: "GP Express", type: "Régionale & Diaspora", time: "24h - 48h", desc: "Expédition sécurisée par car et colis express" },
    { name: "DHL Express", type: "Internationale", time: "3 - 5 jours", desc: "Livraison suivie partout dans le monde" }
  ],
  loyaltyProgram: {
    name: "Carte Privilège MoB",
    perks: [
      { title: "Anniversaire VIP", discount: "-10%", condition: "Valable pendant 10 jours autour de votre date d'anniversaire" },
      { title: "Achèvement de Carte", discount: "-15%", condition: "Applicable dès le cycle complet d'achats validé" },
      { title: "Gamme Femme & Beauté VIP", discount: "Privilèges", condition: "Accès prioritaire aux nouveautés américaines et coréennes" },
      { title: "Privilèges Découverte", discount: "Cadeaux", condition: "Échantillons de grandes marques et invitations privées" }
    ]
  },
  personalShopperRules: {
    minDepositRate: 60, // 60% d'acompte obligatoire comme mentionné dans l'enregistrement
    description: "Recherche sur-mesure de parfums exclusifs, maroquinerie rare et pagnes haute couture. Un acompte minimum de 60% est requis à la confirmation de la recherche."
  }
};
