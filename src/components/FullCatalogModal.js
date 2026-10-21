import { getFullCatalog, searchFullCatalog, getStoreSettings } from "../data/storage.js";

const SUB_ICONS = {
  // Dermocosmétique & Soins
  "Crèmes & Soins Visage": "💆‍♀️",
  "Savons & Pains Purifiants": "🧼",
  "Traitements & Tubes Ciblés": "🎯",
  "Sérums & Boosters": "✨",
  "Laits & Soins Corps": "🧴",
  "Gommages & Exfoliants": "🧽",
  "Gels Douche & Nettoyants": "🚿",
  "Huiles, Baumes & Corps": "🌿",
  "Compléments & Gummies": "🍬",
  "Lotions & Toniques": "💧",
  // Capillaire & Perruques
  "Perruques & Mèches": "👑",
  "Pommades, Gels & Coiffants": "💇‍♀️",
  "Défrisants & Lissage": "⚡",
  "Appareils & Accessoires": "🔌",
  "Shampoings & Masques": "🧴",
  "Soins & Huiles Repousse": "🌱",
  // Maquillage & Teint
  "Teint, FDT & Poudres": "🎨",
  "Démaquillants & Eaux Micellaires": "🧴",
  "Yeux, Cils & Sourcils": "👁️",
  "Bases & Fixateurs": "✨",
  "Teintures & Colorations": "💈",
  "Lèvres & Gloss": "💄",
  "Accessoires Maquillage": "🖌️"
};

