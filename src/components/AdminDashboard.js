import {
  getProducts, addProduct, updateProduct, deleteProduct, toggleFeatured,
  getAppointments, updateAppointmentStatus, deleteAppointment,
  getPersonalShopperRequests, updatePersonalShopperStatus, updatePersonalShopperDeposit, deletePersonalShopperRequest,
  getLoyaltyMembers, deleteLoyaltyMember,
  getContacts, updateContactStatus, deleteContact,
  getAnalyticsClicks, resetAnalyticsClicks,
  getStoreSettings, updateStoreSettings, resetToFactory, reloadAllDummyData,
  getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, resetGalleryImages
} from "../data/storage.js";
import { formatPriceFCFA } from "./Catalog.js";

let currentTab = "products";
let editingProductId = null;
let showAddProductForm = false;
let editingGalleryId = null;
let showAddGalleryForm = false;

export const ADMIN_SVG_ICONS = {
  products: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  featured: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  gallery: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  appointments: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`,
  personalShopper: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M11 3 8 9l4 12 4-12-3-6"/></svg>`,
  loyalty: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2"/><line x1="4" y1="22" x2="20" y2="22"/></svg>`,
  contacts: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  analytics: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  settings: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
};

export function getTabInfo(tab) {
  switch (tab) {
    case "products":
      return {
        title: "Catalogue Produits",
        breadcrumb: "Catalogue & Vente / Produits",
        desc: "Gestion complète du stock, des prix et des informations produits."
      };
    case "featured":
      return {
        title: "Vitrine Phares",
        breadcrumb: "Catalogue & Vente / Vitrine",
        desc: "Articles d'exception mis en avant sur la page d'accueil de Mall of Beauty."
      };
    case "gallery":
      return {
        title: "Galerie Photos Boutique",
        breadcrumb: "Catalogue & Vente / Galerie",
        desc: "Photos d'ambiance et stands officiels de la boutique des Vallons."
      };
    case "appointments":
      return {
        title: "Rendez-vous Diagnostic Beauté",
        breadcrumb: "Services & Clients / Rendez-vous",
        desc: "Consultations privées, diagnostics de peau et protocoles sur-mesure."
      };
    case "personal-shopper":
      return {
        title: "Conciergerie VIP & Personal Shopper",
        breadcrumb: "Services & Clients / Personal Shopper",
        desc: "Commandes sur-mesure de pagnes Vlisco rares et cosmétiques importés."
      };
    case "loyalty":
      return {
        title: "Carte Privilège & Membres VIP",
        breadcrumb: "Services & Clients / Fidélité",
        desc: "Adhérents privilégiés, réductions anniversaires et avantages exclusifs."
      };
    case "contacts":
      return {
        title: "Messages & Demandes Clients",
        breadcrumb: "Services & Clients / Messages",
        desc: "Demandes d'informations reçues depuis le formulaire de contact."
      };
    case "analytics":
      return {
        title: "Statistiques & Clics CTA",
        breadcrumb: "Système & Pilotage / Statistiques",
        desc: "Suivi des interactions directes : appels, WhatsApp, réservations et réseaux."
      };
    case "settings":
      return {
        title: "Paramètres Boutique & Données",
        breadcrumb: "Système & Pilotage / Paramètres",
        desc: "Coordonnées, horaires d'ouverture, paiement Wave et outils de maintenance."
      };
    default:
      return {
        title: "Administration",
        breadcrumb: "Tableau de Bord",
        desc: "Gestion globale de Mall of Beauty."
      };
  }
}

export function renderAdminDashboard(activeTab = "products") {
  currentTab = activeTab;
  const products = getProducts();
  const appointments = getAppointments();
  const psRequests = getPersonalShopperRequests();
  const loyaltyMembers = getLoyaltyMembers();
  const contacts = getContacts();
  const analytics = getAnalyticsClicks();
  const settings = getStoreSettings();
  const galleryImages = getGalleryImages();

  const featuredCount = products.filter(p => p.isFeatured).length;
  const pendingAppointments = appointments.filter(a => a.status === "En attente").length;
  const pendingPS = psRequests.filter(r => r.status && r.status.includes("attente")).length;
  const unreadContacts = contacts.filter(c => c.status === "Non lu").length;
  const tabInfo = getTabInfo(currentTab);

  return `
    <div class="mob-admin-app">
      <!-- SIDEBAR LATÉRALE DÉDIÉE -->
      <aside class="mob-admin-sidebar">
        <!-- Logo & Titre Boutique -->
        <div class="mob-sidebar-brand">
          <div class="mob-brand-icon">⚡</div>
          <div class="mob-brand-info">
            <div class="mob-brand-title">MALL OF BEAUTY</div>
            <div class="mob-brand-subtitle">Administration • Les Vallons</div>
          </div>
        </div>

        <!-- Statut Système & Base de données -->
        <div class="mob-sidebar-status">
          <span class="mob-status-dot"></span>
          <span>MongoDB Atlas Connecté</span>
        </div>

        <!-- 9 Sections Réorganisées avec Icônes SVG et Badges Clairs -->
        <nav class="mob-sidebar-nav">
          <div class="mob-nav-group-title">Catalogue & Vente</div>
          
          <button class="mob-nav-item ${currentTab === 'products' ? 'active' : ''}" data-tab="products" onclick="window.MoB.switchAdminTab('products')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.products}</span>
            <span class="mob-nav-label">Produits</span>
            <span class="mob-nav-badge" data-tab-badge="products">${products.length}</span>
          </button>

          <button class="mob-nav-item ${currentTab === 'featured' ? 'active' : ''}" data-tab="featured" onclick="window.MoB.switchAdminTab('featured')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.featured}</span>
            <span class="mob-nav-label">Vitrine Phares</span>
            <span class="mob-nav-badge gold" data-tab-badge="featured">${featuredCount}</span>
          </button>

          <button class="mob-nav-item ${currentTab === 'gallery' ? 'active' : ''}" data-tab="gallery" onclick="window.MoB.switchAdminTab('gallery')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.gallery}</span>
            <span class="mob-nav-label">Galerie Photos</span>
            <span class="mob-nav-badge" data-tab-badge="gallery">${galleryImages.length}</span>
          </button>

          <div class="mob-nav-group-title">Services & Clients</div>

          <button class="mob-nav-item ${currentTab === 'appointments' ? 'active' : ''}" data-tab="appointments" onclick="window.MoB.switchAdminTab('appointments')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.appointments}</span>
            <span class="mob-nav-label">Rendez-vous</span>
            <span class="mob-nav-badge ${pendingAppointments > 0 ? 'warning' : ''}" data-tab-badge="appointments">
              ${appointments.length}
            </span>
          </button>

          <button class="mob-nav-item ${currentTab === 'personal-shopper' ? 'active' : ''}" data-tab="personal-shopper" onclick="window.MoB.switchAdminTab('personal-shopper')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.personalShopper}</span>
            <span class="mob-nav-label">Personal Shopper</span>
            <span class="mob-nav-badge ${pendingPS > 0 ? 'warning' : ''}" data-tab-badge="personal-shopper">
              ${psRequests.length}
            </span>
          </button>

          <button class="mob-nav-item ${currentTab === 'loyalty' ? 'active' : ''}" data-tab="loyalty" onclick="window.MoB.switchAdminTab('loyalty')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.loyalty}</span>
            <span class="mob-nav-label">Carte Privilège</span>
            <span class="mob-nav-badge" data-tab-badge="loyalty">${loyaltyMembers.length}</span>
          </button>

          <button class="mob-nav-item ${currentTab === 'contacts' ? 'active' : ''}" data-tab="contacts" onclick="window.MoB.switchAdminTab('contacts')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.contacts}</span>
            <span class="mob-nav-label">Messages</span>
            <span class="mob-nav-badge ${unreadContacts > 0 ? 'danger' : ''}" data-tab-badge="contacts">
              ${contacts.length}
            </span>
          </button>

          <div class="mob-nav-group-title">Système & Pilotage</div>

          <button class="mob-nav-item ${currentTab === 'analytics' ? 'active' : ''}" data-tab="analytics" onclick="window.MoB.switchAdminTab('analytics')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.analytics}</span>
            <span class="mob-nav-label">Statistiques Clics</span>
            <span class="mob-nav-badge" data-tab-badge="analytics">${analytics.total || 0}</span>
          </button>

          <button class="mob-nav-item ${currentTab === 'settings' ? 'active' : ''}" data-tab="settings" onclick="window.MoB.switchAdminTab('settings')">
            <span class="mob-nav-icon">${ADMIN_SVG_ICONS.settings}</span>
            <span class="mob-nav-label">Paramètres Boutique</span>
          </button>
        </nav>

        <!-- Bas de Sidebar : Lien Direct vers le Site Public -->
        <div class="mob-sidebar-footer">
          <a href="/" class="mob-btn-return-site" title="Accéder à la boutique publique">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>Retour au site public</span>
          </a>
        </div>
      </aside>

      <!-- ZONE DE CONTENU PRINCIPALE (HEADER + CORPS DU DASHBOARD) -->
      <div class="mob-admin-main">
        <header class="mob-admin-topbar">
          <div class="mob-topbar-left">
            <div class="mob-topbar-breadcrumb">
              <span>Mall of Beauty</span>
              <span class="separator">/</span>
              <span id="mob-admin-active-breadcrumb" class="active">${tabInfo.breadcrumb}</span>
            </div>
            <h2 id="mob-admin-active-title" class="mob-topbar-title">${tabInfo.title}</h2>
            <p id="mob-admin-active-desc" class="mob-topbar-desc">${tabInfo.desc}</p>
          </div>

          <div class="mob-topbar-right">
            <span class="mob-role-pill">ACCÈS ADMINISTRATEUR</span>
          </div>
        </header>

        <!-- Conteneur d'Onglet Actif Spacieux & Scrollable -->
        <div class="mob-admin-content theme-${currentTab}" id="admin-tab-container">
          ${renderAdminTabContent(currentTab)}
        </div>
      </div>
    </div>
  `;
}

