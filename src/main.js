import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/admin.css";

import confetti from "canvas-confetti";
import { renderNavbar } from "./components/Navbar.js";
import { renderHero } from "./components/Hero.js";
import { renderCatalog, formatPriceFCFA, filterProducts, renderProductsGridContent } from "./components/Catalog.js";
import { renderProductModal } from "./components/ProductModal.js";
import { renderFullCatalogModal } from "./components/FullCatalogModal.js";
import { renderWaveModal } from "./components/WaveModal.js";
import { 
  renderTransitionProductsToAdvisory, 
  renderTransitionAdvisoryToShopper, 
  renderTransitionShopperToLoyalty 
} from "./components/SectionTransitions.js";
import { renderAdvisoryBooking } from "./components/AdvisoryBooking.js";
import { renderPersonalShopper } from "./components/PersonalShopper.js";
import { renderLoyaltyCard } from "./components/LoyaltyCard.js";
import { renderSocialSection } from "./components/SocialSection.js";
import { renderInteractiveMap, initMapInstance } from "./components/InteractiveMap.js";
import { renderCartDrawer } from "./components/CartDrawer.js";
import { 
  renderAdminDashboard, setEditingProductId, toggleAddProductFormState,
  switchAdminTabLive, refreshAdminActiveTab
} from "./components/AdminDashboard.js";
import { renderFooter } from "./components/Footer.js";

import { 
  getProducts, getProductById, addProduct, updateProduct, deleteProduct, toggleFeatured,
  getAppointments, addAppointment, updateAppointmentStatus, deleteAppointment,
  getPersonalShopperRequests, addPersonalShopperRequest, updatePersonalShopperStatus, deletePersonalShopperRequest,
  getLoyaltyMembers, addLoyaltyMember, deleteLoyaltyMember,
  getContacts, addContact, updateContactStatus, deleteContact,
  getAnalyticsClicks, trackClick, resetAnalyticsClicks,
  getStoreSettings, updateStoreSettings, resetToFactory, reloadAllDummyData,
  getCart, addToCart, updateCartQuantity, removeFromCart, clearCart,
  subscribeToDataChanges
} from "./data/storage.js";

// --- ÉTAT GLOBAL DE L'APPLICATION ---
const state = {
  currentCategory: "all",
  searchQuery: "",
  catalogPage: 1,
  catalogPerPage: 9,
  activeProductId: null,
  isCartOpen: false,
  isAdminOpen: false,
  adminTab: "products",
  isWaveModalOpen: false,
  activeSocialTab: "instagram",
  isSocialFeedExpanded: false,
  isFullCatalogOpen: false,
  fcQuery: "",
  fcCategory: "all",
  fcBrand: "all",
  fcPage: 1,
  fcPerPage: 20
};

