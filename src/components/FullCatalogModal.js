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

export function renderSubcategoriesRow(category = "all", activeSubcategory = "all") {
  const allCatalog = getFullCatalog();
  const counts = {};
  allCatalog.forEach(item => {
    const cat = (item.category || "").trim();
    if (cat) counts[cat] = (counts[cat] || 0) + 1;
  });

  if (category === "all" || !counts[category] || counts[category] <= 50) {
    return "";
  }

  const subCounts = {};
  allCatalog
    .filter(item => item.category === category)
    .forEach(item => {
      if (item.subcategory) {
        subCounts[item.subcategory] = (subCounts[item.subcategory] || 0) + 1;
      }
    });

  const subcategories = Object.entries(subCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([subName, count]) => ({
      id: subName,
      label: subName,
      count,
      icon: SUB_ICONS[subName] || "✨"
    }));

  if (subcategories.length === 0) return "";

  return `
    <div class="fc-subcategories-section">
      <div class="fc-subpills-scroll-track" role="tablist" aria-label="Sous-rayons">
        <button type="button" class="fc-subpill ${activeSubcategory === 'all' ? 'active' : ''}" data-subcategory="all" title="Tous les articles de ${category}">
          <span>🌟</span>
          <span>Tout ${category.split('&')[0].trim()}</span>
          <span class="fc-subpill-count">(${counts[category]})</span>
        </button>
        ${subcategories.map(s => `
          <button type="button" class="fc-subpill ${activeSubcategory === s.id ? 'active' : ''}" data-subcategory="${s.id}" title="${s.label} (${s.count} articles)">
            <span>${s.icon}</span>
            <span>${s.label}</span>
            <span class="fc-subpill-count">(${s.count})</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

export function renderFullCatalogCard(item, settings) {
  const visualClass = getCategoryClass(item.category);
  const icon = getCategoryIcon(item.category);
  const whatsappNum = (settings.contacts?.whatsapp || '2250777027235').replace(/[^0-9]/g, '');

  return `
    <div class="full-catalog-card" data-card-id="${item.id}" onclick="window.MoB.openProductModal('${item.id}')" title="Cliquer pour afficher les détails de ${item.name}">
      <!-- Bloc Visuel Pastel Solide par Rayon ou Photo Réelle -->
      ${item.image ? `
        <div class="full-catalog-visual has-image" title="Aperçu : ${item.name}">
          <img src="${item.image}" alt="${item.name}" class="full-catalog-thumb-img" loading="lazy">
          <span class="full-catalog-img-badge">${item.brand}</span>
        </div>
      ` : `
        <div class="full-catalog-visual ${visualClass}" title="Aperçu : ${item.name}">
          <div class="full-catalog-visual-icon">
            <span style="font-size: 1.5rem;">${icon}</span>
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
          <p class="full-catalog-desc">${item.description || "Article certifié authentique disponible en boutique Mall of Beauty aux Vallons Cocody."}</p>
        </div>

        <div class="full-catalog-footer">
          <div class="fc-price-wrap">
            <div style="font-size: 0.70rem; color: #64748B; text-transform: uppercase; font-weight: 700;">Tarif 2026 (FCFA)</div>
            <div class="full-catalog-price">${item.priceFormatted}</div>
          </div>

          <div class="fc-actions-wrap" onclick="event.stopPropagation()">
            <button type="button" class="btn btn-sm fc-add-cart-btn" data-product-id="${item.id}" data-product-name="${encodeURIComponent(item.name + ' - ' + item.brand)}" data-product-price="${item.price}" title="Ajouter au panier">
              <span>+ Panier</span>
            </button>
            <a href="https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Bonjour Mall of Beauty, je souhaite commander l'article : ${item.name} (${item.brand}) au prix de ${item.priceFormatted}.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm fc-whatsapp-order-btn" data-track="whatsapp" title="Commander directement sur WhatsApp">
              <span>Commander</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderFullCatalogBody({
  query = "",
  category = "all",
  subcategory = "all",
  brand = "all",
  limit = 48
} = {}) {
  const result = searchFullCatalog({ query, category, subcategory, brand, perPage: 0 });
  const settings = getStoreSettings();
  const allCatalog = getFullCatalog();

  if (result.items.length === 0) {
    return `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 3.5rem; margin-bottom: 14px;">🔍</div>
        <h3 style="color: #0F172A; margin-bottom: 8px; font-size: 1.3rem; font-weight: 700;">Aucun article trouvé pour cette recherche</h3>
        <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 20px;">Essayez un autre mot-clé ou réinitialisez votre recherche pour explorer les ${allCatalog.length.toLocaleString("fr-FR")} références.</p>
        <button type="button" class="btn btn-outline" id="fc-reset-filters-btn" style="display: inline-flex; align-items: center; gap: 8px; margin: 0 auto; padding: 10px 20px; font-weight: 700;">
          <span>🔄</span>
          <span>Afficher tous les articles</span>
        </button>
      </div>
    `;
  }

  const itemsToShow = result.items.slice(0, limit);
  const remaining = result.total - itemsToShow.length;

  return `
    <div class="full-catalog-grid" id="full-catalog-grid">
      ${itemsToShow.map(item => renderFullCatalogCard(item, settings)).join("")}
    </div>

    ${remaining > 0 ? `
      <div class="fc-load-more-wrap">
        <button type="button" class="fc-load-more-btn" id="fc-load-more-btn" data-next-limit="${limit + 48}">
          <span>Afficher plus de produits (+${Math.min(48, remaining)})</span>
          <span style="opacity: 0.75; font-size: 0.85rem; margin-left: 6px;">(${remaining} restants sur ${result.total.toLocaleString("fr-FR")})</span>
        </button>
      </div>
    ` : ''}
  `;
}

export function renderFullCatalogModal({
  query = "",
  category = "all",
  subcategory = "all",
  brand = "all",
  limit = 48
} = {}) {
  const allCatalog = getFullCatalog();
  const result = searchFullCatalog({ query, category, subcategory, brand, perPage: 0 });

  // Dynamic counts for all categories
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

  return `
    <div class="modal-backdrop active full-catalog-backdrop" id="full-catalog-backdrop">
      <div class="modal-dialog full-catalog-dialog">
        
        <!-- En-tête de Luxe Bleu Nuit avec Motif Géométrique -->
        <div class="full-catalog-header">
          <div class="fc-header-main">
            <h2 class="full-catalog-title">
              Grand Catalogue
            </h2>
            <span class="fc-header-count-pill" id="fc-header-count-pill">${allCatalog.length.toLocaleString("fr-FR")} articles</span>
          </div>

          <div class="fc-header-desktop-badges">
            <span class="fc-badge fc-badge-auth">
              🟢 100% Authentiques & Certifiés
            </span>
            <span class="fc-badge fc-badge-loc">
              📍 Les Vallons (Rue des Jardins)
            </span>
          </div>

          <button class="full-catalog-close-btn" id="close-full-catalog-btn" aria-label="Fermer le grand catalogue">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Barre d'outils: Recherche & Filtres Ultra-UX -->
        <div class="full-catalog-toolbar">
          
          <!-- Ligne 1: Pastilles de Catégories Principales (Défilement Tactile Fluide) -->
          <div class="fc-pills-scroll-track" role="tablist" aria-label="Rayons du catalogue">
            ${categories.map(c => `
              <button type="button" class="fc-category-pill ${category === c.id ? 'active' : ''}" data-category="${c.id}" title="${c.label} (${c.count.toLocaleString("fr-FR")} articles)">
                <span class="fc-pill-icon">${c.icon}</span>
                <span class="fc-pill-label">${c.label}</span>
                <span class="fc-pill-count">(${c.count.toLocaleString("fr-FR")})</span>
              </button>
            `).join("")}
          </div>

          <!-- Ligne 2: Sous-Rayons Spécialisés -->
          <div id="fc-subcategories-container">
            ${renderSubcategoriesRow(category, subcategory)}
          </div>

          <!-- Ligne 3: Recherche & Compteur de résultats instantanés -->
          <div class="fc-search-meta-row" style="display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div class="search-input-wrap fc-search-wrap" style="flex: 1; min-width: 260px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" id="fc-search-input" class="search-input" placeholder="Rechercher marque, crème, sérum, perruque, savon... (ex: Makari, Cetaphil, Vlisco)" value="${query}" autocomplete="off" spellcheck="false">
              <button type="button" id="fc-clear-search-btn" class="fc-clear-search-btn" title="Effacer la recherche" style="${query ? 'display:flex;' : 'display:none;'}">✕</button>
            </div>
            
            <div class="fc-live-count-badge" style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #475569; background: #F8FAFC; border: 1.5px solid #E2E8F0; padding: 8px 14px; border-radius: 9999px;">
              <span>⚡</span>
              <strong id="fc-results-count" style="color: #0F172A;">${result.total.toLocaleString("fr-FR")} articles</strong>
            </div>
          </div>
        </div>

        <!-- Corps de Grille Dynamique -->
        <div class="full-catalog-body" id="full-catalog-body">
          ${renderFullCatalogBody({ query, category, subcategory, brand, limit })}
        </div>

      </div>
    </div>
  `;
}
