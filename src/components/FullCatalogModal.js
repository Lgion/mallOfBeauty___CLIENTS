import { searchFullCatalog, getStoreSettings } from "../data/storage.js";

export function renderFullCatalogModal({
  query = "",
  category = "all",
  brand = "all"
} = {}) {
  const result = searchFullCatalog({ query, category, brand, perPage: 0 });
  const settings = getStoreSettings();

  const categories = [
    { id: "all", label: "Tous les Rayons (1 136)", icon: "🌟" },
    { id: "Dermocosmétique & Soins", label: "Dermocosmétique", icon: "🧴" },
    { id: "Pagnes Vlisco & Textiles", label: "Pagnes Vlisco", icon: "👑" },
    { id: "Maman & Bébé", label: "Maman & Bébé", icon: "👶" },
    { id: "Soins Homme", label: "Soins Homme", icon: "👔" },
    { id: "Capillaire & Perruques", label: "Capillaire & HD", icon: "✨" },
    { id: "Maquillage & Teint", label: "Maquillage", icon: "💄" },
    { id: "Accessoires & Maroquinerie", label: "Maroquinerie", icon: "👜" }
  ];

  // Helper icon for category
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Pagnes Vlisco & Textiles": return "👑";
      case "Maman & Bébé": return "👶";
      case "Soins Homme": return "👔";
      case "Capillaire & Perruques": return "✨";
      case "Maquillage & Teint": return "💄";
      case "Accessoires & Maroquinerie": return "👜";
      default: return "🧴";
    }
  };

  const getCategoryClass = (cat) => {
    switch (cat) {
      case "Pagnes Vlisco & Textiles": return "vis-vlisco";
      case "Maman & Bébé": return "vis-bebe";
      case "Soins Homme": return "vis-homme";
      case "Capillaire & Perruques": return "vis-capillaire";
      case "Maquillage & Teint": return "vis-makeup";
      case "Accessoires & Maroquinerie": return "vis-accessoires";
      default: return "vis-dermo";
    }
  };

  return `
    <div class="modal-backdrop active full-catalog-backdrop" id="full-catalog-backdrop">
      <div class="modal-dialog full-catalog-dialog">
        
        <!-- En-tête de Luxe Bleu Nuit avec Motif de Tissage Géométrique -->
        <div class="full-catalog-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
              <span class="fc-badge fc-badge-count">
                ✨ 1 136 Articles Disponibles
              </span>
              <span class="fc-badge fc-badge-auth">
                🟢 100% Authentiques & Certifiés
              </span>
              <span class="fc-badge fc-badge-loc">
                📍 Les Vallons (Rue des Jardins)
              </span>
            </div>
            <h2 class="full-catalog-title">
              Grand Catalogue Mall of Beauty
            </h2>
          </div>
          <button class="full-catalog-close-btn" id="close-full-catalog-btn" aria-label="Fermer le grand catalogue">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Barre d'outils: Recherche & Filtres -->
        <div class="full-catalog-toolbar">
          <!-- Barre de Recherche & Sélecteur -->
          <div class="fc-toolbar-controls">
            <div class="search-input-wrap fc-search-wrap">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" id="fc-search-input" class="search-input" placeholder="Rechercher un produit, une marque (ex: Makari, Super Wax, Medicube, Cetaphil...)" value="${query}">
            </div>

            <div class="fc-select-row">
              <select id="fc-category-select" class="form-select fc-category-select">
                ${categories.map(c => `
                  <option value="${c.id}" ${category === c.id ? "selected" : ""}>${c.icon} ${c.label}</option>
                `).join("")}
              </select>

              <button class="btn btn-sm fc-reset-btn" id="fc-reset-filters-btn" title="Réinitialiser filtres">
                🔄 Réinitialiser
              </button>
            </div>
          </div>

          <!-- Pastilles de Catégories Interactives Solides (Défilement Tactile) -->
          <div class="fc-pills-scroll-track">
            ${categories.map(c => `
              <button class="fc-category-pill ${category === c.id ? 'active' : ''}" data-category="${c.id}">
                <span>${c.icon}</span>
                <span>${c.label}</span>
              </button>
            `).join("")}
          </div>

          <!-- Total trouvé info -->
          <div class="fc-meta-info-bar">
            <div>
              Catalogue : <strong style="color: #0F172A; font-size: 0.92rem;">${result.total}</strong> articles trouvés
            </div>
            <div style="font-size: 0.8rem; color: #64748B;">
              ✨ Défilement continu • Tous les articles
            </div>
          </div>
        </div>

        <!-- Corps de Grille avec Motif Micro-Points Géométriques -->
        <div class="full-catalog-body">
          ${result.items.length === 0 ? `
            <div style="text-align: center; padding: 60px 20px;">
              <div style="font-size: 3.5rem; margin-bottom: 14px;">🔍</div>
              <h3 style="color: #0F172A; margin-bottom: 8px; font-size: 1.3rem; font-weight: 700;">Aucun article trouvé pour cette recherche</h3>
              <p style="color: #64748B; font-size: 0.95rem;">Essayez un autre mot-clé ou cliquez sur « 🌟 Tous les Rayons » pour explorer le catalogue.</p>
            </div>
          ` : `
            <div class="full-catalog-grid">
              ${result.items.map(item => `
                <div class="full-catalog-card">
                  <!-- Bloc Visuel Pastel Solide par Rayon ou Photo Réelle -->
                  ${item.image ? `
                    <div class="full-catalog-visual has-image" title="Aperçu ${item.name}">
                      <img src="${item.image}" alt="${item.name}" class="full-catalog-thumb-img" loading="lazy">
                      <span class="full-catalog-img-badge">${item.brand}</span>
                    </div>
                  ` : `
                    <div class="full-catalog-visual ${getCategoryClass(item.category)}">
                      <div class="full-catalog-visual-icon">
                        <span style="font-size: 1.5rem;">${getCategoryIcon(item.category)}</span>
                      </div>
                      <span style="font-size: 0.72rem; font-weight: 800; letter-spacing: 0.04em;">${item.category}</span>
                      <span style="font-size: 0.65rem; color: #64748B; margin-top: 3px; font-weight: 600;">Original Certifié</span>
                    </div>
                  `}

                  <!-- Infos & Actions -->
                  <div class="full-catalog-info">
                    <div>
                      <div class="full-catalog-brand">${item.brand}</div>
                      <h4 class="full-catalog-name">${item.name}</h4>
                      <p class="full-catalog-desc">${item.description}</p>
                    </div>

                    <div class="full-catalog-footer">
                      <div class="fc-price-wrap">
                        <div style="font-size: 0.70rem; color: #64748B; text-transform: uppercase; font-weight: 700;">Tarif 2026 (FCFA)</div>
                        <div class="full-catalog-price">${item.priceFormatted}</div>
                      </div>

                      <div class="fc-actions-wrap">
                        <button class="btn btn-sm fc-add-cart-btn" data-product-id="${item.id}" data-product-name="${encodeURIComponent(item.name + ' - ' + item.brand)}" data-product-price="${item.price}" title="Ajouter au panier">
                          <span>+ Panier</span>
                        </button>
                        <a href="https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour Mall of Beauty, je souhaite commander l'article : ${item.name} (${item.brand}) au prix de ${item.priceFormatted}.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm fc-whatsapp-order-btn" data-track="whatsapp" title="Commander directement sur WhatsApp">
                          <span>Commander</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}