// --- INITIALISATION & RENDU PRINCIPAL ---
function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    ${renderNavbar()}
    <main>
      ${renderHero()}
      ${renderCatalog(state.currentCategory, state.searchQuery, state.catalogPage, state.catalogPerPage)}
      ${renderTransitionProductsToAdvisory()}
      ${renderAdvisoryBooking()}
      ${renderTransitionAdvisoryToShopper()}
      ${renderPersonalShopper()}
      ${renderTransitionShopperToLoyalty()}
      ${renderLoyaltyCard()}
      ${renderSocialSection(state.activeSocialTab, state.isSocialFeedExpanded)}
      ${renderInteractiveMap()}
    </main>
    ${renderFooter()}
  `;

  // Attach event listeners for dynamic elements
  setupCatalogEvents();
  setupGlobalHeaderEvents();

  // Initialise la carte Leaflet
  setTimeout(() => {
    initMapInstance();
  }, 100);
}

function updateModals() {
  // Modal Produit Phare
  const productModalRoot = document.getElementById("product-modal-root");
  if (productModalRoot) {
    productModalRoot.innerHTML = state.activeProductId ? renderProductModal(state.activeProductId) : "";
  }

  // Grand Catalogue (1 136 Articles) Modal
  const fullCatalogRoot = document.getElementById("full-catalog-modal-root");
  if (fullCatalogRoot) {
    if (state.isFullCatalogOpen) {
      fullCatalogRoot.innerHTML = renderFullCatalogModal({
        query: state.fcQuery,
        category: state.fcCategory,
        brand: state.fcBrand,
        page: state.fcPage,
        perPage: state.fcPerPage
      });
      setupFullCatalogEvents();
    } else {
      fullCatalogRoot.innerHTML = "";
    }
  }

  // Modal de Paiement Wave CI
  const waveModalRoot = document.getElementById("wave-modal-root");
  if (waveModalRoot) {
    waveModalRoot.innerHTML = state.isWaveModalOpen ? renderWaveModal() : "";
  }

  // Tiroir Panier
  const cartDrawerRoot = document.getElementById("cart-drawer-root");
  if (cartDrawerRoot) {
    cartDrawerRoot.innerHTML = renderCartDrawer();
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (backdrop && state.isCartOpen) {
      backdrop.classList.add("active");
    }
  }

  // Modal Admin CRUD
  const adminModalRoot = document.getElementById("admin-modal-root");
  if (adminModalRoot) {
    adminModalRoot.innerHTML = state.isAdminOpen ? renderAdminDashboard(state.adminTab) : "";
  }

  // Met à jour le compteur du panier dans le header
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const headerCount = document.getElementById("header-cart-count");
  if (headerCount) headerCount.textContent = totalItems;
}

// --- ÉVÉNEMENTS DU CATALOGUE PHARE ---
function updateCatalogLive() {
  const gridContainer = document.getElementById("products-grid-container");
  const countNumber = document.getElementById("catalog-count-number");

  const filtered = filterProducts(state.currentCategory, state.searchQuery);

  if (gridContainer) {
    gridContainer.innerHTML = renderProductsGridContent(filtered, state.catalogPage, state.catalogPerPage);
  }

  if (countNumber) {
    countNumber.textContent = filtered.length;
  }

  // Mettre à jour visuellement les onglets actifs du bandeau sticky
  const tabsContainer = document.getElementById("category-tabs-container");
  if (tabsContainer) {
    tabsContainer.querySelectorAll(".category-img-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.category === state.currentCategory);
    });
  }

  // Réattacher le clic sur le bouton de réinitialisation si le message vide est affiché
  const resetBtn = document.getElementById("reset-catalog-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.currentCategory = "all";
      state.searchQuery = "";
      state.catalogPage = 1;
      const searchInput = document.getElementById("catalog-search");
      if (searchInput) searchInput.value = "";
      updateCatalogLive();
    });
  }
}

function setupCatalogEvents() {
  const searchInput = document.getElementById("catalog-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      state.catalogPage = 1;
      // Mise à jour fluide du catalogue SANS remplacer l'input (maintient du focus)
      updateCatalogLive();
    });
  }

  // Événements sur les boutons de catégories avec images du sticky bar (délégation d'événements)
  const tabsContainer = document.getElementById("category-tabs-container");
  if (tabsContainer) {
    tabsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-img-btn");
      if (!btn) return;
      state.currentCategory = btn.dataset.category;
      state.catalogPage = 1;
      updateCatalogLive();
    });
  }

  const resetBtn = document.getElementById("reset-catalog-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.currentCategory = "all";
      state.searchQuery = "";
      if (searchInput) searchInput.value = "";
      updateCatalogLive();
    });
  }
}

function refreshCatalogSection() {
  updateCatalogLive();
}

function setupFullCatalogEvents() {
  const closeBtn = document.getElementById("close-full-catalog-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      state.isFullCatalogOpen = false;
      updateModals();
    });
  }

  const backdrop = document.getElementById("full-catalog-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        state.isFullCatalogOpen = false;
        updateModals();
      }
    });
  }

  // Recherche dans le grand catalogue
  const searchInput = document.getElementById("fc-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.fcQuery = e.target.value;
      state.fcPage = 1;
      updateModals();
      // Keep focus on input after re-render
      setTimeout(() => {
        const input = document.getElementById("fc-search-input");
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }, 10);
    });
  }

  // Filtre par catégorie (select & pills)
  const catSelect = document.getElementById("fc-category-select");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      state.fcCategory = e.target.value;
      state.fcPage = 1;
      updateModals();
    });
  }

  const catPills = document.querySelectorAll(".fc-category-pill");
  catPills.forEach(pill => {
    pill.addEventListener("click", () => {
      state.fcCategory = pill.dataset.category;
      state.fcPage = 1;
      updateModals();
    });
  });

  // Réinitialiser les filtres
  const resetBtn = document.getElementById("fc-reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.fcQuery = "";
      state.fcCategory = "all";
      state.fcBrand = "all";
      state.fcPage = 1;
      updateModals();
    });
  }

  // Pagination
  const prevBtn = document.getElementById("fc-prev-page-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (state.fcPage > 1) {
        state.fcPage--;
        updateModals();
      }
    });
  }

  const nextBtn = document.getElementById("fc-next-page-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      state.fcPage++;
      updateModals();
    });
  }

  // Ajout au panier depuis le grand catalogue
  const addCartBtns = document.querySelectorAll(".fc-add-cart-btn");
  addCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.productId;
      const name = decodeURIComponent(btn.dataset.productName);
      addToCart(id, 1);
      showToast(`« ${name} » ajouté au panier !`, "gold");
      updateModals();
    });
  });
}

function setupGlobalHeaderEvents() {
  const openCartBtn = document.getElementById("open-cart-btn");
  if (openCartBtn) {
    openCartBtn.addEventListener("click", () => {
      state.isCartOpen = true;
      updateModals();
    });
  }

  const openAdminBtn = document.getElementById("open-admin-btn");
  if (openAdminBtn) {
    openAdminBtn.addEventListener("click", () => {
      state.isAdminOpen = true;
      updateModals();
    });
  }

  // Triggers d'ouverture du Grand Catalogue (1 136 articles)
  const navFullCatBtn = document.getElementById("open-full-catalog-nav-btn");
  if (navFullCatBtn) {
    navFullCatBtn.addEventListener("click", () => {
      state.isFullCatalogOpen = true;
      trackClick("catalog", "Grand Catalogue (Menu)");
      updateModals();
    });
  }

  const heroFullCatBtn = document.getElementById("hero-open-full-catalog-btn");
  if (heroFullCatBtn) {
    heroFullCatBtn.addEventListener("click", () => {
      state.isFullCatalogOpen = true;
      trackClick("catalog", "Grand Catalogue (Hero)");
      updateModals();
    });
  }

  const bannerFullCatBtn = document.getElementById("open-full-catalog-banner-btn");
  if (bannerFullCatBtn) {
    bannerFullCatBtn.addEventListener("click", () => {
      state.isFullCatalogOpen = true;
      trackClick("catalog", "Grand Catalogue (Bannière)");
      updateModals();
    });
  }

  const headerCatalogBtn = document.getElementById("header-catalog-btn");
  if (headerCatalogBtn) {
    headerCatalogBtn.addEventListener("click", (e) => {
      e.preventDefault();
      state.isFullCatalogOpen = true;
      trackClick("catalog", "Grand Catalogue (Header)");
      updateModals();
    });
  }
}

// --- NOTIFICATION TOAST ---
function showToast(message, type = "success") {
  const toastRoot = document.getElementById("toast-root");
  if (!toastRoot) return;

  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 3000;
    background: ${type === 'success' ? '#10B981' : '#D4AF37'};
    color: ${type === 'success' ? '#FFFFFF' : '#0A0A0C'};
    padding: 14px 24px;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✨'}</span> <span>${message}</span>`;
  toastRoot.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- EXPOSITION DES FONCTIONS GLOBALES SUR WINDOW (MoB) ---
