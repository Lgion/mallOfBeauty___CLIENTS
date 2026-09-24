import {
  getProducts, addProduct, updateProduct, deleteProduct, toggleFeatured,
  getAppointments, updateAppointmentStatus, deleteAppointment,
  getPersonalShopperRequests, updatePersonalShopperStatus, updatePersonalShopperDeposit, deletePersonalShopperRequest,
  getLoyaltyMembers, deleteLoyaltyMember,
  getContacts, updateContactStatus, deleteContact,
  getAnalyticsClicks, resetAnalyticsClicks,
  getStoreSettings, updateStoreSettings, resetToFactory, reloadAllDummyData
} from "../data/storage.js";
import { formatPriceFCFA } from "./Catalog.js";

let currentTab = "products";
let editingProductId = null;
let showAddProductForm = false;

export function renderAdminDashboard(activeTab = "products") {
  currentTab = activeTab;
  const products = getProducts();
  const appointments = getAppointments();
  const psRequests = getPersonalShopperRequests();
  const loyaltyMembers = getLoyaltyMembers();
  const contacts = getContacts();
  const analytics = getAnalyticsClicks();
  const settings = getStoreSettings();

  const featuredCount = products.filter(p => p.isFeatured).length;
  const pendingAppointments = appointments.filter(a => a.status === "En attente").length;
  const pendingPS = psRequests.filter(r => r.status && r.status.includes("attente")).length;
  const unreadContacts = contacts.filter(c => c.status === "Non lu").length;

  return `
    <div class="admin-modal-wrap active" id="admin-modal-wrap" onclick="if(event.target === this) window.MoB.closeAdminModal()">
      <div class="admin-window">
        <!-- Topbar -->
        <div class="admin-topbar">
          <div class="admin-topbar-title">
            <span style="font-size: 1.3rem;">⚡</span>
            <div>
              <h3 style="font-size: 1.15rem; color: #FFF; margin: 0;">Back-Office de Gestion CRUD</h3>
              <span style="font-size: 0.78rem; color: var(--gold-light);">Mall of Beauty • Administration Boutique Cocody</span>
            </div>
            <span class="admin-badge-role">Accès Gérante</span>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.reloadAllDummyData()" title="Réinjecter les données factices réalistes d'Abidjan pour tous les formulaires">
              🔄 Recharger Données Factices
            </button>
            <button class="btn btn-icon" onclick="window.MoB.closeAdminModal()" aria-label="Fermer l'administration">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- En-tête & Onglets de Navigation Principale -->
        <div class="admin-nav-header">
          <span>📋 Sélectionner la section ou le formulaire à administrer :</span>
        </div>

        <!-- Zone de Contenu -->
        <div class="admin-content-area">
          <!-- Cartes Statistiques Cliquables (8 Couleurs Distinctes & Raccourcis Directs) -->
          <div class="admin-stats-row">
            <div class="admin-stat-card card-products ${currentTab === 'products' ? 'active-stat' : ''}" data-tab="products" onclick="window.MoB.switchAdminTab('products')" title="Gérer le catalogue complet des produits">
              <span class="admin-stat-num">${products.length}</span>
              <span class="admin-stat-label">Total Produits</span>
              <span class="admin-stat-hint">📦 Voir le catalogue</span>
            </div>
            <div class="admin-stat-card card-featured ${currentTab === 'featured' ? 'active-stat' : ''}" data-tab="featured" onclick="window.MoB.switchAdminTab('featured')" title="Gérer la sélection des produits phares en vitrine">
              <span class="admin-stat-num">${featuredCount}</span>
              <span class="admin-stat-label">Produits Phares</span>
              <span class="admin-stat-hint">⭐ Sélection vitrine</span>
            </div>
            <div class="admin-stat-card card-appointments ${currentTab === 'appointments' ? 'active-stat' : ''}" data-tab="appointments" onclick="window.MoB.switchAdminTab('appointments')" title="Gérer les rendez-vous de consultation beauté">
              <span class="admin-stat-num">${appointments.length}</span>
              <span class="admin-stat-label">RDV Diagnostic (${pendingAppointments} att.)</span>
              <span class="admin-stat-hint">📅 Gérer le formulaire</span>
            </div>
            <div class="admin-stat-card card-personal-shopper ${currentTab === 'personal-shopper' ? 'active-stat' : ''}" data-tab="personal-shopper" onclick="window.MoB.switchAdminTab('personal-shopper')" title="Gérer les demandes de Personal Shopper & Conciergerie">
              <span class="admin-stat-num">${psRequests.length}</span>
              <span class="admin-stat-label">Conciergerie VIP (${pendingPS} att.)</span>
              <span class="admin-stat-hint">💎 Suivi & acompte 60%</span>
            </div>
            <div class="admin-stat-card card-loyalty ${currentTab === 'loyalty' ? 'active-stat' : ''}" data-tab="loyalty" onclick="window.MoB.switchAdminTab('loyalty')" title="Gérer les adhérents à la Carte Privilège">
              <span class="admin-stat-num">${loyaltyMembers.length}</span>
              <span class="admin-stat-label">Membres Privilège</span>
              <span class="admin-stat-hint">👑 Anniversaires & -10%</span>
            </div>
            <div class="admin-stat-card card-contacts ${currentTab === 'contacts' ? 'active-stat' : ''}" data-tab="contacts" onclick="window.MoB.switchAdminTab('contacts')" title="Gérer les messages reçus depuis le formulaire de contact">
              <span class="admin-stat-num">${contacts.length}</span>
              <span class="admin-stat-label">Messages Contact (${unreadContacts} non lus)</span>
              <span class="admin-stat-hint">💬 Voir les messages</span>
            </div>
            <div class="admin-stat-card card-analytics ${currentTab === 'analytics' ? 'active-stat' : ''}" data-tab="analytics" onclick="window.MoB.switchAdminTab('analytics')" title="Consulter les statistiques de clics CTA">
              <span class="admin-stat-num">${analytics.total || 0}</span>
              <span class="admin-stat-label">Clics CTA Totaux</span>
              <span class="admin-stat-hint">📊 WhatsApp, GSM, Réseaux</span>
            </div>
            <div class="admin-stat-card card-settings ${currentTab === 'settings' ? 'active-stat' : ''}" data-tab="settings" onclick="window.MoB.switchAdminTab('settings')" title="Modifier les coordonnées et horaires de la boutique">
              <span class="admin-stat-num">9h-19h</span>
              <span class="admin-stat-label">Horaires & Contact</span>
              <span class="admin-stat-hint">⚙️ Infos boutique</span>
            </div>
          </div>

          <!-- Conteneur d'Onglet Actif avec la Même Couleur de Fond que la Carte Cliquée -->
          <div class="admin-active-tab-box theme-${currentTab}" id="admin-tab-container">
            ${renderAdminTabContent(currentTab)}
          </div>
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">⭐ Gestion des Produits Phares (Vitrine d'Accueil)</h4>
        <p style="font-size: 0.85rem; color: #FDE68A; margin: 0;">Articles d'exception sélectionnés pour la vitrine principale de Mall of Beauty.</p>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <span class="badge" style="background: rgba(245, 158, 11, 0.3); color: #FBBF24; border: 1.5px solid #F59E0B; font-weight: 800; font-size: 0.85rem; padding: 6px 14px;">
          ${featured.length} Produits Phares Actifs
        </span>
        <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.switchAdminTab('products')">
          📦 Ajouter depuis le Catalogue
        </button>
      </div>
    </div>

    <div class="admin-callout-info" style="border-left-color: #F59E0B; background: rgba(69, 36, 6, 0.45);">
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
              <td colspan="7" style="text-align: center; padding: 48px 20px; color: #FDE68A;">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">⭐</span>
                <strong>Aucun produit mis en avant pour le moment.</strong><br>
                <span style="font-size: 0.88rem; color: #FCD34D;">Rendez-vous dans l'onglet « Total Produits » pour sélectionner les articles vitrine.</span><br>
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
                <strong style="color: #FFF;">${p.name}</strong><br>
                <span style="font-size: 0.8rem; color: #CBD5E1;">${p.brand}</span>
              </td>
              <td>
                <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #FDE68A; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.72rem;">${p.category}</span>
              </td>
              <td>
                <strong style="color: #FBBF24;">${formatPriceFCFA(p.price)}</strong>
              </td>
              <td style="color: #F8FAFC;">${p.stock}</td>
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
    { label: "Stands Cosmétiques", src: "/imgs/stands_esthetique.jpg" },
    { label: "Rayon K-Beauty 1", src: "/imgs/stand5.jpg" },
    { label: "Rayon K-Beauty 2", src: "/imgs/stand4.jpg" },
    { label: "Soins Bébés 1", src: "/imgs/stand2.jpg" },
    { label: "Soins Bébés 2", src: "/imgs/stand0.jpg" },
    { label: "Soins & Crèmes", src: "/imgs/stand1.jpg" },
    { label: "Pagnes Vlisco 1", src: "/imgs/stand_pagnes.jpg" },
    { label: "Pagnes Vlisco 2", src: "/imgs/stand_pagnes_.jpg" },
    { label: "Voiles & Robes", src: "/imgs/vitrine_interieur_habits_hauts.jpg" },
    { label: "Maroquinerie & Sacs", src: "/imgs/stand_maroquinerie.jpg" },
    { label: "Perruques HD", src: "/imgs/stand_perruques.jpg" },
    { label: "Bar Maquillage", src: "/imgs/stand_makeup.jpg" },
    { label: "Façade Boutique", src: "/imgs/devanture_face.jpg" }
  ];

  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">Gestion des Articles du Catalogue (CRUD)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Créez, modifiez, supprimez et définissez les produits phares mis en avant dans la vitrine.</p>
      </div>
      <button class="btn btn-gold btn-sm" onclick="window.MoB.toggleAddProductForm()">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        <span>${showAddProductForm ? 'Fermer le formulaire' : 'Ajouter un Produit'}</span>
      </button>
    </div>

    <!-- Formulaire d'Ajout ou Édition -->
    ${showAddProductForm ? `
      <div class="admin-form-box" id="product-form-box">
        <h4 style="color: var(--gold-light); margin-bottom: 16px;">
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
            <input type="text" id="form-product-image" class="form-input" value="/imgs/stands_esthetique.jpg" required>
            <div class="image-preview-picker">
              ${availableImages.map(img => `
                <img src="${img.src}" alt="${img.label}" class="image-picker-option" title="${img.label}" onclick="document.getElementById('form-product-image').value = '${img.src}'; document.querySelectorAll('.image-picker-option').forEach(el=>el.classList.remove('selected')); this.classList.add('selected');">
              `).join("")}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <input type="checkbox" id="form-product-featured" style="width: 18px; height: 18px; accent-color: var(--gold-primary);">
            <label for="form-product-featured" style="font-size: 0.95rem; color: var(--gold-light); font-weight: 600; cursor: pointer;">
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
                <strong style="color: #FFF;">${p.name}</strong><br>
                <span style="font-size: 0.8rem; color: var(--text-dim);">${p.brand}</span>
              </td>
              <td>
                <span class="badge badge-gold" style="font-size: 0.72rem;">${p.category}</span>
              </td>
              <td>
                <strong style="color: var(--gold-light);">${formatPriceFCFA(p.price)}</strong>
              </td>
              <td>${p.stock}</td>
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">📅 Formulaire « Consultation & Diagnostic Beauté » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Suivi des demandes soumises via la section de réservation de diagnostic personnalisé.</p>
      </div>
      <span class="badge badge-gold">${appointments.length} Réservations</span>
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
            <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Aucune réservation pour le moment. Cliquez sur « Recharger Données Factices » pour réinjecter des exemples.</td></tr>
          ` : appointments.map(a => `
            <tr>
              <td>
                <strong style="color: #FFF;">${a.fullName}</strong><br>
                <span style="font-size: 0.78rem; color: var(--gold-light);">${a.preferredDate || 'Date non précisée'} à ${a.preferredTime || ''}</span>
              </td>
              <td>
                <a href="tel:${a.phone}" style="color: var(--gold-light); font-weight: 600;">${a.phone}</a>
              </td>
              <td>
                <strong>${a.type}</strong><br>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${a.mode}</span>
              </td>
              <td style="max-width: 250px; font-size: 0.82rem; color: var(--text-muted);">
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">💎 Formulaire « Conciergerie VIP & Personal Shopper » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Suivi du sourcing sur-mesure d'articles rares et application de la règle d'acompte de 60%.</p>
      </div>
      <span class="badge badge-gold">${psRequests.length} Demandes VIP</span>
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
            <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Aucune demande de sourcing pour le moment. Cliquez sur « Recharger Données Factices » pour injecter des exemples.</td></tr>
          ` : psRequests.map(r => `
            <tr>
              <td>
                <strong style="color: #FFF;">${r.clientName}</strong><br>
                <a href="tel:${r.clientPhone}" style="font-size: 0.8rem; color: var(--gold-light);">${r.clientPhone}</a>
              </td>
              <td>
                <strong>${r.itemRequested}</strong><br>
                <span style="font-size: 0.78rem; color: var(--text-dim);">${r.category}</span>
              </td>
              <td>
                <strong style="color: var(--gold-light);">${r.targetBudget || 'Non précisé'}</strong>
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">👑 Formulaire « Adhésion Carte Privilège VIP » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Fichier des adhérents enregistrés via la carte VIP virtuelle avec suivi des remises anniversaire (-10%) et cycles.</p>
      </div>
      <span class="badge badge-gold">${members.length} Adhérents VIP</span>
    </div>

    <div class="admin-callout-info">
      💡 <strong>Données factices actives (Fidélité Abidjan) :</strong> 5 membres VIP enregistrés (Marie-Josée Gbagbo, Dr. Armand Brou, Aminata Fofana, Marc-Olivier Kouassi, Sandrine Kra) avec leurs dates d'anniversaires, quartiers et rayons favoris. Cliquez sur 💬 pour féliciter un client ou lui transmettre son coupon VIP par WhatsApp.
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date Inscription</th>
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
            <tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">Aucun adhérent enregistré pour le moment. Cliquez sur « Recharger Données Factices ».</td></tr>
          ` : members.map(m => `
            <tr>
              <td style="font-size: 0.78rem; color: var(--text-dim);">${new Date(m.createdAt).toLocaleDateString('fr-FR')}</td>
              <td><strong style="color: #FFF;">${m.fullName}</strong></td>
              <td>
                <a href="https://wa.me/${m.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: var(--gold-light); font-weight: 600;">
                  ${m.phone}
                </a>
              </td>
              <td>
                <span class="badge badge-gold" style="font-size: 0.75rem;">🎂 ${m.birthDate || 'Non renseigné'}</span>
              </td>
              <td style="font-size: 0.85rem; color: var(--text-secondary);">${m.neighborhood || 'Abidjan'}</td>
              <td style="font-size: 0.85rem; color: var(--text-muted);">${m.favoriteCategory || 'Toutes collections'}</td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a href="https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${m.fullName}, Mall of Beauty vous remercie de votre fidélité au Club Privilège !`)}" target="_blank" class="btn-action-sm btn-whatsapp" title="Envoyer un message WhatsApp">
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">💬 Formulaire « Contact & Devis MoB » (CRUD)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Messages envoyés directement par les internautes depuis le formulaire de contact du site.</p>
      </div>
      <span class="badge badge-gold">${contacts.length} Messages Reçus</span>
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
            <tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Aucun message reçu pour le moment. Cliquez sur « Recharger Données Factices ».</td></tr>
          ` : contacts.map(c => `
            <tr>
              <td>
                <strong style="color: #FFF;">${c.name}</strong><br>
                <span style="font-size: 0.78rem; color: var(--text-dim);">${new Date(c.createdAt).toLocaleDateString('fr-FR')} à ${new Date(c.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </td>
              <td>
                <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: var(--gold-light); font-weight: 600;">
                  ${c.phone}
                </a>
              </td>
              <td>
                <strong style="color: var(--gold-light); font-size: 0.88rem;">${c.subject}</strong>
              </td>
              <td style="max-width: 280px; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.4;">
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">📊 Tableau de Bord Analytique & Tracking des Clics CTA</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Suivi en temps réel des interactions sur vos boutons d'action (CTA) et réseaux sociaux.</p>
      </div>
      <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.handleResetAnalytics()">
        🔄 Réinitialiser les Compteurs
      </button>
    </div>

    <!-- Grille des Métriques Détaillées -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
      <div class="luxury-card" style="padding: 20px; background: rgba(30, 41, 59, 0.4); border-color: rgba(96, 165, 250, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #93C5FD; font-weight: 700;">Appels Directs GSM</span>
          <span style="font-size: 1.3rem;">📞</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 700; color: #FFF;">${gsm}</div>
        <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 4px;">Clics sur le numéro portable classique</div>
      </div>

      <div class="luxury-card" style="padding: 20px; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #34D399; font-weight: 700;">WhatsApp Business</span>
          <span style="font-size: 1.3rem;">💬</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 700; color: #FFF;">${wa}</div>
        <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 4px;">Commandes & prises de contact</div>
      </div>

      <div class="luxury-card" style="padding: 20px; background: rgba(225, 48, 108, 0.1); border-color: rgba(225, 48, 108, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #F472B6; font-weight: 700;">Visites Instagram</span>
          <span style="font-size: 1.3rem;">📷</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 700; color: #FFF;">${ig}</div>
        <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 4px;">Redirections vers @mallofbeauty_mofb</div>
      </div>

      <div class="luxury-card" style="padding: 20px; background: rgba(37, 244, 238, 0.08); border-color: rgba(37, 244, 238, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #38BDF8; font-weight: 700;">Vidéos TikTok</span>
          <span style="font-size: 1.3rem;">🎵</span>
        </div>
        <div style="font-size: 2rem; font-family: var(--font-serif); font-weight: 700; color: #FFF;">${tt}</div>
        <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 4px;">Redirections vers @mallofbeauty1</div>
      </div>
    </div>

    <!-- Récapitulatif des Conversions Formulaires -->
    <div class="luxury-card" style="padding: 24px; background: rgba(14, 14, 18, 0.95); margin-bottom: 24px;">
      <h5 style="color: var(--gold-light); font-size: 1rem; margin-bottom: 16px;">Engagement & Soumissions de Formulaires</h5>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
        <div style="padding: 16px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
          <div style="font-size: 1.6rem; font-weight: 700; color: #FBBF24;">${booking}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">RDV Conseils Validés</div>
        </div>
        <div style="padding: 16px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
          <div style="font-size: 1.6rem; font-weight: 700; color: #60A5FA;">${shopper}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Demandes Personal Shopper</div>
        </div>
        <div style="padding: 16px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
          <div style="font-size: 1.6rem; font-weight: 700; color: #E879F9;">${loyalty}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Adhésions Carte Privilège</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.8rem; color: var(--text-dim); display: flex; justify-content: space-between;">
        <span>Dernier événement : <strong>${analytics.lastEvent || 'Aucun'}</strong></span>
        <span>Dernière mise à jour : <strong>${new Date(analytics.updatedAt || Date.now()).toLocaleTimeString('fr-FR')}</strong></span>
      </div>
    </div>
  `;
}

function renderSettingsTab(settings) {
  return `
    <div class="admin-tab-header">
      <div>
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">⚙️ Paramètres Généraux de l'Établissement (CRUD)</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Modifiez vos coordonnées, bannières et horaires en temps réel.</p>
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

        <!-- Section Spéciale Wave Côte d'Ivoire & QR Code -->
        <div style="background: rgba(29, 195, 244, 0.08); border: 1.5px solid rgba(29, 195, 244, 0.35); border-radius: var(--radius-md); padding: 20px; margin: 24px 0;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="#1DC3F4"/>
              <path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM14.2 21.5L9.5 16.8L11.2 15.1L14.2 18.1L20.8 11.5L22.5 13.2L14.2 21.5Z" fill="white"/>
            </svg>
            <h4 style="font-size: 1.05rem; color: #38BDF8; margin: 0; font-weight: 700;">Configuration Paiement Wave Côte d'Ivoire & QR Code</h4>
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
                <input type="text" id="set-wave-qrcode" class="form-input" value="${settings.contacts.waveQrCode || '/imgs/wave_qr_code.svg'}" placeholder="/imgs/wave_qr_code.svg ou URL">
              </div>

              <div class="form-group" style="margin-top: 10px;">
                <label class="form-label" style="font-size: 0.8rem; color: #94A3B8;">Ou importer un nouveau QR Code (fichier image) :</label>
                <input type="file" id="set-wave-qrcode-file" accept="image/*" class="form-input" style="padding: 6px;" onchange="window.MoB.handleWaveQrUpload(event)">
              </div>
            </div>

            <!-- Aperçu QR Code en direct -->
            <div style="text-align: center; background: #0B1320; border: 1px solid rgba(29, 195, 244, 0.4); border-radius: 12px; padding: 12px; width: 140px;">
              <span style="font-size: 0.72rem; color: #7DD3FC; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">Aperçu QR Code</span>
              <img src="${settings.contacts.waveQrCode || '/imgs/wave_qr_code.svg'}" id="wave-qrcode-admin-preview" alt="Aperçu QR Code Wave" style="width: 110px; height: 110px; object-fit: contain; border-radius: 8px; background: #FFF; padding: 4px;">
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
        <h4 style="font-size: 1.15rem; color: #FFF; margin: 0;">💾 Sauvegarde & Restauration des Données</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Exportez votre base de données ou réinitialisez les données factices d'origine.</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div class="luxury-card" style="padding: 24px;">
        <h4 style="color: var(--gold-light); margin-bottom: 8px;">🔄 Recharger Données Factices</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Réinjecte instantanément toutes les réservations, demandes VIP, cartes privilège et messages clients d'Abidjan pour tester les formulaires.</p>
        <button class="btn btn-gold btn-sm" onclick="window.MoB.reloadAllDummyData()">Recharger les Données Factices</button>
      </div>

      <div class="luxury-card" style="padding: 24px;">
        <h4 style="color: var(--gold-light); margin-bottom: 8px;">Exporter les Données</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Téléchargez une sauvegarde JSON complète contenant vos produits, rendez-vous et réglages.</p>
        <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.exportDatabase()">Télécharger le fichier JSON</button>
      </div>

      <div class="luxury-card" style="padding: 24px; border-color: rgba(225, 29, 72, 0.4); grid-column: 1 / -1;">
        <h4 style="color: #FB7185; margin-bottom: 8px;">Réinitialisation Totale d'Usine</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Efface le stockage local et réinitialise l'application complète aux paramètres d'origine.</p>
        <button class="btn btn-danger btn-sm" onclick="window.MoB.confirmResetFactory()">Restaurer les données initiales</button>
      </div>
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

export function switchAdminTabLive(tab) {
  currentTab = tab;

  // 1. Mettre à jour l'état actif sur les 8 stat cards
  const cards = document.querySelectorAll(".admin-stat-card");
  cards.forEach(card => {
    if (card.dataset.tab === tab) {
      card.classList.add("active-stat");
    } else {
      card.classList.remove("active-stat");
    }
  });

  // 2. Mettre à jour UNIQUEMENT le conteneur en dessous de admin-stats-row
  const container = document.getElementById("admin-tab-container");
  if (container) {
    container.className = `admin-active-tab-box theme-${tab}`;
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

  const featuredCount = products.filter(p => p.isFeatured).length;
  const pendingAppointments = appointments.filter(a => a.status === "En attente").length;
  const pendingPS = psRequests.filter(r => r.status && r.status.includes("attente")).length;
  const unreadContacts = contacts.filter(c => c.status === "Non lu").length;

  const cardProducts = document.querySelector('.admin-stat-card[data-tab="products"] .admin-stat-num');
  if (cardProducts) cardProducts.textContent = products.length;

  const cardFeatured = document.querySelector('.admin-stat-card[data-tab="featured"] .admin-stat-num');
  if (cardFeatured) cardFeatured.textContent = featuredCount;

  const cardAppointments = document.querySelector('.admin-stat-card[data-tab="appointments"] .admin-stat-num');
  if (cardAppointments) cardAppointments.textContent = appointments.length;

  const cardPS = document.querySelector('.admin-stat-card[data-tab="personal-shopper"] .admin-stat-num');
  if (cardPS) cardPS.textContent = psRequests.length;

  const cardLoyalty = document.querySelector('.admin-stat-card[data-tab="loyalty"] .admin-stat-num');
  if (cardLoyalty) cardLoyalty.textContent = loyaltyMembers.length;

  const cardContacts = document.querySelector('.admin-stat-card[data-tab="contacts"] .admin-stat-num');
  if (cardContacts) cardContacts.textContent = contacts.length;

  const cardAnalytics = document.querySelector('.admin-stat-card[data-tab="analytics"] .admin-stat-num');
  if (cardAnalytics) cardAnalytics.textContent = analytics.total || 0;

  const container = document.getElementById("admin-tab-container");
  if (container) {
    container.className = `admin-active-tab-box theme-${currentTab}`;
    container.innerHTML = renderAdminTabContent(currentTab);
  }
}

