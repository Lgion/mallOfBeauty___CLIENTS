import { getProducts } from "../data/storage.js";

export function formatPriceFCFA(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

export const CATALOG_CATEGORIES = [
  { id: "all", label: "Toutes les Pépites", img: "./imgs/categories/CATALOGUE.jpeg" },
  { id: "usa", label: "🇺🇸 70% Origine USA", img: "./imgs/categories/SOINS_VISAGE_SÉRUMS_EXPERTISE.jpeg" },
  { id: "soins-visage", label: "Visage & K-Beauty", img: "./imgs/categories/SOINS_VISAGE_SÉRUMS_EXPERTISE.jpeg" },
  { id: "soins-corps", label: "Soins Corps & Laits", img: "./imgs/categories/SOINS_CORPS_LAITS_LUXE.jpeg" },
  { id: "soins-cheveux", label: "Capillaire & Défrisants", img: "./imgs/categories/SOINS_CAPILLAIRES_DÉFRISANTS.jpeg" }
];

export function filterProducts(filteredCategory = "all", searchQuery = "") {
  let products = getProducts();

  // Filtrer pour n'afficher que les produits phares sur la page d'accueil
  products = products.filter(p => p.isFeatured === true);

  // Filtrage par catégorie
  if (filteredCategory && filteredCategory !== "all") {
    products = products.filter(p => {
      if (filteredCategory === "usa") {
        const usaBrands = ["cerave", "the ordinary", "paula", "cetaphil", "neutrogena", "shea moisture", "johnson", "palmer", "ogx", "cantu", "aveeno", "dove", "eucerin"];
        const b = (p.brand || "").toLowerCase();
        const n = (p.name || "").toLowerCase();
        const o = (p.origin || "").toLowerCase();
        return o.includes("usa") || o.includes("états-unis") || usaBrands.some(brand => b.includes(brand) || n.includes(brand));
      }
      if (p.category === filteredCategory) return true;
      // Compatibilité tolérante par mots-clés
      const name = (p.name + " " + (p.categoryLabel || "")).toLowerCase();
      if (filteredCategory === "soins-visage" && (name.includes("visage") || name.includes("serum") || name.includes("sérum") || name.includes("contour") || name.includes("yeux") || name.includes("solaire") || name.includes("sun") || name.includes("tonique") || name.includes("acne") || name.includes("demaquillant"))) {
        return true;
      }
      if (filteredCategory === "soins-cheveux" && (name.includes("cheveux") || name.includes("shamp") || name.includes("masque") || name.includes("defris") || name.includes("relax") || name.includes("curl") || name.includes("hair") || name.includes("pousse") || name.includes("capillaire"))) {
        return true;
      }
      if (filteredCategory === "soins-corps" && (name.includes("lait") || name.includes("corps") || name.includes("savon") || name.includes("douche") || name.includes("baume") || name.includes("gommage"))) {
        return true;
      }
      return false;
    });
  }

  // Filtrage par recherche
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return products;
}

export function renderProductsGridContent(products, currentPage = 1, perPage = 9, viewMode = "classic") {
  if (products.length === 0) {
    return `
      <div style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3 style="margin-bottom: 8px;">Aucun produit trouvé</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Aucun article ne correspond à votre recherche ou filtre actuel.</p>
        <button class="btn btn-outline-gold btn-sm" id="reset-catalog-filters">Réinitialiser les filtres</button>
      </div>
    `;
  }

  const totalPages = Math.ceil(products.length / perPage);
  const validPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validPage - 1) * perPage;

  // Découpage de tous les produits en pages pour permettre le défilement tactile fluide
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    pages.push(products.slice(i * perPage, (i + 1) * perPage));
  }

  return `
    <div class="catalog-scroll-wrapper">
      <!-- Flèches de navigation au niveau de la deuxième ligne (Gauche & Droite) avec numéro de page -->
      ${totalPages > 1 ? `
        <!-- Flèche Gauche + Numéro de Page Actuel -->
        <div class="catalog-flank-nav flank-left ${validPage <= 1 ? 'disabled' : ''}" id="catalog-flank-nav-left">
          <button type="button" 
                  class="catalog-flank-arrow-btn" 
                  id="flank-prev-arrow-btn"
                  onclick="window.MoB.scrollCatalogStep(-1)" 
                  ${validPage <= 1 ? 'disabled' : ''} 
                  title="Page précédente" 
                  aria-label="Page précédente">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div class="catalog-flank-page-pill" id="flank-page-indicator-left">
            <span>Page <strong class="flank-page-active">${validPage}</strong>/<span class="flank-page-total">${totalPages}</span></span>
          </div>
        </div>

        <!-- Flèche Droite + Numéro de Page Actuel -->
        <div class="catalog-flank-nav flank-right ${validPage >= totalPages ? 'disabled' : ''}" id="catalog-flank-nav-right">
          <div class="catalog-flank-page-pill" id="flank-page-indicator-right">
            <span>Page <strong class="flank-page-active">${validPage}</strong>/<span class="flank-page-total">${totalPages}</span></span>
          </div>
          <button type="button" 
                  class="catalog-flank-arrow-btn" 
                  id="flank-next-arrow-btn"
                  onclick="window.MoB.scrollCatalogStep(1)" 
                  ${validPage >= totalPages ? 'disabled' : ''} 
                  title="Page suivante" 
                  aria-label="Page suivante">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      ` : ''}

      <!-- Piste de Défilement Horizontal (Scroll-Snap & Touch) -->
      <div class="catalog-scroll-track" id="catalog-scroll-track" onscroll="window.MoB.handleCatalogScroll(this)">
        ${pages.map((pageItems, pageIdx) => `
          <div class="catalog-page-slide" data-page="${pageIdx + 1}" id="catalog-slide-${pageIdx + 1}">
            ${viewMode === "compact" ? `
              <!-- NOUVEL AFFICHAGE COMPACT (MINI-BLOCS ~100px) -->
              <div class="products-grid-compact">
                ${pageItems.map(p => {
                  const usaBrands = ["cerave", "the ordinary", "paula", "cetaphil", "neutrogena", "shea moisture", "johnson", "palmer", "ogx", "cantu", "aveeno", "dove", "eucerin"];
                  const isUsa = (p.origin && p.origin.toLowerCase().includes("usa")) ||
                    usaBrands.some(b => (p.brand || "").toLowerCase().includes(b) || (p.name || "").toLowerCase().includes(b));

                  return `
                    <div class="product-card-compact" data-product-id="${p.id}">
                      <!-- Vignette Carrée ~100px sur 100px -->
                      <div class="compact-thumb-wrap" onclick="window.MoB.openProductModal('${p.id}')" title="${p.name}">
                        ${isUsa ? `<span class="compact-usa-pill">🇺🇸</span>` : ''}
                        <span class="compact-stock-indicator ${p.stock && p.stock > 0 ? 'in-stock' : 'available'}" title="${p.stock && p.stock > 0 ? 'En stock' : 'Disponible boutique'}"></span>
                        <img src="${p.image}" alt="${p.name}" class="compact-thumb-img" loading="lazy">
                      </div>

                      <!-- Corps Compact : Marque, Titre & Prix -->
                      <div class="compact-body">
                        <span class="compact-brand" title="${p.brand || 'MoB'}">${p.brand || 'MoB'}</span>
                        <h3 class="compact-title" onclick="window.MoB.openProductModal('${p.id}')" title="${p.name}">${p.name}</h3>
                        <div class="compact-price">${formatPriceFCFA(p.price)}</div>

                        <!-- Boutons d'Action : Voir & Panier -->
                        <div class="compact-actions">
                          <button type="button" class="btn-compact-view" onclick="window.MoB.openProductModal('${p.id}')" title="Voir le produit">
                            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            <span>Voir</span>
                          </button>
                          <button type="button" class="btn-compact-cart" onclick="window.MoB.handleAddToCart('${p.id}')" title="Ajouter au Panier">
                            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                            <span>Panier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            ` : `
              <!-- AFFICHAGE CLASSIQUE COMPLET -->
              <div class="products-grid">
                ${pageItems.map(p => {
                  const usaBrands = ["cerave", "the ordinary", "paula", "cetaphil", "neutrogena", "shea moisture", "johnson", "palmer", "ogx", "cantu", "aveeno", "dove", "eucerin"];
                  const isUsa = (p.origin && p.origin.toLowerCase().includes("usa")) ||
                    usaBrands.some(b => (p.brand || "").toLowerCase().includes(b) || (p.name || "").toLowerCase().includes(b));

                  return `
                  <div class="product-card" data-product-id="${p.id}">
                    <!-- Image & Badges -->
                    <div class="product-image-wrap" style="cursor: pointer;" onclick="window.MoB.openProductModal('${p.id}')">
                      <span class="product-badge-brand">${p.brand}</span>
                      
                      <div class="product-card-top-badges">
                        ${isUsa ? `<span class="badge-usa-pill">🇺🇸 USA</span>` : ''}
                        <span class="badge-stock-pill ${p.stock && p.stock > 0 ? 'in-stock' : 'available'}">
                          ${p.stock && p.stock > 0 ? `✓ En Stock` : '✓ Dispo Boutique'}
                        </span>
                      </div>

                      <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
                    </div>

                    <!-- Corps de la carte -->
                    <div class="product-body">
                      <h3 class="product-title" style="cursor: pointer;" onclick="window.MoB.openProductModal('${p.id}')">${p.name}</h3>
                      <p class="product-desc">${p.shortDesc}</p>

                      <div class="product-footer">
                        <div class="product-price-block">
                          <span class="product-price">${formatPriceFCFA(p.price)}</span>
                          ${p.oldPrice ? `<span class="product-old-price">${formatPriceFCFA(p.oldPrice)}</span>` : ''}
                        </div>

                        <div class="product-actions">
                          <button class="btn btn-icon" title="Voir les détails" onclick="window.MoB.openProductModal('${p.id}')">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button class="btn btn-gold btn-sm" onclick="window.MoB.handleAddToCart('${p.id}')" title="Ajouter au Panier">
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                            <span>Panier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                }).join("")}
              </div>
            `}
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Pagination Adaptée au Défilement / Scroll au Doigt -->
    ${totalPages > 1 ? `
      <div class="catalog-pagination-wrap" id="catalog-pagination-bar">
        <!-- Barre de Progression Fine de Défilement -->
        <div class="scroll-progress-indicator">
          <div class="scroll-progress-fill" id="catalog-scroll-progress-fill" style="width: ${(validPage / totalPages) * 100}%;"></div>
        </div>

        <div class="pagination-info" id="catalog-pagination-info">
          Page <strong id="catalog-current-page-num">${validPage}</strong> sur <strong id="catalog-total-pages-num">${totalPages}</strong> • 
          Pépites <strong id="catalog-range-num">${startIndex + 1} à ${Math.min(startIndex + perPage, products.length)}</strong> sur <strong id="catalog-total-count-num">${products.length}</strong>
        </div>

        <div class="pagination-controls">
          <button class="pagination-btn ${validPage <= 1 ? 'disabled' : ''}" 
                  id="catalog-prev-page-btn"
                  onclick="window.MoB.scrollCatalogStep(-1)" 
                  ${validPage <= 1 ? 'disabled' : ''} aria-label="Page précédente">
            ← Précédent
          </button>

          <div class="pagination-pages" id="catalog-pagination-dots">
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => `
              <button class="pagination-page-num ${pNum === validPage ? 'active' : ''}" 
                      id="catalog-dot-page-${pNum}"
                      data-page-target="${pNum}"
                      onclick="window.MoB.scrollToCatalogPage(${pNum})" aria-label="Aller à la page ${pNum}">
                ${pNum}
              </button>
            `).join("")}
          </div>

          <button class="pagination-btn ${validPage >= totalPages ? 'disabled' : ''}" 
                  id="catalog-next-page-btn"
                  onclick="window.MoB.scrollCatalogStep(1)" 
                  ${validPage >= totalPages ? 'disabled' : ''} aria-label="Page suivante">
            Suivant →
          </button>
        </div>
      </div>
    ` : ''}
  `;
}

export function renderCatalog(filteredCategory = "all", searchQuery = "", currentPage = 1, perPage = 18, viewMode = "compact") {
  const products = filterProducts(filteredCategory, searchQuery);

  return `
    <section class="section-padding section-with-bg" id="catalogue">
      <div class="section-bg-overlay bg-catalog-store"></div>
      <div class="container">
        <!-- En-tête de section -->
        <div class="section-header">
          <span class="section-tag">Collections Exclusives</span>
          <h2 class="section-title">Nos Produits Phares & Soins Signatures</h2>
          <p class="section-subtitle">
            Une sélection rigoureuse de produits originaux certifiés, plébiscités par nos clientes et clients depuis près de 10 ans aux Vallons.
          </p>
        </div>

        <!-- Barre d'outils Repensée (Deck Recherche Prestigieuse & Stats Vitrine) -->
        <div class="catalog-toolbar">
          <div class="search-and-stats-deck">
            <!-- Barre de Recherche Stylisée -->
            <div class="search-input-box">
              <span class="search-box-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </span>
              <input type="text" id="catalog-search" class="search-deck-input" placeholder="Rechercher un soin dermo, pagne Vlisco, marque..." value="${searchQuery}" autocomplete="off">
              ${searchQuery ? `
                <button type="button" class="search-clear-btn" onclick="window.MoB.clearCatalogSearch()" title="Effacer la recherche">✕</button>
              ` : ''}
            </div>

            <!-- Switcher d'Affichage : Mini-Blocs (100px) vs Classique (Grandes Fiches) -->
            <div class="catalog-view-toggle" id="catalog-view-toggle" role="group" aria-label="Mode d'affichage des produits phares">
              <button type="button" 
                      class="catalog-view-btn ${viewMode === 'compact' ? 'active' : ''}" 
                      id="view-mode-compact-btn"
                      onclick="window.MoB.setCatalogViewMode('compact')"
                      title="Affichage mini-blocs (~100px)"
                      aria-label="Affichage mini-blocs (~100px)">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="4" height="4" rx="1"/><rect x="10" y="3" width="4" height="4" rx="1"/><rect x="17" y="3" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><rect x="3" y="17" width="4" height="4" rx="1"/><rect x="10" y="17" width="4" height="4" rx="1"/><rect x="17" y="17" width="4" height="4" rx="1"/></svg>
              </button>
              <button type="button" 
                      class="catalog-view-btn ${viewMode === 'classic' ? 'active' : ''}" 
                      id="view-mode-classic-btn"
                      onclick="window.MoB.setCatalogViewMode('classic')"
                      title="Affichage classique (grandes fiches)"
                      aria-label="Affichage classique (grandes fiches)">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
              </button>
            </div>

            <!-- Boutons d'Action & Compteur Pill -->
            <div class="search-deck-actions">
              <button class="btn-deck-grand-catalog" id="open-full-catalog-banner-btn" title="Ouvrir le Grand Catalogue complet de 1 136 articles">
                <span class="btn-deck-sparkle">✨</span>
                <span>Grand Catalogue <strong>(1 136)</strong></span>
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              <div class="search-deck-count" id="catalog-count-wrapper">
                <span class="count-dot"></span>
                <span><strong id="catalog-count-number">${products.length}</strong> articles phares</span>
              </div>
            </div>
          </div>

          <!-- Onglets de Catégorie Sticky (Images) -->
          <div class="category-tabs" id="category-tabs-container">
            ${CATALOG_CATEGORIES.map(c => `
              <button type="button" class="category-img-btn ${filteredCategory === c.id ? 'active' : ''}" data-category="${c.id}" style="background-image: url('${c.img}')">
                <span class="category-img-label">${c.label}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Conteneur de Grille des Produits Dynamique -->
        <div id="products-grid-container">
          ${renderProductsGridContent(products, currentPage, perPage, viewMode)}
        </div>
      </div>
    </section>
  `;
}