export function renderFullCatalogModal({
  query = "",
  category = "all",
  subcategory = "all",
  brand = "all"
} = {}) {
  const result = searchFullCatalog({ query, category, subcategory, brand, perPage: 0 });
  const settings = getStoreSettings();
  const allCatalog = getFullCatalog();

  // Dynamic counts for all categories directly from the full catalog
  const counts = { all: allCatalog.length };
  allCatalog.forEach(item => {
    const cat = (item.category || "").trim();
    if (cat) {
      counts[cat] = (counts[cat] || 0) + 1;
    }
  });

  const categories = [
    { id: "all", label: "Tous les Rayons", count: allCatalog.length, icon: "🌟" },
    { id: "Dermocosmétique & Soins", label: "Dermocosmétique", count: counts["Dermocosmétique & Soins"] || 0, icon: "🧴" },
    { id: "Capillaire & Perruques", label: "Capillaire & HD", count: counts["Capillaire & Perruques"] || 0, icon: "✨" },
    { id: "Maquillage & Teint", label: "Maquillage", count: counts["Maquillage & Teint"] || 0, icon: "💄" },
    { id: "Maman & Bébé", label: "Maman & Bébé", count: counts["Maman & Bébé"] || 0, icon: "👶" },
    { id: "Accessoires & Maroquinerie", label: "Maroquinerie", count: counts["Accessoires & Maroquinerie"] || 0, icon: "👜" },
    { id: "Pagnes Vlisco & Textiles", label: "Pagnes Vlisco", count: counts["Pagnes Vlisco & Textiles"] || 0, icon: "👑" },
    { id: "Soins Homme", label: "Soins Homme", count: counts["Soins Homme"] || 0, icon: "👔" },
    { id: "Parfumerie & Fragrances", label: "Parfumerie", count: counts["Parfumerie & Fragrances"] || 0, icon: "🌸" }
  ];

  // Dynamically compute subcategories for the active category if it has > 50 products
  let subcategories = [];
  if (category !== "all" && counts[category] > 50) {
    const subCounts = {};
    allCatalog
      .filter(item => item.category === category)
      .forEach(item => {
        if (item.subcategory) {
          subCounts[item.subcategory] = (subCounts[item.subcategory] || 0) + 1;
        }
      });

    subcategories = Object.entries(subCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([subName, count]) => ({
        id: subName,
        label: subName,
        count,
        icon: SUB_ICONS[subName] || "✨"
      }));
  }

  // Helper icon for category
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Pagnes Vlisco & Textiles": return "👑";
      case "Maman & Bébé": return "👶";
      case "Soins Homme": return "👔";
      case "Capillaire & Perruques": return "✨";
      case "Maquillage & Teint": return "💄";
      case "Accessoires & Maroquinerie": return "👜";
      case "Parfumerie & Fragrances": return "🌸";
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
      case "Parfumerie & Fragrances": return "vis-parfum";
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
                ✨ ${allCatalog.length.toLocaleString("fr-FR")} Articles Disponibles
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
              ${query ? `
                <button type="button" id="fc-clear-search-btn" class="fc-clear-search-btn" title="Effacer la recherche">✕</button>
              ` : ''}
            </div>

            <div class="fc-select-row">
              <select id="fc-category-select" class="form-select fc-category-select">
                ${categories.map(c => `
                  <option value="${c.id}" ${category === c.id ? "selected" : ""}>
                    ${c.icon} ${c.label} (${c.count.toLocaleString("fr-FR")})
                  </option>
                `).join("")}
              </select>

              <button class="btn btn-sm fc-reset-btn" id="fc-reset-filters-btn" title="Réinitialiser filtres">
                🔄 Réinitialiser
              </button>
            </div>
          </div>

          <!-- Pastilles de Catégories Principales (Défilement Tactile) -->
          <div class="fc-pills-scroll-track">
            ${categories.map(c => `
              <button class="fc-category-pill ${category === c.id ? 'active' : ''}" data-category="${c.id}" title="${c.label} (${c.count.toLocaleString("fr-FR")} articles)">
                <span>${c.icon}</span>
                <span>${c.label}</span>
                <span class="fc-pill-count">(${c.count.toLocaleString("fr-FR")})</span>
              </button>
            `).join("")}
          </div>

          <!-- Rangée de Sous-Catégories Spécialisées (uniquement si le rayon contient > 50 produits) -->
          ${subcategories.length > 0 ? `
            <div class="fc-subcategories-section">
              <div class="fc-subpills-scroll-track">
                <button class="fc-subpill ${subcategory === 'all' ? 'active' : ''}" data-subcategory="all" title="Tous les articles de ${category}">
                  <span>🌟</span>
                  <span>Tout ${category.split('&')[0].trim()}</span>
                  <span class="fc-subpill-count">(${counts[category]})</span>
                </button>
                ${subcategories.map(s => `
                  <button class="fc-subpill ${subcategory === s.id ? 'active' : ''}" data-subcategory="${s.id}" title="${s.label} (${s.count} articles)">
                    <span>${s.icon}</span>
                    <span>${s.label}</span>
                    <span class="fc-subpill-count">(${s.count})</span>
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <!-- Total trouvé info -->
          <div class="fc-meta-info-bar">
            <div>
              Catalogue : <strong style="color: #0F172A; font-size: 0.92rem;">${result.total.toLocaleString("fr-FR")}</strong> articles trouvés
              ${query ? ` pour <span style="color: #0284C7; font-weight: 700;">« ${query} »</span>` : ''}
              ${category !== "all" ? ` dans <span style="color: #065F46; font-weight: 700;">${category}</span>` : ''}
              ${subcategory !== "all" ? ` &gt; <span style="color: #0284C7; font-weight: 700;">${subcategory}</span>` : ''}
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
              <h3 style="color: #0F172A; margin-bottom: 8px; font-size: 1.3rem; font-weight: 700;">Aucun article trouvé pour cette sélection</h3>
              <p style="color: #64748B; font-size: 0.95rem;">Essayez un autre mot-clé ou cliquez sur « 🌟 Tous les Rayons » pour afficher les ${allCatalog.length.toLocaleString("fr-FR")} articles.</p>
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
                      <div class="fc-card-top-row">
                        <div class="full-catalog-brand">${item.brand}</div>
                        <span class="fc-card-cat-badge">${item.subcategory || item.category}</span>
                      </div>
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