export function renderAdminTabContent(tab = "products") {
  const products = getProducts();
  const appointments = getAppointments();
  const psRequests = getPersonalShopperRequests();
  const loyaltyMembers = getLoyaltyMembers();
  const contacts = getContacts();
  const analytics = getAnalyticsClicks();
  const settings = getStoreSettings();
  const galleryImages = getGalleryImages();

  switch (tab) {
    case "products":
      return renderProductsTab(products);
    case "featured":
      return renderFeaturedTab(products);
    case "appointments":
      return renderAppointmentsTab(appointments);
    case "personal-shopper":
      return renderPersonalShopperTab(psRequests);
    case "loyalty":
      return renderLoyaltyTab(loyaltyMembers);
    case "contacts":
      return renderContactsTab(contacts);
    case "analytics":
      return renderAnalyticsTab(analytics);
    case "gallery":
      return renderGalleryTab(galleryImages);
    case "settings":
      return renderSettingsTab(settings);
    case "backup":
      return renderBackupTab();
    default:
      return renderProductsTab(products);
  }
}

function renderFeaturedTab(products) {
  const featured = products.filter(p => p.isFeatured);

  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">⭐ Gestion des Produits Phares (Vitrine d'Accueil)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Articles d'exception sélectionnés pour la vitrine principale de Mall of Beauty.</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <span class="badge" style="background: #FEF3C7; color: #92400E; border: 1.5px solid #FDE68A; font-weight: 800; font-size: 0.85rem; padding: 6px 14px;">
          ${featured.length} Produits Phares Actifs
        </span>
        <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.switchAdminTab('products')">
          📦 Ajouter depuis le Catalogue
        </button>
      </div>
    </div>

    <div class="admin-callout-info">
      💡 <strong>Règle Vitrine :</strong> Les produits marqués « ★ Phare » sont les seuls affichés dans la vitrine principale d'accueil. Cliquez sur « ★ Phare » pour retirer un article de la vitrine, ou rendez-vous sur l'onglet <em>Total Produits</em> pour en ajouter de nouveaux.
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Visuel</th>
            <th>Nom / Marque</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Statut Vitrine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${featured.length === 0 ? `
            <tr>
              <td colspan="7" style="text-align: center; padding: 48px 20px; color: #0F172A;">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">⭐</span>
                <strong>Aucun produit mis en avant pour le moment.</strong><br>
                <span style="font-size: 0.88rem; color: #64748B;">Rendez-vous dans l'onglet « Total Produits » pour sélectionner les articles vitrine.</span><br>
                <button class="btn btn-gold btn-sm" style="margin-top: 14px;" onclick="window.MoB.switchAdminTab('products')">
                  Choisir des produits phares dans le catalogue
                </button>
              </td>
            </tr>
          ` : featured.map(p => `
            <tr>
              <td>
                <img src="${p.image}" alt="${p.name}" class="product-thumb-cell">
              </td>
              <td>
                <strong style="color: #0F172A;">${p.name}</strong><br>
                <span style="font-size: 0.8rem; color: #64748B;">${p.brand}</span>
              </td>
              <td>
                <span class="badge" style="background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; font-size: 0.72rem; font-weight: 700;">${p.category}</span>
              </td>
              <td>
                <strong style="color: #0F172A; font-weight: 800;">${formatPriceFCFA(p.price)}</strong>
              </td>
              <td style="color: #334155; font-weight: 600;">${p.stock}</td>
              <td>
                <button class="btn-action-sm btn-gold" onclick="window.MoB.handleToggleFeatured('${p.id}')" title="Cliquer pour retirer de la vitrine d'accueil">
                  ★ Phare (En Vitrine)
                </button>
              </td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <button class="btn-action-sm btn-dark" onclick="window.MoB.startEditProduct('${p.id}')" title="Modifier la fiche">
                    ✏️
                  </button>
                  <button class="btn-action-sm btn-danger" onclick="window.MoB.handleToggleFeatured('${p.id}')" title="Retirer de la vitrine">
                    ✕ Retirer
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderProductsTab(products) {
  const availableImages = [
    { label: "Stands Cosmétiques", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669268/mallofbeauty_assets/stands_esthetique.jpg" },
    { label: "Rayon K-Beauty 1", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669251/mallofbeauty_assets/stand5.jpg" },
    { label: "Rayon K-Beauty 2", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669249/mallofbeauty_assets/stand4.jpg" },
    { label: "Soins Bébés 1", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669248/mallofbeauty_assets/stand2.jpg" },
    { label: "Soins Bébés 2", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669245/mallofbeauty_assets/stand0.jpg" },
    { label: "Soins & Crèmes", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669246/mallofbeauty_assets/stand1.jpg" },
    { label: "Pagnes Vlisco 1", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669259/mallofbeauty_assets/stand_pagnes.jpg" },
    { label: "Pagnes Vlisco 2", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669263/mallofbeauty_assets/stand_pagnes_.jpg" },
    { label: "Voiles & Robes", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669272/mallofbeauty_assets/vitrine_interieur_habits_hauts.jpg" },
    { label: "Maroquinerie & Sacs", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669257/mallofbeauty_assets/stand_maroquinerie.jpg" },
    { label: "Perruques HD", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669265/mallofbeauty_assets/stand_perruques.jpg" },
    { label: "Bar Maquillage", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669256/mallofbeauty_assets/stand_makeup.jpg" },
    { label: "Façade Boutique", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg" }
  ];

  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">Gestion des Articles du Catalogue (CRUD)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Créez, modifiez, supprimez et définissez les produits phares mis en avant dans la vitrine.</p>
      </div>
      <button class="btn btn-gold btn-sm" onclick="window.MoB.toggleAddProductForm()">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        <span>${showAddProductForm ? 'Fermer le formulaire' : 'Ajouter un Produit'}</span>
      </button>
    </div>

    <!-- Formulaire d'Ajout ou Édition -->
    ${showAddProductForm ? `
      <div class="admin-form-box" id="product-form-box">
        <h4 style="color: #0F172A; margin-bottom: 16px; font-weight: 700;">
          ${editingProductId ? '✏️ Modifier le produit' : '✨ Nouveau produit'}
        </h4>

        <form id="admin-product-form" onsubmit="window.MoB.handleSaveProduct(event)">
          <input type="hidden" id="form-product-id" value="${editingProductId || ''}">

          <div class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">Nom du Produit *</label>
              <input type="text" id="form-product-name" class="form-input" placeholder="Ex: Beauty of Joseon - Ginseng Serum" required>
            </div>
            <div class="form-group">
              <label class="form-label">Marque *</label>
              <input type="text" id="form-product-brand" class="form-input" placeholder="Ex: Vlisco, Anua, Johnson's..." required>
            </div>
          </div>

          <div class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">Rayon / Catégorie *</label>
              <select id="form-product-category" class="form-select" required>
                <option value="k-beauty">K-Beauty & Dermocosmétique</option>
                <option value="bebe-enfant">Bébés & Enfants</option>
                <option value="soins-homme">Soins Homme & Ciblés</option>
                <option value="textiles-vlisco">Pagnes Vlisco Prestige</option>
                <option value="maroquinerie">Maroquinerie & Sacs</option>
                <option value="perruques">Perruques & Capillaire</option>
                <option value="maquillage">Maquillage & Bijoux</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Prix (FCFA) *</label>
              <input type="number" id="form-product-price" class="form-input" placeholder="Ex: 18500" required>
            </div>
          </div>

          <div class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">Ancien Prix Barré (optionnel)</label>
              <input type="number" id="form-product-oldprice" class="form-input" placeholder="Ex: 22000">
            </div>
            <div class="form-group">
              <label class="form-label">Stock disponible</label>
              <input type="number" id="form-product-stock" class="form-input" value="10" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Courte Description</label>
            <input type="text" id="form-product-shortdesc" class="form-input" placeholder="Résumé en 1 phrase...">
          </div>

          <div class="form-group">
            <label class="form-label">Description Détaillée & Bienfaits</label>
            <textarea id="form-product-desc" class="form-textarea" placeholder="Bienfaits de la formule, ingrédients clés..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Conseils d'Application & Suivi MoB</label>
            <textarea id="form-product-usage" class="form-textarea" placeholder="Matin et soir, étapes de la routine..."></textarea>
          </div>

          <!-- Sélecteur d'image parmi les photos réelles -->
          <div class="form-group">
            <label class="form-label">Sélectionner une Photo de la Boutique :</label>
            <input type="text" id="form-product-image" class="form-input" value="https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669268/mallofbeauty_assets/stands_esthetique.jpg" required>
            <div class="image-preview-picker">
              ${availableImages.map(img => `
                <img src="${img.src}" alt="${img.label}" class="image-picker-option" title="${img.label}" onclick="document.getElementById('form-product-image').value = '${img.src}'; document.querySelectorAll('.image-picker-option').forEach(el=>el.classList.remove('selected')); this.classList.add('selected');">
              `).join("")}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <input type="checkbox" id="form-product-featured" style="width: 18px; height: 18px; accent-color: #D97706;">
            <label for="form-product-featured" style="font-size: 0.95rem; color: #0F172A; font-weight: 600; cursor: pointer;">
              ⭐ Définir comme « Produit Phare » (Mis en avant sur le site vitrine)
            </label>
          </div>

          <div style="display: flex; gap: 12px;">
            <button type="submit" class="btn btn-gold btn-sm">Enregistrer le Produit</button>
            <button type="button" class="btn btn-dark btn-sm" onclick="window.MoB.cancelProductEdit()">Annuler</button>
          </div>
        </form>
      </div>
    ` : ''}

    <!-- Tableau des Produits -->
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Visuel</th>
            <th>Nom / Marque</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Phare</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td>
                <img src="${p.image}" alt="${p.name}" class="product-thumb-cell">
              </td>
              <td>
                <strong style="color: #0F172A;">${p.name}</strong><br>
                <span style="font-size: 0.8rem; color: #64748B;">${p.brand}</span>
              </td>
              <td>
                <span class="badge" style="background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; font-size: 0.72rem; font-weight: 700;">${p.category}</span>
              </td>
              <td>
                <strong style="color: #0F172A; font-weight: 800;">${formatPriceFCFA(p.price)}</strong>
              </td>
              <td style="color: #334155; font-weight: 600;">${p.stock}</td>
              <td>
                <button class="btn-action-sm ${p.isFeatured ? 'btn-gold' : 'btn-dark'}" onclick="window.MoB.handleToggleFeatured('${p.id}')">
                  ${p.isFeatured ? '★ Phare' : '☆ Non'}
                </button>
              </td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <button class="btn-action-sm btn-dark" onclick="window.MoB.startEditProduct('${p.id}')" title="Modifier">
                    ✏️
                  </button>
                  <button class="btn-action-sm btn-danger" onclick="window.MoB.handleDeleteProduct('${p.id}')" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAppointmentsTab(appointments) {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">📅 Formulaire « Consultation & Diagnostic Beauté » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Suivi des demandes soumises via la section de réservation de diagnostic personnalisé.</p>
      </div>
      <span class="badge" style="background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-weight: 700;">${appointments.length} Réservations</span>
    </div>

    <div class="admin-callout-info">
      💡 <strong>Données factices actives (Abidjan) :</strong> 5 réservations réalistes (Aïcha Traoré - Femme enceinte/taches, Koffi Jean-Luc - Soins barbe homme, Mariam Coulibaly - Future mariée, Sarah Bamba - Acné K-Beauty, Estelle N'Dri - Anti-âge). Vous pouvez modifier le statut en direct, contacter le client sur WhatsApp en 1 clic ou supprimer la réservation.
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date & Client</th>
            <th>Téléphone</th>
            <th>Profil & Mode</th>
            <th>Détails & Besoins</th>
            <th>Statut du RDV</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appointments.length === 0 ? `
            <tr><td colspan="6" style="text-align: center; color: #64748B; padding: 30px;">Aucune réservation pour le moment. Cliquez sur « Recharger Données Factices » pour réinjecter des exemples.</td></tr>
          ` : appointments.map(a => `
            <tr>
              <td>
                <strong style="color: #0F172A;">${a.fullName}</strong><br>
                <span style="font-size: 0.78rem; color: #059669; font-weight: 700;">${a.preferredDate || 'Date non précisée'} à ${a.preferredTime || ''}</span>
              </td>
              <td>
                <a href="tel:${a.phone}" style="color: #0F172A; font-weight: 700;">${a.phone}</a>
              </td>
              <td>
                <strong style="color: #0F172A;">${a.type}</strong><br>
                <span style="font-size: 0.8rem; color: #475569;">${a.mode}</span>
              </td>
              <td style="max-width: 250px; font-size: 0.82rem; color: #475569;">
                ${a.notes || 'Pas de note particulière'}
              </td>
              <td>
                <select class="form-select" style="font-size: 0.78rem; padding: 4px 8px; width: auto;" onchange="window.MoB.handleUpdateAppointmentStatus('${a.id}', this.value)">
                  <option value="En attente" ${a.status === 'En attente' ? 'selected' : ''}>🟡 En attente</option>
                  <option value="Confirmé" ${a.status === 'Confirmé' ? 'selected' : ''}>🟢 Confirmé</option>
                  <option value="Terminé" ${a.status === 'Terminé' ? 'selected' : ''}>✅ Terminé</option>
                  <option value="Annulé" ${a.status === 'Annulé' ? 'selected' : ''}>❌ Annulé</option>
                </select>
              </td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a href="https://wa.me/${a.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${a.fullName}, Mall of Beauty vous contacte au sujet de votre demande de consultation beauté prévue le ${a.preferredDate}.`)}" target="_blank" class="btn-action-sm btn-whatsapp" title="Répondre directement sur WhatsApp">
                    💬
                  </a>
                  <button class="btn-action-sm btn-danger" onclick="window.MoB.handleDeleteAppointment('${a.id}')" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPersonalShopperTab(psRequests) {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">💎 Formulaire « Conciergerie VIP & Personal Shopper » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Suivi du sourcing sur-mesure d'articles rares et application de la règle d'acompte de 60%.</p>
      </div>
      <span class="badge" style="background: #FAF5FF; color: #6B21A8; border: 1px solid #E9D5FF; font-weight: 700;">${psRequests.length} Demandes VIP</span>
    </div>

    <div class="admin-callout-info">
      💡 <strong>Données factices actives (Sourcing de Luxe) :</strong> 4 commandes VIP (Baccarat Rouge 540 Extrait pour Béatrice Konan, Sac cuir Florence italien pour Ibrahim Touré, Pagne Vlisco Grand Super Collector pour Sokhna Diop, Medicube Age-R Séoul pour Patricia Gnahoré). Vous pouvez valider l'acompte de 60%, mettre à jour le statut du transit et relancer le client par WhatsApp.
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Article Recherché</th>
            <th>Budget Prévu</th>
            <th>Acompte 60% (Règle MoB)</th>
            <th>Statut Logistique</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${psRequests.length === 0 ? `
            <tr><td colspan="6" style="text-align: center; color: #64748B; padding: 30px;">Aucune demande de sourcing pour le moment. Cliquez sur « Recharger Données Factices » pour injecter des exemples.</td></tr>
          ` : psRequests.map(r => `
            <tr>
              <td>
                <strong style="color: #0F172A;">${r.clientName}</strong><br>
                <a href="tel:${r.clientPhone}" style="font-size: 0.8rem; color: #7C3AED; font-weight: 700;">${r.clientPhone}</a>
              </td>
              <td>
                <strong style="color: #0F172A;">${r.itemRequested}</strong><br>
                <span style="font-size: 0.78rem; color: #64748B;">${r.category}</span>
              </td>
              <td>
                <strong style="color: #0F172A; font-weight: 800;">${r.targetBudget || 'Non précisé'}</strong>
              </td>
              <td>
                <select class="form-select" style="font-size: 0.78rem; padding: 4px 8px; width: auto;" onchange="window.MoB.handleUpdatePSDeposit('${r.id}', this.value)">
                  <option value="En attente de versement 60%" ${r.depositStatus.includes('attente') ? 'selected' : ''}>⚠️ En attente 60%</option>
                  <option value="Acompte 60% Reçu" ${r.depositStatus.includes('Reçu') ? 'selected' : ''}>✅ Acompte 60% Validé</option>
                </select>
              </td>
              <td>
                <select class="form-select" style="font-size: 0.78rem; padding: 4px 8px; width: auto;" onchange="window.MoB.handleUpdatePSStatus('${r.id}', this.value)">
                  <option value="En recherche active" ${r.status === 'En recherche active' ? 'selected' : ''}>🔍 En recherche</option>
                  <option value="Trouvé & En transit" ${r.status === 'Trouvé & En transit' ? 'selected' : ''}>✈️ En transit</option>
                  <option value="Arrivé en boutique" ${r.status === 'Arrivé en boutique' ? 'selected' : ''}>🏬 Arrivé aux Vallons</option>
                  <option value="Livré au Client" ${r.status === 'Livré au Client' ? 'selected' : ''}>🎁 Livré</option>
                </select>
              </td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a href="https://wa.me/${r.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${r.clientName}, Mall of Beauty vous contacte au sujet de votre demande Personal Shopper pour : ${r.itemRequested}.`)}" target="_blank" class="btn-action-sm btn-whatsapp" title="Contacter sur WhatsApp">
                    💬
                  </a>
                  <button class="btn-action-sm btn-danger" onclick="window.MoB.handleDeletePS('${r.id}')" title="Supprimer cette demande">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderLoyaltyTab(members) {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">👑 Formulaire « Adhésion Carte Privilège VIP » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Fichier des adhérents enregistrés via la carte VIP virtuelle avec suivi des remises anniversaire (-10%) et cycles.</p>
      </div>
      <span class="badge" style="background: #FDF2F8; color: #9D174D; border: 1px solid #FBCFE8; font-weight: 700;">${members.length} Adhérents VIP</span>
    </div>

    <div class="admin-callout-info">
      💡 <strong>Données factices actives (Fidélité Abidjan) :</strong> 5 membres VIP enregistrés (Marie-Josée Gbagbo, Dr. Armand Brou, Aminata Fofana, Marc-Olivier Kouassi, Sandrine Kra) avec leurs dates d'anniversaires, quartiers et rayons favoris. Cliquez sur 💬 pour féliciter un client ou lui transmettre son coupon VIP par WhatsApp.
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date Inscription</th>
            <th>Code VIP</th>
            <th>Nom & Prénoms</th>
            <th>Contact WhatsApp</th>
            <th>Anniversaire (-10%)</th>
            <th>Quartier / Ville</th>
            <th>Rayon Favori</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${members.length === 0 ? `
            <tr><td colspan="8" style="text-align: center; color: #64748B; padding: 30px;">Aucun adhérent enregistré pour le moment. Cliquez sur « Recharger Données Factices ».</td></tr>
          ` : members.map(m => `
            <tr>
              <td style="font-size: 0.78rem; color: #64748B;">${new Date(m.createdAt).toLocaleDateString('fr-FR')}</td>
              <td><span style="font-family: monospace; font-weight: 800; color: #9A7B38; background: #FDF8ED; padding: 3px 8px; border-radius: 4px; border: 1px solid #E8D5B5; font-size: 0.85rem;">${m.clientCode || 'MOB-VIP-2026'}</span></td>
              <td><strong style="color: #0F172A;">${m.fullName}</strong></td>
              <td>
                <a href="https://wa.me/${m.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #059669; font-weight: 700;">
                  ${m.phone}
                </a>
              </td>
              <td>
                <span class="badge" style="background: #F8FAFC; color: #0F172A; border: 1px solid #E2E8F0; font-size: 0.75rem; font-weight: 700;">🎂 ${m.birthDate || 'Non renseigné'}</span>
              </td>
              <td style="font-size: 0.85rem; color: #334155;">${m.neighborhood || 'Abidjan'}</td>
              <td style="font-size: 0.85rem; color: #64748B;">${m.favoriteCategory || 'Gamme Femme & Dermo'}</td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a href="https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${m.fullName}, Mall of Beauty vous remercie de votre fidélité au Club Privilège (Votre code VIP : ${m.clientCode || 'MOB-VIP'}).`)}" target="_blank" class="btn-action-sm btn-whatsapp" title="Envoyer un message WhatsApp">
                    💬
                  </a>
                  <button class="btn-action-sm btn-danger" onclick="window.MoB.handleDeleteLoyaltyMember('${m.id}')" title="Supprimer cet adhérent">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderContactsTab(contacts) {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">💬 Formulaire « Contact & Devis MoB » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Messages envoyés directement par les internautes depuis le formulaire de contact du site.</p>
      </div>
      <span class="badge" style="background: #FFF7ED; color: #9A3412; border: 1px solid #FED7AA; font-weight: 700;">${contacts.length} Messages Reçus</span>
    </div>

    <div class="admin-callout-info">
      💡 <strong>Données factices actives (Messagerie Clients) :</strong> 4 messages d'Abidjan et de l'intérieur (Yasmine Sylla - Stock Beauty of Joseon, Franck Bédié - Commande groupée vers Yamoussoukro, Carole Zadi - Réservation pagne Vlisco rare, David Ehui - Conseils rasage homme). Cliquez sur le bouton 💬 vert pour ouvrir la discussion WhatsApp avec une réponse préremplie.
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date & Expéditeur</th>
            <th>Contact Téléphone</th>
            <th>Objet du Message</th>
            <th>Contenu du Message</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${contacts.length === 0 ? `
            <tr><td colspan="6" style="text-align: center; color: #64748B; padding: 30px;">Aucun message reçu pour le moment. Cliquez sur « Recharger Données Factices ».</td></tr>
          ` : contacts.map(c => `
            <tr>
              <td>
                <strong style="color: #0F172A;">${c.name}</strong><br>
                <span style="font-size: 0.78rem; color: #64748B;">${new Date(c.createdAt).toLocaleDateString('fr-FR')} à ${new Date(c.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </td>
              <td>
                <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #059669; font-weight: 700;">
                  ${c.phone}
                </a>
              </td>
              <td>
                <strong style="color: #0F172A; font-size: 0.88rem;">${c.subject}</strong>
              </td>
              <td style="max-width: 280px; font-size: 0.84rem; color: #334155; line-height: 1.4;">
                ${c.message}
              </td>
              <td>
                <select class="form-select" style="font-size: 0.78rem; padding: 4px 8px; width: auto;" onchange="window.MoB.handleUpdateContactStatus('${c.id}', this.value)">
                  <option value="Non lu" ${c.status === 'Non lu' ? 'selected' : ''}>🔴 Non lu</option>
                  <option value="En cours de traitement" ${c.status === 'En cours de traitement' ? 'selected' : ''}>🟡 En cours</option>
                  <option value="Répondu par WhatsApp" ${c.status === 'Répondu par WhatsApp' ? 'selected' : ''}>🟢 Répondu WhatsApp</option>
                  <option value="Résolu" ${c.status === 'Résolu' ? 'selected' : ''}>✅ Résolu</option>
                </select>
              </td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${c.name}, Mall of Beauty vous répond suite à votre message : « ${c.subject} ».\n\n`)}" target="_blank" class="btn-action-sm btn-whatsapp" title="Répondre sur WhatsApp">
                    💬
                  </a>
                  <button class="btn-action-sm btn-danger" onclick="window.MoB.handleDeleteContact('${c.id}')" title="Supprimer ce message">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAnalyticsTab(analytics) {
  const gsm = analytics.phone_call || 0;
  const wa = analytics.whatsapp || 0;
  const ig = analytics.instagram || 0;
  const tt = analytics.tiktok || 0;
  const booking = analytics.booking || 0;
  const shopper = analytics.shopper || 0;
  const loyalty = analytics.loyalty || 0;

  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">📊 Tableau de Bord Analytique & Tracking des Clics CTA</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Suivi en temps réel des interactions sur vos boutons d'action (CTA) et réseaux sociaux.</p>
      </div>
      <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.handleResetAnalytics()">
        🔄 Réinitialiser les Compteurs
      </button>
    </div>

    <!-- Grille des Métriques Détaillées -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-top: 4px solid #2563EB;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #2563EB; font-weight: 700;">Appels Directs GSM</span>
          <span style="font-size: 1.3rem;">📞</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 800; color: #0F172A;">${gsm}</div>
        <div style="font-size: 0.76rem; color: #64748B; margin-top: 4px;">Clics sur le numéro portable classique</div>
      </div>

      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-top: 4px solid #059669;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #059669; font-weight: 700;">WhatsApp Business</span>
          <span style="font-size: 1.3rem;">💬</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 800; color: #0F172A;">${wa}</div>
        <div style="font-size: 0.76rem; color: #64748B; margin-top: 4px;">Commandes & prises de contact</div>
      </div>

      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-top: 4px solid #DB2777;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #DB2777; font-weight: 700;">Visites Instagram</span>
          <span style="font-size: 1.3rem;">📷</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 800; color: #0F172A;">${ig}</div>
        <div style="font-size: 0.76rem; color: #64748B; margin-top: 4px;">Redirections vers @mallofbeauty_mofb</div>
      </div>

      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-top: 4px solid #0891B2;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #0891B2; font-weight: 700;">Vidéos TikTok</span>
          <span style="font-size: 1.3rem;">🎵</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 800; color: #0F172A;">${tt}</div>
        <div style="font-size: 0.76rem; color: #64748B; margin-top: 4px;">Redirections vers @mallofbeauty1</div>
      </div>
    </div>

    <!-- Récapitulatif des Conversions Formulaires -->
    <div class="luxury-card" style="padding: 24px; background: #FFFFFF; border: 1.5px solid #E2E8F0; margin-bottom: 24px;">
      <h5 style="color: #0F172A; font-size: 1rem; margin-bottom: 16px; font-weight: 700;">Engagement & Soumissions de Formulaires</h5>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
        <div style="padding: 16px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: var(--radius-md);">
          <div style="font-size: 1.6rem; font-weight: 800; color: #D97706;">${booking}</div>
          <div style="font-size: 0.82rem; color: #475569; margin-top: 4px; font-weight: 600;">RDV Conseils Validés</div>
        </div>
        <div style="padding: 16px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: var(--radius-md);">
          <div style="font-size: 1.6rem; font-weight: 800; color: #2563EB;">${shopper}</div>
          <div style="font-size: 0.82rem; color: #475569; margin-top: 4px; font-weight: 600;">Demandes Personal Shopper</div>
        </div>
        <div style="padding: 16px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: var(--radius-md);">
          <div style="font-size: 1.6rem; font-weight: 800; color: #DB2777;">${loyalty}</div>
          <div style="font-size: 0.82rem; color: #475569; margin-top: 4px; font-weight: 600;">Adhésions Carte Privilège</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 0.8rem; color: #64748B; display: flex; justify-content: space-between;">
        <span>Dernier événement : <strong style="color: #0F172A;">${analytics.lastEvent || 'Aucun'}</strong></span>
        <span>Dernière mise à jour : <strong style="color: #0F172A;">${new Date(analytics.updatedAt || Date.now()).toLocaleTimeString('fr-FR')}</strong></span>
      </div>
    </div>
  `;
}

function renderSettingsTab(settings) {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">⚙️ Paramètres Généraux de l'Établissement (CRUD)</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Modifiez vos coordonnées, bannières et horaires en temps réel.</p>
      </div>
    </div>

    <div class="admin-form-box">
      <form id="admin-settings-form" onsubmit="window.MoB.handleSaveSettings(event)">
        <div class="admin-form-grid">
          <div class="form-group">
            <label class="form-label">Slogan Officiel</label>
            <input type="text" id="set-slogan" class="form-input" value="${settings.slogan}">
          </div>
          <div class="form-group">
            <label class="form-label">Bandeau d'Annonce Supérieur</label>
            <input type="text" id="set-announcement" class="form-input" value="${settings.announcement}">
          </div>
        </div>

        <div class="admin-form-grid">
          <div class="form-group">
            <label class="form-label">Numéro WhatsApp Direction (Gérante)</label>
            <input type="text" id="set-whatsapp" class="form-input" value="${settings.contacts.whatsappDisplay}">
          </div>
          <div class="form-group">
            <label class="form-label">Numéro Téléphone Secrétariat / Boutique</label>
            <input type="text" id="set-phone" class="form-input" value="${settings.contacts.phoneServiceDisplay}">
          </div>
        </div>

        <div class="admin-form-grid">
          <div class="form-group">
            <label class="form-label">Jours d'Ouverture</label>
            <input type="text" id="set-days" class="form-input" value="${settings.openingHours.days}">
          </div>
          <div class="form-group">
            <label class="form-label">Plage Horaire</label>
            <input type="text" id="set-hours" class="form-input" value="${settings.openingHours.hours}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Repère Géographique / Adresse</label>
          <input type="text" id="set-landmark" class="form-input" value="${settings.address.landmark}">
        </div>

        <!-- Configuration Avis Google & Widget API / Tiers -->
        <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
            <div>
              <h4 style="font-size: 1.05rem; color: #0F172A; margin: 0; font-weight: 700;">Configuration des Avis Clients Google</h4>
              <p style="font-size: 0.8rem; color: #64748B; margin: 2px 0 0 0;">Liez votre fiche Google Maps ou connectez un widget / une clé API Google Places.</p>
            </div>
          </div>

          <div class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">Lien de Consultation des Avis (Fiche Google Maps)</label>
              <input type="text" id="set-google-maps" class="form-input" value="${settings.contacts.googleMapsUrl || 'https://www.google.com/maps/dir/?api=1&destination=5.358245,-3.992812'}">
            </div>
            <div class="form-group">
              <label class="form-label">Lien Direct pour Laisser un Avis Google</label>
              <input type="text" id="set-google-review-url" class="form-input" value="${settings.contacts.googleReviewWriteUrl || 'https://search.google.com/local/writereview?placeid=ChIJ-mallofbeauty-abidjan'}">
            </div>
          </div>

          <div class="admin-form-grid" style="margin-top: 12px;">
            <div class="form-group">
              <label class="form-label">Note Globale Affichée (ex: 4.9)</label>
              <input type="text" id="set-google-rating" class="form-input" value="${settings.contacts.googleRating || '4.9'}">
            </div>
            <div class="form-group">
              <label class="form-label">Nombre d'Avis Affiché (ex: 128)</label>
              <input type="text" id="set-google-count" class="form-input" value="${settings.contacts.googleReviewCount || '128'}">
            </div>
          </div>

          <div style="background: #FFFFFF; border: 1.5px dashed #94A3B8; border-radius: 8px; padding: 16px; margin-top: 14px;">
            <h5 style="font-size: 0.88rem; color: #0F172A; margin: 0 0 6px 0; font-weight: 700;">🔑 Intégration Dynamique (Clé API Google Places ou Widget Tiers)</h5>
            <p style="font-size: 0.78rem; color: #64748B; margin: 0 0 10px 0;">Si vous renseignez une clé Google Places ou un code de widget tiers (ex: Elfsight, EmbedSocial), le composant passera automatiquement du mode statique au mode dynamique.</p>
            
            <div class="admin-form-grid">
              <div class="form-group">
                <label class="form-label">Clé API Google Places (API Key)</label>
                <input type="text" id="set-google-api-key" class="form-input" placeholder="AIzaSy... (optionnel)" value="${settings.contacts.googlePlacesApiKey || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Place ID Google de la boutique</label>
                <input type="text" id="set-google-place-id" class="form-input" placeholder="ChIJ... (optionnel)" value="${settings.contacts.googlePlaceId || 'ChIJ-mallofbeauty-abidjan'}">
              </div>
            </div>

            <div class="form-group" style="margin-top: 10px;">
              <label class="form-label">Code HTML/Script du Widget Tiers (ex: Elfsight, EmbedSocial)</label>
              <textarea id="set-google-widget-code" class="form-textarea" style="height: 70px; font-family: monospace; font-size: 0.8rem;" placeholder="<div class='elfsight-app-...' data-elfsight-app-lazy></div>">${settings.contacts.googleWidgetCode || ''}</textarea>
            </div>
          </div>
        </div>

        <!-- Section Spéciale Wave Côte d'Ivoire & QR Code -->
        <div style="background: #F0F9FF; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="#008BE5"/>
              <path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM14.2 21.5L9.5 16.8L11.2 15.1L14.2 18.1L20.8 11.5L22.5 13.2L14.2 21.5Z" fill="white"/>
            </svg>
            <h4 style="font-size: 1.05rem; color: #0369A1; margin: 0; font-weight: 700;">Configuration Paiement Wave Côte d'Ivoire & QR Code</h4>
          </div>

          <div class="admin-form-grid">
            <div class="form-group">
              <label class="form-label">Numéro Marchand Wave Officiel</label>
              <input type="text" id="set-wave" class="form-input" value="${settings.contacts.waveDisplay || '+225 07 77 02 72 35'}">
            </div>
            <div class="form-group">
              <label class="form-label">Lien de Paiement Wave Direct (Deep Link / URL)</label>
              <input type="text" id="set-wave-url" class="form-input" value="${settings.contacts.wavePaymentUrl || 'https://pay.wave.com/m/M_CI_mallofbeauty'}">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: start; margin-top: 14px;">
            <div>
              <div class="form-group">
                <label class="form-label">Image ou Chemin du QR Code Wave</label>
                <input type="text" id="set-wave-qrcode" class="form-input" value="${settings.contacts.waveQrCode || './imgs/wave_qr_code.svg'}" placeholder="./imgs/wave_qr_code.svg ou URL">
              </div>

              <div class="form-group" style="margin-top: 10px;">
                <label class="form-label" style="font-size: 0.8rem; color: #64748B;">Ou importer un nouveau QR Code (fichier image) :</label>
                <input type="file" id="set-wave-qrcode-file" accept="image/*" class="form-input" style="padding: 6px;" onchange="window.MoB.handleWaveQrUpload(event)">
              </div>
            </div>

            <!-- Aperçu QR Code en direct -->
            <div style="text-align: center; background: #FFFFFF; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 12px; width: 140px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <span style="font-size: 0.72rem; color: #0284C7; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Aperçu QR Code</span>
              <img src="${settings.contacts.waveQrCode || './imgs/wave_qr_code.svg'}" id="wave-qrcode-admin-preview" alt="Aperçu QR Code Wave" style="width: 110px; height: 110px; object-fit: contain; border-radius: 8px; background: #FFF; padding: 4px;">
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-gold btn-sm">Mettre à Jour les Paramètres</button>
      </form>
    </div>
  `;
}

function renderBackupTab() {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">💾 Sauvegarde & Restauration des Données</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Exportez votre base de données ou réinitialisez les données factices d'origine.</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div class="luxury-card" style="padding: 24px; background: #FFFFFF; border: 1.5px solid #E2E8F0;">
        <h4 style="color: #0F172A; margin-bottom: 8px; font-weight: 700;">🔄 Recharger Données Factices</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 16px;">Réinjecte instantanément toutes les réservations, demandes VIP, cartes privilège et messages clients d'Abidjan pour tester les formulaires.</p>
        <button class="btn btn-gold btn-sm" onclick="window.MoB.reloadAllDummyData()">Recharger les Données Factices</button>
      </div>

      <div class="luxury-card" style="padding: 24px; background: #FFFFFF; border: 1.5px solid #E2E8F0;">
        <h4 style="color: #0F172A; margin-bottom: 8px; font-weight: 700;">Exporter les Données</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 16px;">Téléchargez une sauvegarde JSON complète contenant vos produits, rendez-vous et réglages.</p>
        <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.exportDatabase()">Télécharger le fichier JSON</button>
      </div>

      <div class="luxury-card" style="padding: 24px; background: #FFF1F2; border: 1.5px solid #FECDD3; grid-column: 1 / -1;">
        <h4 style="color: #BE123C; margin-bottom: 8px; font-weight: 700;">Réinitialisation Totale d'Usine</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 16px;">Efface le stockage local et réinitialise l'application complète aux paramètres d'origine.</p>
        <button class="btn btn-danger btn-sm" onclick="window.MoB.confirmResetFactory()">Restaurer les données initiales</button>
      </div>
    </div>
  `;
}

function renderGalleryTab(galleryImages) {
  const editingItem = editingGalleryId ? galleryImages.find(img => img.id === editingGalleryId) : null;
  const isFormOpen = showAddGalleryForm || !!editingItem;

  const quickPresets = [
    { label: "Façade Boutique", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg", caption: "Façade Mall of Beauty • Les Vallons" },
    { label: "Salon VIP", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669197/mallofbeauty_assets/interieur.jpg", caption: "Salon d'Accueil VIP & Conseils" },
    { label: "Bar Maquillage", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669256/mallofbeauty_assets/stand_makeup.jpg", caption: "Bar à Maquillage & Cosmétiques" },
    { label: "Maroquinerie", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669257/mallofbeauty_assets/stand_maroquinerie.jpg", caption: "Maroquinerie & Sacs de Luxe" },
    { label: "Pagnes Vlisco", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669259/mallofbeauty_assets/stand_pagnes.jpg", caption: "Espace Pagnes Vlisco Officiel" },
    { label: "Perruques HD", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669265/mallofbeauty_assets/stand_perruques.jpg", caption: "Haute Coiffure & Perruques HD" },
    { label: "Soins Visage", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669268/mallofbeauty_assets/stands_esthetique.jpg", caption: "Soins Visage & K-Beauty" },
    { label: "Angle Rue Jardins", src: "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669193/mallofbeauty_assets/devanture_cote.jpg", caption: "Vue d'angle Rue des Jardins" },
    { label: "Façade Nuit", src: "./imgs/devanture_face_nuit.jpeg", caption: "Boutique Illuminée de Nuit" },
    { label: "Angle Nuit", src: "./imgs/devanture_cote_nuit.jpeg", caption: "Vue d'angle de nuit" }
  ];

  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 700;">📸 Galerie Photos Réelles de la Boutique</h4>
        <p style="font-size: 0.85rem; color: #64748B; margin: 4px 0 0 0;">Gérez les photos affichées dans le bloc « L'Atmosphère Mall of Beauty en Images » sous la bannière d'accueil.</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <span class="badge" style="background: #FEF3C7; color: #92400E; border: 1.5px solid #FDE68A; font-weight: 800; font-size: 0.85rem; padding: 6px 14px;">
          ${galleryImages.length} Photos Actives
        </span>
        <button class="btn btn-gold btn-sm" onclick="window.MoB.toggleGalleryForm()">
          ${isFormOpen ? '✕ Fermer le Formulaire' : '➕ Ajouter une Photo'}
        </button>
        <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.handleResetGallery()" title="Restaurer les 8 photos d'origine de la boutique">
          🔄 Restaurer Photos d'Origine
        </button>
      </div>
    </div>

    <!-- Formulaire d'Ajout / Modification de Photo -->
    ${isFormOpen ? `
      <div class="luxury-card" style="padding: 24px; background: #FFFBEB; border: 1.5px solid #FDE68A; margin-bottom: 24px; border-radius: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h4 style="font-size: 1.05rem; color: #92400E; margin: 0; font-weight: 700;">
            ${editingItem ? `✏️ Modifier la Photo : ${editingItem.caption}` : '➕ Ajouter une Nouvelle Photo à la Galerie'}
          </h4>
          <button class="btn-action-sm btn-dark" onclick="window.MoB.toggleGalleryForm()">✕ Annuler</button>
        </div>

        <form id="admin-gallery-form" onsubmit="window.MoB.handleSaveGalleryItem(event)">
          <input type="hidden" id="gal-edit-id" value="${editingItem ? editingItem.id : ''}">

          <div style="display: grid; grid-template-columns: 1fr 180px; gap: 20px; align-items: start;">
            <div>
              <div class="form-group" style="margin-bottom: 14px;">
                <label class="form-label" style="color: #78350F;">URL ou Chemin de l'Image *</label>
                <input type="text" id="gal-input-src" class="form-input" 
                       value="${editingItem ? editingItem.src : ''}" 
                       placeholder="https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg ou https://..." 
                       required 
                       oninput="const p = document.getElementById('gal-preview-img'); if(p) p.src = this.value">
              </div>

              <!-- Raccourcis Photos Prêtes de la Boutique -->
              <div style="margin-bottom: 14px;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #92400E; text-transform: uppercase;">Sélection rapide parmi les photos existantes :</span>
                <div class="admin-gallery-presets">
                  ${quickPresets.map(preset => `
                    <button type="button" class="admin-gallery-preset-pill" onclick="window.MoB.selectGalleryPreset('${preset.src}', '${preset.caption.replace(/'/g, "\\'")}')">
                      ${preset.label}
                    </button>
                  `).join("")}
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 18px;">
                <label class="form-label" style="color: #78350F;">Légende / Titre de la Photo *</label>
                <input type="text" id="gal-input-caption" class="form-input" 
                       value="${editingItem ? editingItem.caption : ''}" 
                       placeholder="Ex: Bar à Maquillage & Cosmétiques de Luxe" 
                       required>
              </div>

              <div style="display: flex; gap: 10px;">
                <button type="submit" class="btn btn-gold btn-sm">
                  ${editingItem ? '💾 Enregistrer les Modifications' : '➕ Ajouter à la Galerie'}
                </button>
                <button type="button" class="btn btn-outline-gold btn-sm" onclick="window.MoB.toggleGalleryForm()">
                  Annuler
                </button>
              </div>
            </div>

            <!-- Boîte de Prévisualisation -->
            <div style="text-align: center; background: #FFFFFF; border: 1.5px solid #FCD34D; border-radius: 12px; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
              <span style="font-size: 0.72rem; color: #92400E; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Aperçu Visuel</span>
              <img id="gal-preview-img" 
                   src="${editingItem ? editingItem.src : 'https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg'}" 
                   alt="Aperçu" 
                   style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid #E2E8F0; background: #000;"
                   onerror="this.src='https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669201/mallofbeauty_assets/logo_.png'">
            </div>
          </div>
        </form>
      </div>
    ` : ''}

    <div class="admin-callout-info" style="margin-bottom: 20px;">
      💡 <strong>Règle d'affichage :</strong> Le bloc affiche un maximum de <strong>2 lignes</strong> sur le site. S'il y a plus d'images, les visiteurs peuvent faire défiler au scroll. Sur mobile, la taille des vignettes est automatiquement réduite de moitié pour un affichage optimal.
    </div>

    <!-- Grille des Photos de la Galerie -->
    <div class="admin-gallery-grid">
      ${galleryImages.length === 0 ? `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #FFFFFF; border-radius: 12px; border: 1.5px dashed #CBD5E1;">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 10px;">📸</span>
          <h4 style="color: #0F172A; margin-bottom: 6px;">Aucune photo dans la galerie</h4>
          <p style="color: #64748B; margin-bottom: 16px;">Ajoutez votre première photo ou restaurez les photos par défaut.</p>
          <button class="btn btn-gold btn-sm" onclick="window.MoB.handleResetGallery()">Restaurer les 8 photos d'origine</button>
        </div>
      ` : galleryImages.map(item => `
        <div class="admin-gallery-card">
          <div class="admin-gallery-thumb-wrap">
            <img src="${item.src}" alt="${item.caption}" class="admin-gallery-thumb" loading="lazy">
          </div>
          <div class="admin-gallery-card-body">
            <div class="admin-gallery-card-caption">${item.caption}</div>
            <div class="admin-gallery-card-url">${item.src}</div>
            <div class="admin-gallery-card-actions">
              <button class="btn-action-sm btn-dark" onclick="window.MoB.startEditGalleryItem('${item.id}')" title="Modifier cette photo">
                ✏️ Modifier
              </button>
              <button class="btn-action-sm btn-danger" onclick="window.MoB.handleDeleteGalleryItem('${item.id}')" title="Supprimer cette photo">
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

export function setEditingProductId(id) {
  editingProductId = id;
  showAddProductForm = id != null;
}

export function toggleAddProductFormState() {
  showAddProductForm = !showAddProductForm;
  if (!showAddProductForm) editingProductId = null;
}

export function setEditingGalleryId(id) {
  editingGalleryId = id;
  showAddGalleryForm = id != null;
}

export function toggleAddGalleryFormState() {
  showAddGalleryForm = !showAddGalleryForm;
  if (!showAddGalleryForm) editingGalleryId = null;
}

export function switchAdminTabLive(tab) {
  currentTab = tab;

  // 1. Mettre à jour l'état actif sur les boutons de navigation sidebar et stats cards
  const navItems = document.querySelectorAll(".mob-nav-item, .admin-stat-card");
  navItems.forEach(item => {
    if (item.dataset.tab === tab) {
      item.classList.add("active");
      item.classList.add("active-stat");
    } else {
      item.classList.remove("active");
      item.classList.remove("active-stat");
    }
  });

  // 2. Mettre à jour les informations du topbar
  const info = getTabInfo(tab);
  const titleEl = document.getElementById("mob-admin-active-title");
  if (titleEl) titleEl.textContent = info.title;

  const breadcrumbEl = document.getElementById("mob-admin-active-breadcrumb");
  if (breadcrumbEl) breadcrumbEl.textContent = info.breadcrumb;

  const descEl = document.getElementById("mob-admin-active-desc");
  if (descEl) descEl.textContent = info.desc;

  // 3. Mettre à jour le conteneur actif
  const container = document.getElementById("admin-tab-container");
  if (container) {
    container.className = `mob-admin-content theme-${tab}`;
    container.innerHTML = renderAdminTabContent(tab);
    container.scrollTop = 0;
  }
}

export function refreshAdminActiveTab() {
  const products = getProducts();
  const appointments = getAppointments();
  const psRequests = getPersonalShopperRequests();
  const loyaltyMembers = getLoyaltyMembers();
  const contacts = getContacts();
  const analytics = getAnalyticsClicks();
  const galleryImages = getGalleryImages();

  const featuredCount = products.filter(p => p.isFeatured).length;
  const pendingAppointments = appointments.filter(a => a.status === "En attente").length;
  const pendingPS = psRequests.filter(r => r.status && r.status.includes("attente")).length;
  const unreadContacts = contacts.filter(c => c.status === "Non lu").length;

  const updateBadge = (tab, count, hasAlert = false) => {
    const badges = document.querySelectorAll(`[data-tab-badge="${tab}"]`);
    badges.forEach(b => {
      b.textContent = count;
      if (hasAlert) b.classList.add("warning");
      else b.classList.remove("warning");
    });
  };

  updateBadge('products', products.length);
  updateBadge('featured', featuredCount);
  updateBadge('appointments', appointments.length, pendingAppointments > 0);
  updateBadge('personal-shopper', psRequests.length, pendingPS > 0);
  updateBadge('loyalty', loyaltyMembers.length);
  updateBadge('contacts', contacts.length, unreadContacts > 0);
  updateBadge('analytics', analytics.total || 0);
  updateBadge('gallery', galleryImages.length);

  const container = document.getElementById("admin-tab-container");
  if (container) {
    container.className = `mob-admin-content theme-${currentTab}`;
    container.innerHTML = renderAdminTabContent(currentTab);
  }
}

