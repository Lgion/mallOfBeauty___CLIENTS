import { searchFullCatalog, getStoreSettings } from "../data/storage.js";

export function renderFullCatalogModal({
  query = "",
  category = "all",
  brand = "all",
  page = 1,
  perPage = 20
} = {}) {
  const result = searchFullCatalog({ query, category, brand, page, perPage });
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
    <div class="modal-backdrop active" id="full-catalog-backdrop" style="z-index: 1050; padding: 20px;">
      <div class="modal-dialog" style="max-width: 1240px; width: 100%; max-height: 92vh; display: flex; flex-direction: column; background: radial-gradient(circle at 10% 10%, rgba(212, 175, 55, 0.18) 0%, rgba(26, 18, 40, 0.98) 45%), radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.14) 0%, rgba(15, 23, 42, 0.98) 50%), #14101E; border: 2px solid rgba(212, 175, 55, 0.45); border-radius: var(--radius-lg); box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.25); overflow: hidden;">
        
        <!-- Modal Header Jovial & Coloré -->
        <div style="padding: 22px 28px; background: linear-gradient(90deg, rgba(212, 175, 55, 0.15) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(99, 102, 241, 0.15) 100%); border-bottom: 1.5px solid rgba(212, 175, 55, 0.3); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap;">
              <span class="badge" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #000; font-weight: 800; box-shadow: 0 2px 8px rgba(245,158,11,0.35);">
                ✨ 1 136 Articles Disponibles
              </span>
              <span class="badge" style="background: rgba(16, 185, 129, 0.25); color: #34D399; border: 1px solid #10B981; font-weight: 700;">
                🟢 100% Authentiques & Certifiés
              </span>
              <span class="badge" style="background: rgba(236, 72, 153, 0.25); color: #F472B6; border: 1px solid #EC4899; font-weight: 700;">
                📍 Les Vallons (Rue des Jardins)
              </span>
            </div>
            <h2 style="font-size: 1.65rem; font-family: var(--font-serif); background: linear-gradient(135deg, #FFFFFF 0%, #FDE68A 50%, #F59E0B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-weight: 700;">
              Grand Catalogue Mall of Beauty
            </h2>
          </div>
          <button class="btn btn-icon" id="close-full-catalog-btn" aria-label="Fermer le grand catalogue" style="background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.25);">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Toolbar: Recherche & Pills de Catégories Colorées -->
        <div style="padding: 16px 28px; background: rgba(20, 16, 30, 0.95); border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 14px;">
          <!-- Barre de Recherche -->
          <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center;">
            <div class="search-input-wrap" style="flex: 1; min-width: 280px;">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" id="fc-search-input" class="search-input" placeholder="Rechercher un produit, une marque (ex: Makari, Super Wax, Medicube, Cetaphil...)" value="${query}">
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <select id="fc-category-select" class="form-select" style="min-width: 200px; padding: 10px 14px; font-size: 0.88rem; background: #261F38; border-color: rgba(212, 175, 55, 0.4);">
                ${categories.map(c => `
                  <option value="${c.id}" ${category === c.id ? "selected" : ""}>${c.icon} ${c.label}</option>
                `).join("")}
              </select>

              <button class="btn btn-dark btn-sm" id="fc-reset-filters-btn" title="Réinitialiser filtres" style="padding: 10px 16px; border-color: rgba(255,255,255,0.2);">
                🔄 Réinitialiser
              </button>
            </div>
          </div>

          <!-- Pills de Catégories Interactives Colorées -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
            ${categories.map(c => `
              <button class="fc-category-pill ${category === c.id ? 'active' : ''}" data-category="${c.id}">
                <span>${c.icon}</span>
                <span>${c.label}</span>
              </button>
            `).join("")}
          </div>

          <!-- Total trouvé & pagination info -->
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.86rem; color: #D1D5DB; padding-top: 4px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
            <div>
              Résultat : <strong style="color: #FDE68A; font-size: 0.95rem;">${result.total}</strong> articles trouvés
            </div>
            <div>
              Page <strong style="color: #FFF;">${result.currentPage}</strong> sur <strong style="color: #FFF;">${result.totalPages}</strong> (${result.perPage} articles par page)
            </div>
          </div>
        </div>

        <!-- Body: Grille 2 Colonnes Joyeuse & Colorée -->
        <div style="flex: 1; overflow-y: auto; padding: 24px 28px; background: rgba(16, 12, 24, 0.85);">
          ${result.items.length === 0 ? `
            <div style="text-align: center; padding: 60px 20px;">
              <div style="font-size: 3.5rem; margin-bottom: 14px;">🔍</div>
              <h3 style="color: #FFF; margin-bottom: 8px; font-size: 1.3rem;">Aucun article trouvé pour cette recherche</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem;">Essayez un autre mot-clé ou cliquez sur « 🌟 Tous les Rayons » pour explorer le catalogue.</p>
            </div>
          ` : `
            <div class="full-catalog-grid">
              ${result.items.map(item => `
                <div class="full-catalog-card">
                  <!-- Visual Container Placeholder Coloré par Catégorie -->
                  <div class="full-catalog-visual ${getCategoryClass(item.category)}">
                    <div class="full-catalog-visual-icon">
                      <span style="font-size: 1.7rem;">${getCategoryIcon(item.category)}</span>
                    </div>
                    <span style="font-size: 0.72rem; color: #FFF; font-weight: 800; letter-spacing: 0.04em;">${item.category}</span>
                    <span style="font-size: 0.65rem; color: rgba(255, 255, 255, 0.75); margin-top: 4px;">Original Certifié</span>
                  </div>

                  <!-- Infos & Actions -->
                  <div class="full-catalog-info">
                    <div>
                      <div class="full-catalog-brand">${item.brand}</div>
                      <h4 class="full-catalog-name">${item.name}</h4>
                      <p class="full-catalog-desc">${item.description}</p>
                    </div>

                    <div class="full-catalog-footer">
                      <div>
                        <div style="font-size: 0.72rem; color: #9CA3AF; text-transform: uppercase; font-weight: 600;">Tarif 2026 (FCFA)</div>
                        <div class="full-catalog-price">${item.priceFormatted}</div>
                      </div>

                      <div style="display: flex; gap: 8px;">
                        <button class="btn btn-outline-gold btn-sm fc-add-cart-btn" data-product-id="${item.id}" data-product-name="${encodeURIComponent(item.name + ' - ' + item.brand)}" data-product-price="${item.price}" title="Ajouter au panier">
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

        <!-- Modal Footer: Contrôles de Pagination -->
        <div style="padding: 16px 28px; background: rgba(20, 16, 30, 0.98); border-top: 1.5px solid rgba(212, 175, 55, 0.25); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="font-size: 0.85rem; color: #D1D5DB;">
            Affichage de <strong>${(result.currentPage - 1) * result.perPage + 1}</strong> à <strong>${Math.min(result.currentPage * result.perPage, result.total)}</strong> sur <strong>${result.total}</strong> articles
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-dark btn-sm" id="fc-prev-page-btn" ${result.currentPage <= 1 ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : "style='background: rgba(255,255,255,0.08);'"}>
              ← Précédent
            </button>
            <span style="font-size: 0.92rem; font-weight: 800; color: #FBBF24; padding: 0 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-sm);">
              ${result.currentPage} / ${result.totalPages}
            </span>
            <button class="btn btn-dark btn-sm" id="fc-next-page-btn" ${result.currentPage >= result.totalPages ? "disabled style='opacity: 0.4; cursor: not-allowed;'" : "style='background: rgba(255,255,255,0.08);'"}>
              Suivant →
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