window.MoB = {
  // Navigation & Filtres
  filterCategory(cat) {
    state.currentCategory = cat;
    state.catalogPage = 1;
    refreshCatalogSection();
    const el = document.getElementById("catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  },

  // Modale Wave Côte d'Ivoire
  openWaveModal() {
    state.isWaveModalOpen = true;
    trackClick("wave", "Bouton Paiement Wave Header");
    updateModals();
  },
  closeWaveModal() {
    state.isWaveModalOpen = false;
    updateModals();
  },
  copyWaveNumber(num) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num).then(() => {
        showToast(`Numéro Wave copié : ${num}`, "success");
      }).catch(() => {
        showToast(`Numéro Wave : ${num}`, "gold");
      });
    } else {
      showToast(`Numéro Wave : ${num}`, "gold");
    }
  },
  setWaveAmount(val) {
    const input = document.getElementById("wave-amount-input");
    if (input) input.value = val;
    this.updateWaveAmountDisplay(val);
  },
  onWaveAmountInput(val) {
    const num = parseInt(val, 10) || 0;
    this.updateWaveAmountDisplay(num);
  },
  updateWaveAmountDisplay(val) {
    const display = document.getElementById("wave-qr-amount-display");
    if (display) {
      display.textContent = `${Number(val).toLocaleString('fr-FR')} FCFA`;
    }
    const pills = document.querySelectorAll(".wave-quick-pill");
    pills.forEach(pill => {
      const pillAmount = parseInt(pill.getAttribute("data-amount"), 10);
      pill.classList.toggle("active", pillAmount === Number(val));
    });
  },
  copyWavePaymentLink(url) {
    const settings = getStoreSettings();
    const linkToCopy = url || settings.contacts.wavePaymentUrl || "https://pay.wave.com/m/M_CI_mallofbeauty";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        showToast("Lien de paiement Wave copié dans le presse-papier !", "success");
      }).catch(() => {
        showToast(`Lien Wave : ${linkToCopy}`, "info");
      });
    } else {
      showToast(`Lien Wave : ${linkToCopy}`, "info");
    }
  },

  // Pagination & Navigation au Scroll (Touch Swipe & Doigt)
  scrollToCatalogPage(pNum) {
    state.catalogPage = pNum;
    const track = document.getElementById("catalog-scroll-track");
    if (track) {
      track.scrollTo({ left: (pNum - 1) * track.clientWidth, behavior: "smooth" });
    }
  },
  scrollCatalogStep(direction) {
    const track = document.getElementById("catalog-scroll-track");
    if (track) {
      track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
    }
  },
  handleCatalogScroll(track) {
    if (!track) return;
    const slideWidth = track.clientWidth;
    if (!slideWidth) return;
    const scrollLeft = track.scrollLeft;
    const totalPages = document.querySelectorAll(".catalog-page-slide").length;
    if (!totalPages) return;

    const pageIndex = Math.min(
      totalPages,
      Math.max(1, Math.round(scrollLeft / slideWidth) + 1)
    );

    state.catalogPage = pageIndex;

    const filtered = filterProducts(state.currentCategory, state.searchQuery);
    const startIndex = (pageIndex - 1) * state.catalogPerPage;

    // Mise à jour de la pastille active
    const dots = document.querySelectorAll("#catalog-pagination-dots .pagination-page-num");
    dots.forEach(dot => {
      const target = parseInt(dot.getAttribute("data-page-target"), 10);
      dot.classList.toggle("active", target === pageIndex);
    });

    // Mise à jour de la barre de progression
    const progressFill = document.getElementById("catalog-scroll-progress-fill");
    if (progressFill && totalPages > 0) {
      progressFill.style.width = `${(pageIndex / totalPages) * 100}%`;
    }

    // Mise à jour des textes indicatifs
    const curNum = document.getElementById("catalog-current-page-num");
    if (curNum) curNum.textContent = pageIndex;
    const rangeNum = document.getElementById("catalog-range-num");
    if (rangeNum) rangeNum.textContent = `${startIndex + 1} à ${Math.min(startIndex + state.catalogPerPage, filtered.length)}`;

    // Mise à jour de l'état des boutons précédent / suivant
    const prevBtn = document.getElementById("catalog-prev-page-btn");
    const nextBtn = document.getElementById("catalog-next-page-btn");
    if (prevBtn) {
      prevBtn.classList.toggle("disabled", pageIndex <= 1);
      prevBtn.disabled = pageIndex <= 1;
    }
    if (nextBtn) {
      nextBtn.classList.toggle("disabled", pageIndex >= totalPages);
      nextBtn.disabled = pageIndex >= totalPages;
    }

    // Mise à jour des flèches latérales & numéros de page au niveau de la 2ème ligne
    document.querySelectorAll(".flank-page-active").forEach(el => {
      el.textContent = pageIndex;
    });
    const flankLeft = document.getElementById("catalog-flank-nav-left");
    const flankRight = document.getElementById("catalog-flank-nav-right");
    const flankPrevBtn = document.getElementById("flank-prev-arrow-btn");
    const flankNextBtn = document.getElementById("flank-next-arrow-btn");

    if (flankLeft) flankLeft.classList.toggle("disabled", pageIndex <= 1);
    if (flankRight) flankRight.classList.toggle("disabled", pageIndex >= totalPages);
    if (flankPrevBtn) flankPrevBtn.disabled = pageIndex <= 1;
    if (flankNextBtn) flankNextBtn.disabled = pageIndex >= totalPages;
  },
  goToCatalogPage(pNum) {
    this.scrollToCatalogPage(pNum);
  },
  clearCatalogSearch() {
    state.searchQuery = "";
    state.catalogPage = 1;
    const searchInput = document.getElementById("catalog-search");
    if (searchInput) searchInput.value = "";
    updateCatalogLive();
  },

  // Onglets Réseaux Sociaux & Flux Rétractable
  selectSocialTab(platformId) {
    state.activeSocialTab = platformId;
    trackClick(platformId, `Onglet Réseau ${platformId}`);
    const socialSection = document.getElementById("communaute");
    if (socialSection) {
      socialSection.outerHTML = renderSocialSection(state.activeSocialTab, state.isSocialFeedExpanded);
    }
  },
  toggleSocialFeed() {
    state.isSocialFeedExpanded = !state.isSocialFeedExpanded;
    const socialSection = document.getElementById("communaute");
    if (socialSection) {
      socialSection.outerHTML = renderSocialSection(state.activeSocialTab, state.isSocialFeedExpanded);
    }
  },

  // Modal Produit
  openProductModal(id) {
    state.activeProductId = id;
    updateModals();
  },
  closeProductModal() {
    state.activeProductId = null;
    updateModals();
  },

  // Panier
  openCartDrawer() {
    state.isCartOpen = true;
    updateModals();
  },
  closeCartDrawer() {
    state.isCartOpen = false;
    updateModals();
  },
  handleAddToCart(productId, qty = 1) {
    const product = getProductById(productId);
    addToCart(productId, qty);
    showToast(`« ${product ? product.name : 'Article'} » ajouté au panier !`, "gold");
    updateModals();
  },
  handleUpdateQty(productId, qty) {
    updateCartQuantity(productId, qty);
    updateModals();
  },
  handleRemoveFromCart(productId) {
    removeFromCart(productId);
    updateModals();
  },
  handleClearCart() {
    clearCart();
    updateModals();
  },
  handleCheckoutWhatsApp() {
    const cart = getCart();
    const settings = getStoreSettings();
    if (cart.length === 0) return;

    const deliveryType = document.getElementById("cart-delivery-type")?.value || "Retrait en boutique";
    const clientName = document.getElementById("cart-client-name")?.value.trim() || "Client MoB";
    const clientAddress = document.getElementById("cart-client-address")?.value.trim() || "À préciser";

    const itemsSummary = cart.map(item => {
      const p = getProductById(item.productId);
      return `• ${item.quantity}x ${p ? p.name : 'Produit'} (${formatPriceFCFA((p ? p.price : 0) * item.quantity)})`;
    }).join("\n");

    const total = cart.reduce((sum, item) => {
      const p = getProductById(item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    const message = 
      `*NOUVELLE COMMANDE - MALL OF BEAUTY (MoB)*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client :* ${clientName}\n` +
      `📍 *Réception :* ${deliveryType}\n` +
      `🗺️ *Adresse / Quartier :* ${clientAddress}\n\n` +
      `🛍️ *Articles commandés :*\n${itemsSummary}\n\n` +
      `💰 *TOTAL ESTIMÉ :* ${formatPriceFCFA(total)}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Merci de me confirmer la commande et les modalités de paiement (Wave, Orange Money ou Espèces en boutique).`;

    trackClick("whatsapp", `Panier: ${formatPriceFCFA(total)}`);
    const whatsappUrl = `https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Nettoyage et félicitations
    clearCart();
    state.isCartOpen = false;
    updateModals();
    showToast("Votre commande est prête à être envoyée sur WhatsApp !", "success");
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
  },

  // Soumission Réservation Conseil Beauté
  handleAdvisorySubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById("adv-name").value.trim();
    const phone = document.getElementById("adv-phone").value.trim();
    const type = document.getElementById("adv-profile").value;
    const mode = document.getElementById("adv-mode").value;
    const preferredDate = document.getElementById("adv-date").value;
    const notes = document.getElementById("adv-notes").value.trim();

    const appointment = addAppointment({
      fullName,
      phone,
      type,
      mode,
      preferredDate,
      notes
    });

    trackClick("booking", "RDV: " + fullName);
    showToast("Votre demande de consultation a été enregistrée avec succès !", "success");
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Option d'envoi immédiat par WhatsApp
    const settings = getStoreSettings();
    const msg = 
      `*DEMANDE DE CONSULTATION BEAUTÉ & DIAGNOSTIC*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Nom :* ${fullName}\n` +
      `📞 *Téléphone :* ${phone}\n` +
      `✨ *Profil :* ${type}\n` +
      `📍 *Lieu :* ${mode}\n` +
      `📅 *Date souhaitée :* ${preferredDate || 'À convenir'}\n` +
      `📝 *Notes & Préoccupations :* ${notes || 'Aucune'}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Je souhaite convenir d'un créneau pour mon diagnostic.`;

    const whatsappUrl = `https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");

    document.getElementById("advisory-booking-form").reset();
  },

  // Soumission Personal Shopper Conciergerie
  handlePersonalShopperSubmit(e) {
    e.preventDefault();
    const clientName = document.getElementById("ps-name").value.trim();
    const clientPhone = document.getElementById("ps-phone").value.trim();
    const category = document.getElementById("ps-cat").value;
    const targetBudget = document.getElementById("ps-budget").value.trim();
    const itemRequested = document.getElementById("ps-item").value.trim();

    addPersonalShopperRequest({
      clientName,
      clientPhone,
      category,
      targetBudget,
      itemRequested
    });

    trackClick("shopper", "Conciergerie: " + itemRequested);
    showToast("Votre demande VIP a été transmise à notre Personal Shopper !", "gold");
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    const settings = getStoreSettings();
    const msg = 
      `*REQUÊTE PERSONAL SHOPPER VIP (MoB)*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Client :* ${clientName}\n` +
      `📞 *WhatsApp :* ${clientPhone}\n` +
      `🏷️ *Catégorie :* ${category}\n` +
      `💎 *Article recherché :* ${itemRequested}\n` +
      `💵 *Budget indicatif :* ${targetBudget || 'À définir'}\n` +
      `🛡️ *Acompte 60% :* Pris en compte et accepté\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Merci de me faire savoir si vous pouvez sourcer cet article.`;

    const whatsappUrl = `https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");

    document.getElementById("personal-shopper-form").reset();
  },

  // Soumission Inscription Carte Privilège
  handleLoyaltySubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById("loyalty-name").value.trim();
    const phone = document.getElementById("loyalty-phone").value.trim();
    const birthDate = document.getElementById("loyalty-bday").value;
    const neighborhood = document.getElementById("loyalty-neighborhood").value.trim();
    const favoriteCategory = document.getElementById("loyalty-pref").value;

    addLoyaltyMember({
      fullName,
      phone,
      birthDate,
      neighborhood,
      favoriteCategory
    });

    confetti({
      particleCount: 110,
      spread: 85,
      colors: ['#D4AF37', '#F3E5AB', '#FFFFFF', '#B38F26']
    });

    showToast("Votre Carte Privilège a été enregistrée avec succès !", "gold");

    const settings = getStoreSettings();
    const msg = 
      `*ADHÉSION CARTE PRIVILÈGE VIP - MALL OF BEAUTY*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Nom :* ${fullName}\n` +
      `📞 *WhatsApp :* ${phone}\n` +
      `🎂 *Date Anniversaire (-10%) :* ${birthDate || 'À préciser'}\n` +
      `📍 *Quartier :* ${neighborhood || 'Abidjan'}\n` +
      `🏷️ *Univers Préféré :* ${favoriteCategory}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Je viens de souscrire à la Carte Privilège sur le site web.`;

    const whatsappUrl = `https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");

    document.getElementById("loyalty-registration-form").reset();
    updateModals();
  },

  handleDeleteLoyaltyMember(id) {
    if (confirm("Confirmer la suppression de cet adhérent ?")) {
      deleteLoyaltyMember(id);
      showToast("Adhérent retiré.", "gold");
      updateModals();
    }
  },

  handleResetAnalytics() {
    if (confirm("Réinitialiser tous les compteurs de clics à zéro ?")) {
      resetAnalyticsClicks();
      showToast("Compteurs analytiques réinitialisés.", "gold");
      updateModals();
    }
  },

  // Simulateur Carte de Fidélité
  triggerCardCelebration() {
    const cardEl = document.getElementById("visual-loyalty-card");
    if (cardEl) {
      cardEl.style.transform = "scale(1.04) rotate(1deg)";
      setTimeout(() => cardEl.style.transform = "scale(1) rotate(0deg)", 400);
    }
    confetti({
      particleCount: 100,
      spread: 90,
      colors: ['#D4AF37', '#F3E5AB', '#FFFFFF', '#B38F26']
    });
    showToast("Carte Privilège MoB simulée avec succès ! -10% Anniversaire & -15% Cycle.", "gold");
  },

  // Gestion Admin (CRUD)
  openAdminModal() {
    state.isAdminOpen = true;
    updateModals();
  },
  closeAdminModal() {
    state.isAdminOpen = false;
    setEditingProductId(null);
    updateModals();
  },
  switchAdminTab(tab) {
    state.adminTab = tab;
    if (document.getElementById("admin-tab-container")) {
      switchAdminTabLive(tab);
    } else {
      updateModals();
    }
  },
  toggleAddProductForm() {
    toggleAddProductFormState();
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
  },
  startEditProduct(id) {
    const p = getProductById(id);
    if (!p) return;
    setEditingProductId(id);
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }

    // Remplir le formulaire
    setTimeout(() => {
      const nameInput = document.getElementById("form-product-name");
      if (!nameInput) return;
      nameInput.value = p.name;
      document.getElementById("form-product-brand").value = p.brand;
      document.getElementById("form-product-category").value = p.category;
      document.getElementById("form-product-price").value = p.price;
      document.getElementById("form-product-oldprice").value = p.oldPrice || "";
      document.getElementById("form-product-stock").value = p.stock;
      document.getElementById("form-product-shortdesc").value = p.shortDesc || "";
      document.getElementById("form-product-desc").value = p.description || "";
      document.getElementById("form-product-usage").value = p.usage || "";
      document.getElementById("form-product-image").value = p.image || "/imgs/stands_esthetique.jpg";
      document.getElementById("form-product-featured").checked = !!p.isFeatured;
    }, 50);
  },
  cancelProductEdit() {
    setEditingProductId(null);
    toggleAddProductFormState();
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
  },
  handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById("form-product-id").value;
    const name = document.getElementById("form-product-name").value.trim();
    const brand = document.getElementById("form-product-brand").value.trim();
    const category = document.getElementById("form-product-category").value;
    const price = Number(document.getElementById("form-product-price").value);
    const oldPriceVal = document.getElementById("form-product-oldprice").value;
    const oldPrice = oldPriceVal ? Number(oldPriceVal) : null;
    const stock = Number(document.getElementById("form-product-stock").value);
    const shortDesc = document.getElementById("form-product-shortdesc").value.trim();
    const description = document.getElementById("form-product-desc").value.trim();
    const usage = document.getElementById("form-product-usage").value.trim();
    const image = document.getElementById("form-product-image").value.trim() || "/imgs/stands_esthetique.jpg";
    const isFeatured = document.getElementById("form-product-featured").checked;

    const productPayload = {
      name,
      brand,
      category,
      price,
      oldPrice,
      stock,
      shortDesc,
      description,
      usage,
      image,
      isFeatured
    };

    if (id) {
      updateProduct(id, productPayload);
      showToast("Produit mis à jour avec succès !", "success");
    } else {
      addProduct(productPayload);
      showToast("Nouveau produit ajouté au catalogue !", "success");
    }

    setEditingProductId(null);
    toggleAddProductFormState();
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
    refreshCatalogSection();
  },
  handleDeleteProduct(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit du catalogue ?")) {
      deleteProduct(id);
      showToast("Produit supprimé.", "gold");
      if (document.getElementById("admin-tab-container")) {
        refreshAdminActiveTab();
      } else {
        updateModals();
      }
      refreshCatalogSection();
    }
  },
  handleToggleFeatured(id) {
    toggleFeatured(id);
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
    refreshCatalogSection();
  },

  // RDV Admin
  handleUpdateAppointmentStatus(id, status) {
    updateAppointmentStatus(id, status);
    showToast(`Statut du rendez-vous mis à jour : ${status}`, "success");
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
  },
  handleDeleteAppointment(id) {
    if (confirm("Supprimer cette réservation ?")) {
      deleteAppointment(id);
      if (document.getElementById("admin-tab-container")) {
        refreshAdminActiveTab();
      } else {
        updateModals();
      }
    }
  },

  // PS Admin
  handleUpdatePSStatus(id, status) {
    updatePersonalShopperStatus(id, status, null);
    showToast("Statut Personal Shopper mis à jour.", "success");
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
  },
  handleUpdatePSDeposit(id, depositStatus) {
    updatePersonalShopperStatus(id, null, depositStatus);
    showToast(`Statut acompte 60% : ${depositStatus}`, "success");
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
  },
  handleDeletePS(id) {
    if (confirm("Supprimer cette demande ?")) {
      deletePersonalShopperRequest(id);
      if (document.getElementById("admin-tab-container")) {
        refreshAdminActiveTab();
      } else {
        updateModals();
      }
    }
  },

  // Membres Carte Privilège Admin
  handleDeleteLoyaltyMember(id) {
    if (confirm("Supprimer cet adhérent de la Carte Privilège ?")) {
      deleteLoyaltyMember(id);
      showToast("Adhérent supprimé.", "gold");
      if (document.getElementById("admin-tab-container")) {
        refreshAdminActiveTab();
      } else {
        updateModals();
      }
    }
  },

  // Messages de Contact Admin
  handleUpdateContactStatus(id, status) {
    updateContactStatus(id, status);
    showToast(`Statut du message : ${status}`, "success");
    if (document.getElementById("admin-tab-container")) {
      refreshAdminActiveTab();
    } else {
      updateModals();
    }
  },
  handleDeleteContact(id) {
    if (confirm("Supprimer ce message client ?")) {
      deleteContact(id);
      showToast("Message supprimé.", "gold");
      if (document.getElementById("admin-tab-container")) {
        refreshAdminActiveTab();
      } else {
        updateModals();
      }
    }
  },

  // Analytics Clics Admin
  handleResetAnalytics() {
    if (confirm("Réinitialiser tous les compteurs de clics ?")) {
      resetAnalyticsClicks();
      showToast("Compteurs analytiques réinitialisés.", "gold");
      if (document.getElementById("admin-tab-container")) {
        refreshAdminActiveTab();
      } else {
        updateModals();
      }
    }
  },

  // Recharger Données Factices Complètes
  reloadAllDummyData() {
    reloadAllDummyData();
    showToast("✨ Données factices réalistes rechargées avec succès !", "gold");
    updateModals();
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#D4AF37', '#F3E5AB', '#FFFFFF']
    });
  },

  // Upload d'image pour le QR Code Wave
  handleWaveQrUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const urlInput = document.getElementById("set-wave-qrcode");
      if (urlInput) urlInput.value = dataUrl;
      const previewImg = document.getElementById("wave-qrcode-admin-preview");
      if (previewImg) previewImg.src = dataUrl;
      showToast("Nouveau QR Code Wave prêt ! Cliquez sur « Mettre à Jour » pour enregistrer.", "info");
    };
    reader.readAsDataURL(file);
  },

  // Paramètres Boutique Admin
  handleSaveSettings(e) {
    e.preventDefault();
    const slogan = document.getElementById("set-slogan").value.trim();
    const announcement = document.getElementById("set-announcement").value.trim();
    const whatsappDisplay = document.getElementById("set-whatsapp").value.trim();
    const phoneServiceDisplay = document.getElementById("set-phone").value.trim();
    const days = document.getElementById("set-days").value.trim();
    const hours = document.getElementById("set-hours").value.trim();
    const landmark = document.getElementById("set-landmark").value.trim();

    const current = getStoreSettings();
    const waveDisplay = document.getElementById("set-wave") ? document.getElementById("set-wave").value.trim() : (current.contacts.waveDisplay || "+225 07 77 02 72 35");
    const wavePaymentUrl = document.getElementById("set-wave-url") ? document.getElementById("set-wave-url").value.trim() : (current.contacts.wavePaymentUrl || "https://pay.wave.com/m/M_CI_mallofbeauty");
    const waveQrCode = document.getElementById("set-wave-qrcode") ? document.getElementById("set-wave-qrcode").value.trim() : (current.contacts.waveQrCode || "/imgs/wave_qr_code.svg");

    updateStoreSettings({
      slogan,
      announcement,
      contacts: {
        ...current.contacts,
        whatsappDisplay,
        whatsapp: whatsappDisplay.replace(/[^0-9+]/g, ''),
        phoneServiceDisplay,
        phoneService: phoneServiceDisplay.replace(/[^0-9+]/g, ''),
        waveDisplay,
        wave: waveDisplay.replace(/[^0-9+]/g, ''),
        wavePaymentUrl,
        waveQrCode
      },
      openingHours: {
        ...current.openingHours,
        days,
        hours
      },
      address: {
        ...current.address,
        landmark
      }
    });

    showToast("Paramètres généraux & Wave mis à jour avec succès !", "success");
    updateModals();
    renderApp();
  },

  // Sauvegarde & Reset
  exportDatabase() {
    const backupData = {
      products: getProducts(),
      appointments: getAppointments(),
      personalShopper: getPersonalShopperRequests(),
      settings: getStoreSettings(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mall_of_beauty_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Sauvegarde exportée avec succès.", "success");
  },
  confirmResetFactory() {
    if (confirm("⚠️ Attention : Restaurer les données initiales de l'interview réinitialisera tous les produits et réglages. Continuer ?")) {
      resetToFactory();
      showToast("Données réinitialisées aux valeurs d'origine.", "gold");
      updateModals();
      renderApp();
    }
  }
};

// Abonnement aux changements de données (CRUD réactif)
subscribeToDataChanges(() => {
  updateModals();
});

// Tracking global des clics Call to Action (CTA) & Réseaux Sociaux
document.addEventListener("click", (e) => {
  const target = e.target.closest("a, button");
  if (!target) return;

  if (target.dataset && target.dataset.track) {
    trackClick(target.dataset.track, target.title || target.textContent.trim());
    return;
  }

  const href = target.getAttribute("href") || "";
  if (href.startsWith("tel:")) {
    trackClick("phone_call", "Appel GSM (" + href.replace("tel:", "") + ")");
  } else if (href.includes("wa.me")) {
    trackClick("whatsapp", "WhatsApp Direct");
  } else if (href.includes("instagram.com")) {
    trackClick("instagram", "Visite Instagram");
  } else if (href.includes("tiktok.com")) {
    trackClick("tiktok", "Visite TikTok");
  }
});

// Lancement au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
  updateModals();
});
