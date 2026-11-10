import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/admin.css";

import confetti from "canvas-confetti";
import { 
  renderAdminDashboard, setEditingProductId, toggleAddProductFormState,
  setEditingGalleryId, toggleAddGalleryFormState,
  switchAdminTabLive, refreshAdminActiveTab,
  renderAnalyticsEventsTableMarkup, getEventBadge
} from "./components/AdminDashboard.js";

import { 
  getProducts, getProductById, addProduct, updateProduct, deleteProduct, toggleFeatured,
  getAppointments, addAppointment, updateAppointmentStatus, deleteAppointment,
  getPersonalShopperRequests, addPersonalShopperRequest, updatePersonalShopperStatus, updatePersonalShopperDeposit, deletePersonalShopperRequest,
  getLoyaltyMembers, addLoyaltyMember, deleteLoyaltyMember,
  getContacts, addContact, updateContactStatus, deleteContact,
  getAnalyticsClicks, trackClick, resetAnalyticsClicks, getPaginatedAnalyticsEvents,
  getStoreSettings, updateStoreSettings, resetToFactory, reloadAllDummyData,
  getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, resetGalleryImages,
  subscribeToDataChanges, initData
} from "./data/storage.js";

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = "success") {
  let toastRoot = document.getElementById("toast-root");
  if (!toastRoot) {
    toastRoot = document.createElement("div");
    toastRoot.id = "toast-root";
    document.body.appendChild(toastRoot);
  }

  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 3000;
    background: ${type === 'success' ? '#10B981' : type === 'gold' ? '#D4AF37' : '#2563EB'};
    color: ${type === 'gold' ? '#0A0A0C' : '#FFFFFF'};
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

// --- INITIALISATION DU DASHBOARD ---
function initAdmin() {
  const root = document.getElementById("admin-root");
  if (!root) return;
  root.innerHTML = renderAdminDashboard("products");
}

// --- INTERFACE GLOBALE WINDOW.MOB ---
window.MoB = window.MoB || {};

window.MoB.closeAdminModal = () => {
  window.location.href = "/";
};

window.MoB.switchAdminTab = (tab) => {
  switchAdminTabLive(tab);
};

// --- CLOUDINARY UPLOAD & DESTROY HELPERS ---
async function uploadToCloudinary(file, folder = "mallofbeauty_assets/products") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: formData
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Erreur d'upload (${res.status})`);
  }
  return data;
}

async function deleteFromCloudinary(urlOrPublicId) {
  if (!urlOrPublicId) return;
  try {
    const res = await fetch("/api/upload-image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlOrPublicId })
    });
    return await res.json();
  } catch (err) {
    console.warn("Échec de la suppression Cloudinary:", err);
    return null;
  }
}

window.MoB.toggleAddProductForm = () => {
  toggleAddProductFormState();
  refreshAdminActiveTab();
  setTimeout(() => {
    if (typeof window.MoB.renderProductGalleryThumbnails === "function") {
      window.MoB.renderProductGalleryThumbnails();
    }
  }, 50);
};

window.MoB.cancelProductEdit = () => {
  setEditingProductId(null);
  refreshAdminActiveTab();
};

window.MoB.renderProductGalleryThumbnails = () => {
  const container = document.getElementById("product-gallery-thumbnails-wrap");
  if (!container) return;

  const mainImgInput = document.getElementById("form-product-image");
  const galleryInput = document.getElementById("form-product-gallery");
  const mainImg = mainImgInput ? mainImgInput.value.trim() : "";

  let gallery = [];
  try {
    gallery = JSON.parse(galleryInput?.value || "[]");
  } catch (e) {
    gallery = [];
  }

  if (mainImg && !gallery.includes(mainImg)) {
    gallery.unshift(mainImg);
    if (galleryInput) galleryInput.value = JSON.stringify(gallery);
  }

  if (!gallery || gallery.length === 0) {
    container.innerHTML = `
      <div style="color: #94A3B8; font-size: 0.82rem; font-style: italic; padding: 12px; width: 100%; text-align: center;">
        Aucune photo dans la galerie. Utilisez le bouton « Choisir une photo depuis mon ordinateur » ci-dessus pour téléverser votre premier visuel sur Cloudinary.
      </div>
    `;
    return;
  }

  container.innerHTML = gallery.map((imgUrl) => {
    const isMain = imgUrl === mainImg;
    const safeUrl = imgUrl.replace(/'/g, "\\'");
    return `
      <div class="product-gallery-thumb-card ${isMain ? 'active-main' : ''}" title="${isMain ? 'Photo Principale Active' : 'Cliquer pour définir comme principale'}">
        <img src="${imgUrl}" alt="Visuel Produit" onerror="this.src='https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg'">
        ${isMain ? `<span class="product-thumb-badge-main">★ Actif</span>` : ''}
        <div class="product-thumb-actions-overlay">
          ${!isMain ? `
            <button type="button" class="btn-thumb-action" onclick="window.MoB.setAsMainProductImage('${safeUrl}')" title="Revenir sur cette ancienne photo et la définir comme principale">
              ★ Activer
            </button>
          ` : `
            <span style="color: #D4AF37; font-size: 0.65rem; font-weight: 800; text-align: center; text-transform: uppercase;">Actuelle</span>
          `}
          <button type="button" class="btn-thumb-action" style="color: #DC2626;" onclick="window.MoB.deleteProductGalleryImage('${safeUrl}')" title="Supprimer définitivement cette photo">
            🗑️ Supprimer
          </button>
        </div>
      </div>
    `;
  }).join("");
};

window.MoB.handleProductFileUpload = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const spinner = document.getElementById("product-upload-spinner");
  if (spinner) spinner.style.display = "inline-flex";

  try {
    const result = await uploadToCloudinary(file, "mallofbeauty_assets/products");
    if (result.success && result.url) {
      const cdnUrl = result.url;
      const imgInput = document.getElementById("form-product-image");
      const previewImg = document.getElementById("form-product-main-preview");
      const galInput = document.getElementById("form-product-gallery");

      if (imgInput) imgInput.value = cdnUrl;
      if (previewImg) previewImg.src = cdnUrl;

      let gallery = [];
      try {
        gallery = JSON.parse(galInput?.value || "[]");
      } catch (e) {
        gallery = [];
      }

      // Conserver l'historique : ajouter la nouvelle photo en tête de liste et dédoublonner
      gallery = [cdnUrl, ...gallery.filter(url => url !== cdnUrl)];
      if (galInput) galInput.value = JSON.stringify(gallery);

      window.MoB.renderProductGalleryThumbnails();
      showToast("✨ Photo téléversée sur Cloudinary et définie comme principale !", "success");
    } else {
      throw new Error(result.error || "Échec du téléversement");
    }
  } catch (err) {
    alert("Erreur lors de l'envoi de la photo vers Cloudinary : " + (err.message || err));
  } finally {
    if (spinner) spinner.style.display = "none";
    event.target.value = "";
  }
};

window.MoB.setAsMainProductImage = (imgUrl) => {
  const imgInput = document.getElementById("form-product-image");
  const previewImg = document.getElementById("form-product-main-preview");
  if (imgInput) imgInput.value = imgUrl;
  if (previewImg) previewImg.src = imgUrl;

  window.MoB.renderProductGalleryThumbnails();
  showToast("Photo principale mise à jour avec succès !", "info");
};

window.MoB.deleteProductGalleryImage = async (imgUrl) => {
  if (!confirm("Voulez-vous supprimer définitivement cette photo ? Elle sera retirée de la galerie de ce produit et effacée du stockage cloud Cloudinary.")) {
    return;
  }

  const galInput = document.getElementById("form-product-gallery");
  const imgInput = document.getElementById("form-product-image");
  const previewImg = document.getElementById("form-product-main-preview");

  let gallery = [];
  try {
    gallery = JSON.parse(galInput?.value || "[]");
  } catch (e) {
    gallery = [];
  }

  gallery = gallery.filter(url => url !== imgUrl);
  if (galInput) galInput.value = JSON.stringify(gallery);

  const currentMain = imgInput?.value || "";
  if (currentMain === imgUrl) {
    const newMain = gallery[0] || "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg";
    if (imgInput) imgInput.value = newMain;
    if (previewImg) previewImg.src = newMain;
  }

  window.MoB.renderProductGalleryThumbnails();

  // Purge asynchrone sur Cloudinary
  if (imgUrl.includes("cloudinary.com")) {
    deleteFromCloudinary(imgUrl);
  }

  showToast("Photo supprimée avec succès.", "gold");
};

window.MoB.selectProductPresetImage = (imgUrl) => {
  const imgInput = document.getElementById("form-product-image");
  const previewImg = document.getElementById("form-product-main-preview");
  const galInput = document.getElementById("form-product-gallery");

  if (imgInput) imgInput.value = imgUrl;
  if (previewImg) previewImg.src = imgUrl;

  let gallery = [];
  try {
    gallery = JSON.parse(galInput?.value || "[]");
  } catch (e) {
    gallery = [];
  }

  if (!gallery.includes(imgUrl)) {
    gallery.unshift(imgUrl);
    if (galInput) galInput.value = JSON.stringify(gallery);
  }

  window.MoB.renderProductGalleryThumbnails();
  showToast("Photo de la boutique sélectionnée !", "info");
};

window.MoB.startEditProduct = (id) => {
  const p = getProductById(id);
  if (!p) return;
  setEditingProductId(id);
  refreshAdminActiveTab();

  setTimeout(() => {
    const nameInput = document.getElementById("form-product-name");
    if (!nameInput) return;
    nameInput.value = p.name;
    const brandInput = document.getElementById("form-product-brand");
    if (brandInput) brandInput.value = p.brand;
    const catInput = document.getElementById("form-product-category");
    if (catInput) catInput.value = p.category;
    const priceInput = document.getElementById("form-product-price");
    if (priceInput) priceInput.value = p.price;
    const oldPriceInput = document.getElementById("form-product-oldprice");
    if (oldPriceInput) oldPriceInput.value = p.oldPrice || "";
    const stockInput = document.getElementById("form-product-stock");
    if (stockInput) stockInput.value = p.stock;
    const shortDescInput = document.getElementById("form-product-shortdesc");
    if (shortDescInput) shortDescInput.value = p.shortDesc || "";
    const descInput = document.getElementById("form-product-desc");
    if (descInput) descInput.value = p.description || "";
    const usageInput = document.getElementById("form-product-usage");
    if (usageInput) usageInput.value = p.usage || "";
    const imgInput = document.getElementById("form-product-image");
    if (imgInput) imgInput.value = p.image || "";
    const previewImg = document.getElementById("form-product-main-preview");
    if (previewImg) previewImg.src = p.image || "https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669195/mallofbeauty_assets/devanture_face.jpg";
    const galInput = document.getElementById("form-product-gallery");
    const productGallery = Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []);
    if (galInput) galInput.value = JSON.stringify(productGallery);
    const featInput = document.getElementById("form-product-featured");
    if (featInput) featInput.checked = !!p.isFeatured;

    window.MoB.renderProductGalleryThumbnails();
    document.getElementById("product-form-box")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
};

window.MoB.handleSaveProduct = (e) => {
  if (e) e.preventDefault();
  const idEl = document.getElementById("form-product-id");
  const id = idEl ? idEl.value : null;
  const name = document.getElementById("form-product-name")?.value.trim() || "";
  const brand = document.getElementById("form-product-brand")?.value.trim() || "";
  const category = document.getElementById("form-product-category")?.value || "soins-visage";
  const price = Number(document.getElementById("form-product-price")?.value || 0);
  const oldPriceVal = document.getElementById("form-product-oldprice")?.value;
  const oldPrice = oldPriceVal ? Number(oldPriceVal) : null;
  const stock = Number(document.getElementById("form-product-stock")?.value || 0);
  const shortDesc = document.getElementById("form-product-shortdesc")?.value.trim() || "";
  const description = document.getElementById("form-product-desc")?.value.trim() || "";
  const usage = document.getElementById("form-product-usage")?.value.trim() || "";
  const image = document.getElementById("form-product-image")?.value.trim() || "";
  const isFeatured = document.getElementById("form-product-featured")?.checked || false;

  let gallery = [];
  try {
    gallery = JSON.parse(document.getElementById("form-product-gallery")?.value || "[]");
  } catch (err) {
    gallery = [];
  }
  if (image && !gallery.includes(image)) {
    gallery.unshift(image);
  }
  if (gallery.length === 0 && image) {
    gallery = [image];
  }

  const productPayload = {
    name, brand, category, price, oldPrice, stock,
    shortDesc, description, usage, image, gallery, isFeatured
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
  refreshAdminActiveTab();
};

window.MoB.handleDeleteProduct = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit du catalogue ?")) {
    deleteProduct(id);
    showToast("Produit supprimé du catalogue.", "gold");
    refreshAdminActiveTab();
  }
};

window.MoB.handleToggleFeatured = (id) => {
  toggleFeatured(id);
  refreshAdminActiveTab();
};

window.MoB.handleUpdateAppointmentStatus = (id, newStatus) => {
  updateAppointmentStatus(id, newStatus);
  showToast(`Statut du RDV mis à jour : ${newStatus}`, "info");
  refreshAdminActiveTab();
};

window.MoB.handleDeleteAppointment = (id) => {
  if (confirm("Supprimer définitivement ce rendez-vous ?")) {
    deleteAppointment(id);
    showToast("Rendez-vous supprimé.", "gold");
    refreshAdminActiveTab();
  }
};

window.MoB.handleUpdatePSDeposit = (id, depositStatus) => {
  updatePersonalShopperDeposit(id, depositStatus);
  showToast(`Acompte mis à jour : ${depositStatus}`, "info");
  refreshAdminActiveTab();
};

window.MoB.handleUpdatePSStatus = (id, newStatus) => {
  updatePersonalShopperStatus(id, newStatus);
  showToast(`Statut commande mis à jour : ${newStatus}`, "info");
  refreshAdminActiveTab();
};

window.MoB.handleDeletePS = (id) => {
  if (confirm("Supprimer cette demande Personal Shopper ?")) {
    deletePersonalShopperRequest(id);
    showToast("Demande supprimée.", "gold");
    refreshAdminActiveTab();
  }
};

window.MoB.handleDeleteLoyaltyMember = (id) => {
  if (confirm("Supprimer cet adhérent de la Carte Privilège ?")) {
    deleteLoyaltyMember(id);
    showToast("Adhérent supprimé.", "gold");
    refreshAdminActiveTab();
  }
};

window.MoB.handleUpdateContactStatus = (id, newStatus) => {
  updateContactStatus(id, newStatus);
  showToast(`Statut du message : ${newStatus}`, "info");
  refreshAdminActiveTab();
};

window.MoB.handleDeleteContact = (id) => {
  if (confirm("Supprimer ce message de contact ?")) {
    deleteContact(id);
    showToast("Message supprimé.", "gold");
    refreshAdminActiveTab();
  }
};

window.MoB.handleResetAnalytics = async () => {
  const confirmation = prompt(
    "📦 ARCHIVAGE DU TRAFIC & RÉINITIALISATION :\n\nCette action va condenser et archiver tout l'historique actuel dans MongoDB, puis remettre les compteurs à zéro.\n\nPour confirmer, tapez « mob » :"
  );

  if (confirmation === null) {
    return; // Annulé par l'utilisateur
  }

  if (confirmation.trim().toLowerCase() === "mob") {
    showToast("Archivage et réinitialisation en cours...", "gold");
    await resetAnalyticsClicks();
    showToast("Trafic archivé dans MongoDB et compteurs remis à zéro !", "success");
    cachedAnalyticsEventsData = null;
    refreshAdminActiveTab();
    if (typeof window.MoB.loadAnalyticsEventsPage === "function") {
      window.MoB.loadAnalyticsEventsPage(1);
    }
  } else {
    showToast("Action annulée : mot de confirmation incorrect.", "danger");
  }
};

// --- VERCEL WEB ANALYTICS INTÉGRATION API ---
let cachedVercelData = null;
let isFetchingVercel = false;

window.MoB.loadVercelAnalytics = async (force = false) => {
  const container = document.getElementById("vercel-analytics-section");
  if (!container) return;

  if (cachedVercelData && !force) {
    renderVercelAnalyticsUI(cachedVercelData, container);
    return;
  }

  if (isFetchingVercel) return;
  isFetchingVercel = true;

  container.innerHTML = `
    <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 28px; text-align: center; color: #64748B;">
      <div style="font-size: 1.8rem; margin-bottom: 8px;">🌐</div>
      <div style="font-weight: 700; color: #0F172A; font-size: 1rem;">Connexion à Vercel Web Analytics en direct...</div>
      <div style="font-size: 0.82rem; margin-top: 4px;">Récupération des visiteurs, pages vues, canaux d'acquisition et géolocalisation.</div>
    </div>
  `;

  try {
    const res = await fetch("/api/vercel-analytics");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    cachedVercelData = data;
    renderVercelAnalyticsUI(data, container);
  } catch (err) {
    container.innerHTML = `
      <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 14px; padding: 20px; color: #92400E;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <strong style="color: #78350F; font-size: 0.95rem;">⚠️ Connexion Vercel en attente</strong>
            <div style="font-size: 0.82rem; margin-top: 4px;">Le serveur n'a pas pu contacter l'API Vercel (${err.message || 'Erreur réseau'}).</div>
          </div>
          <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.loadVercelAnalytics(true)">Réessayer</button>
        </div>
      </div>
    `;
  } finally {
    isFetchingVercel = false;
  }
};

function renderVercelAnalyticsUI(data, container) {
  if (!container) return;

  if (!data || data.configured === false) {
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border: 1.5px solid rgba(212, 175, 55, 0.4); border-radius: 14px; padding: 24px; color: #F8FAFC;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🌐</span>
              <strong style="color: #F8FAFC; font-size: 1.05rem;">Vercel Web Analytics — Liaison API</strong>
              <span class="badge" style="background: #334155; color: #94A3B8; border: 1px solid #475569; font-size: 0.72rem;">En attente de déploiement</span>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 0.84rem; color: #CBD5E1; line-height: 1.5; max-width: 650px;">
              Les variables <code>VERCEL_TOKEN</code> et <code>VERCEL_PROJECT_ID</code> sont renseignées sur votre dashboard Vercel. Dès le redéploiement effectif sur Vercel, les statistiques détaillées (visiteurs uniques, pages vues, canaux d'acquisition, pays) s'afficheront automatiquement ici.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-gold btn-sm" onclick="window.MoB.loadVercelAnalytics(true)">
              🔄 Tester la Connexion
            </button>
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold btn-sm" style="text-decoration: none;">
              Console Vercel ↗
            </a>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Configuration valide reçue
  const overview = data.overview || {};
  const totalVisitors = overview.total ?? overview.visitors ?? 0;
  const totalPageViews = overview.pageViews ?? overview.views ?? 0;

  const extractRows = (obj) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.rows)) return obj.rows;
    return [];
  };

  const paths = extractRows(data.byPath);
  const referrers = extractRows(data.byReferrer);
  const countries = extractRows(data.byCountry);
  const devices = extractRows(data.byDevice);

  const getRowVal = (r) => Number(r.pageViews || r.visitors || r.total || r.count || r.value || 0);
  const getRowKey = (r, defaultKey) => String(r[defaultKey] ?? r.key ?? r.name ?? "");

  const formatPathLabel = (p) => {
    if (!p || p === "/" || p === "") return "🏠 Page d'Accueil & Vitrine";
    if (p === "/admin" || p.startsWith("/admin")) return "⚙️ Administration";
    if (p.startsWith("/produit/")) {
      const id = p.replace("/produit/", "");
      return `🛍️ Fiche Produit (${id})`;
    }
    return p;
  };

  const formatReferrerLabel = (ref) => {
    if (!ref || ref === "" || ref === "direct" || ref === "(direct)") return "🔗 Accès Direct / Liens Partagés";
    const r = ref.toLowerCase();
    if (r.includes("instagram")) return "📷 Instagram (@mallofbeauty_mofb)";
    if (r.includes("tiktok")) return "🎵 TikTok (@mallofbeauty1)";
    if (r.includes("whatsapp") || r.includes("wa.me")) return "💬 WhatsApp Direct";
    if (r.includes("google")) return "🔍 Recherche Google";
    if (r.includes("facebook")) return "📘 Facebook";
    return `🌐 ${ref}`;
  };

  const countryMap = {
    CI: { name: "Côte d'Ivoire (Abidjan)", flag: "🇨🇮" },
    FR: { name: "France", flag: "🇫🇷" },
    US: { name: "États-Unis", flag: "🇺🇸" },
    SN: { name: "Sénégal", flag: "🇸🇳" },
    ML: { name: "Mali", flag: "🇲🇱" },
    BF: { name: "Burkina Faso", flag: "🇧🇫" },
    GH: { name: "Ghana", flag: "🇬🇭" },
    TG: { name: "Togo", flag: "🇹🇬" },
    BJ: { name: "Bénin", flag: "🇧🇯" },
    CM: { name: "Cameroun", flag: "🇨🇲" },
    CA: { name: "Canada", flag: "🇨🇦" },
    GB: { name: "Royaume-Uni", flag: "🇬🇧" },
    BE: { name: "Belgique", flag: "🇧🇪" },
    CH: { name: "Suisse", flag: "🇨🇭" }
  };

  const formatCountryLabel = (c) => {
    if (!c) return "🌍 Inconnu";
    const code = c.toUpperCase();
    if (countryMap[code]) return `${countryMap[code].flag} ${countryMap[code].name}`;
    return `🌍 ${code}`;
  };

  const formatDeviceLabel = (d) => {
    const l = (d || "").toLowerCase();
    if (l === "mobile") return "📱 Smartphone / Mobile";
    if (l === "desktop") return "💻 Ordinateur / PC";
    if (l === "tablet") return "📟 Tablette";
    return `📱 ${d || 'Autre'}`;
  };

  const topCountry = countries.length > 0 ? formatCountryLabel(getRowKey(countries[0], "country")) : "Côte d'Ivoire 🇨🇮";
  const mobileDevice = devices.find(d => getRowKey(d, "deviceType").toLowerCase() === "mobile");
  const mobilePct = totalVisitors > 0 && mobileDevice ? Math.round((getRowVal(mobileDevice) / totalVisitors) * 100) : 85;

  container.innerHTML = `
    <!-- Bandeau Statut Vercel -->
    <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 22px; color: #FFFFFF; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10B981; box-shadow: 0 0 10px #10B981;"></span>
          <strong style="font-size: 1.05rem; letter-spacing: -0.2px;">Vercel Web Analytics en Direct</strong>
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.72rem; font-weight: 700;">
            Connecté & Synchronisé
          </span>
        </div>
        <div style="font-size: 0.8rem; color: #94A3B8;">
          Période : 30 derniers jours (${data.period?.since || ''} → ${data.period?.until || ''})
        </div>
      </div>

      <!-- 4 Compteurs Clés Vercel -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 18px;">
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 14px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">👥 Visiteurs Uniques</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #FFFFFF; margin-top: 4px; font-family: var(--font-serif);">${totalVisitors}</div>
          <div style="font-size: 0.72rem; color: #34D399; margin-top: 2px;">Audience nette 30j</div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 14px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">👁️ Pages Vues Totales</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #F59E0B; margin-top: 4px; font-family: var(--font-serif);">${totalPageViews}</div>
          <div style="font-size: 0.72rem; color: #94A3B8; margin-top: 2px;">Volume de navigation</div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 14px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">📱 Trafic Mobile</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #38BDF8; margin-top: 4px; font-family: var(--font-serif);">${mobilePct}%</div>
          <div style="font-size: 0.72rem; color: #94A3B8; margin-top: 2px;">Smartphones & tablettes</div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 14px;">
          <div style="font-size: 0.72rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">🌍 Pays Principal</div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #FFFFFF; margin-top: 8px; line-height: 1.3;">${topCountry}</div>
          <div style="font-size: 0.72rem; color: #94A3B8; margin-top: 4px;">Zone géographique N°1</div>
        </div>
      </div>
    </div>

    <!-- Grille Détaillée Multi-Angles : OÙ, COMMENT, QUAND -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-bottom: 24px;">
      
      <!-- 1. OÙ : Pages & Produits les plus vus -->
      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h5 style="margin: 0; font-size: 0.95rem; color: #0F172A; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <span>🗺️</span> <span>OÙ : Pages & Produits les plus visités</span>
          </h5>
          <span style="font-size: 0.75rem; color: #64748B;">Top Pages</span>
        </div>

        ${paths.length === 0 ? `
          <div style="padding: 20px; text-align: center; color: #64748B; font-size: 0.82rem; background: #F8FAFC; border-radius: 8px;">
            En attente des premières consultations de pages enregistrées par Vercel.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${paths.slice(0, 7).map(row => {
              const count = getRowVal(row);
              const path = getRowKey(row, "requestPath");
              const label = formatPathLabel(path);
              const pct = totalPageViews > 0 ? Math.round((count / totalPageViews) * 100) : 100;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
                    <span style="color: #0F172A; font-weight: 600;">${label}</span>
                    <strong style="color: #2563EB;">${count} vue${count > 1 ? 's' : ''} (${pct}%)</strong>
                  </div>
                  <div style="width: 100%; height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: #2563EB; border-radius: 3px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- 2. COMMENT : Canaux & Sources Référentes -->
      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h5 style="margin: 0; font-size: 0.95rem; color: #0F172A; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <span>🚀</span> <span>COMMENT : Canaux & Provenance</span>
          </h5>
          <span style="font-size: 0.75rem; color: #64748B;">Referrers</span>
        </div>

        ${referrers.length === 0 ? `
          <div style="padding: 20px; text-align: center; color: #64748B; font-size: 0.82rem; background: #F8FAFC; border-radius: 8px;">
            En attente des premiers référents (Instagram, TikTok, WhatsApp, Direct).
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${referrers.slice(0, 7).map(row => {
              const count = getRowVal(row);
              const ref = getRowKey(row, "referrerHostname");
              const label = formatReferrerLabel(ref);
              const pct = totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 100;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
                    <span style="color: #0F172A; font-weight: 600;">${label}</span>
                    <strong style="color: #059669;">${count} visiteur${count > 1 ? 's' : ''}</strong>
                  </div>
                  <div style="width: 100%; height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: #059669; border-radius: 3px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- 3. OÙ : Répartition Géographique (Pays) -->
      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h5 style="margin: 0; font-size: 0.95rem; color: #0F172A; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <span>🌍</span> <span>OÙ : Répartition Géographique</span>
          </h5>
          <span style="font-size: 0.75rem; color: #64748B;">Pays</span>
        </div>

        ${countries.length === 0 ? `
          <div style="padding: 20px; text-align: center; color: #64748B; font-size: 0.82rem; background: #F8FAFC; border-radius: 8px;">
            Données de géolocalisation en cours d'enregistrement.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${countries.slice(0, 6).map(row => {
              const count = getRowVal(row);
              const c = getRowKey(row, "country");
              const label = formatCountryLabel(c);
              const pct = totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 100;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
                    <span style="color: #0F172A; font-weight: 600;">${label}</span>
                    <strong style="color: #D97706;">${count} (${pct}%)</strong>
                  </div>
                  <div style="width: 100%; height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: #D97706; border-radius: 3px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- 4. COMMENT : Appareils & Systèmes -->
      <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h5 style="margin: 0; font-size: 0.95rem; color: #0F172A; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <span>📱</span> <span>COMMENT : Appareils & Systèmes</span>
          </h5>
          <span style="font-size: 0.75rem; color: #64748B;">Équipements</span>
        </div>

        ${devices.length === 0 ? `
          <div style="padding: 20px; text-align: center; color: #64748B; font-size: 0.82rem; background: #F8FAFC; border-radius: 8px;">
            Données d'appareils en cours d'enregistrement.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${devices.map(row => {
              const count = getRowVal(row);
              const d = getRowKey(row, "deviceType");
              const label = formatDeviceLabel(d);
              const pct = totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 100;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
                    <span style="color: #0F172A; font-weight: 600;">${label}</span>
                    <strong style="color: #7C3AED;">${count} (${pct}%)</strong>
                  </div>
                  <div style="width: 100%; height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${pct}%; height: 100%; background: #7C3AED; border-radius: 3px;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

    </div>
  `;
}

// --- HISTORIQUE D'INTERACTIONS PAGINÉ MONGODB (ARCHIVE ILLIMITÉE) ---
let currentEventsPageState = {
  page: 1,
  limit: 20,
  type: 'all'
};
let isFetchingEventsPage = false;
let cachedAnalyticsEventsData = null;

window.MoB.getCurrentEventsPage = () => currentEventsPageState.page;

window.MoB.getCachedAnalyticsTotal = () => {
  if (cachedAnalyticsEventsData && typeof cachedAnalyticsEventsData.total === "number") {
    return cachedAnalyticsEventsData.total;
  }
  return null;
};

window.MoB.getCachedAnalyticsEventsHtml = () => {
  if (cachedAnalyticsEventsData && Array.isArray(cachedAnalyticsEventsData.items)) {
    const openSessionIds = new Set();
    const container = document.getElementById("admin-analytics-events-container");
    if (container) {
      container.querySelectorAll("details[open][data-session-id]").forEach(d => {
        const sid = d.getAttribute("data-session-id");
        if (sid) openSessionIds.add(sid);
      });
    }
    return renderAnalyticsEventsTableMarkup({
      ...cachedAnalyticsEventsData,
      openSessionIds
    });
  }
  return null;
};

window.MoB.loadAnalyticsEventsPage = async (page = 1, limit = currentEventsPageState.limit, type = currentEventsPageState.type) => {
  currentEventsPageState.page = page;
  currentEventsPageState.limit = limit;
  currentEventsPageState.type = type;

  const container = document.getElementById("admin-analytics-events-container");
  if (!container) return;

  const openSessionIds = new Set();
  container.querySelectorAll("details[open][data-session-id]").forEach(d => {
    const sid = d.getAttribute("data-session-id");
    if (sid) openSessionIds.add(sid);
  });

  if (isFetchingEventsPage) return;
  isFetchingEventsPage = true;

  try {
    const data = await getPaginatedAnalyticsEvents(page, limit, type);
    cachedAnalyticsEventsData = {
      items: data.items || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || 1,
      selectedType: type
    };

    // Mettre à jour les badges si type === 'all'
    if (type === 'all' && typeof data.total === 'number') {
      const badges = document.querySelectorAll('[data-tab-badge="analytics"]');
      badges.forEach(b => { b.textContent = data.total; });
      const totalHeaderBadge = document.querySelector("#analytics-total-clicks-badge");
      if (totalHeaderBadge) totalHeaderBadge.textContent = `${data.total} clics au total`;
    }

    container.innerHTML = renderAnalyticsEventsTableMarkup({
      ...cachedAnalyticsEventsData,
      openSessionIds
    });
  } catch (err) {
    console.error("Erreur lors du chargement des événements paginés", err);
    showToast("Erreur lors de la pagination des événements", "danger");
  } finally {
    isFetchingEventsPage = false;
  }
};

window.MoB.filterAnalyticsEvents = (type) => {
  window.MoB.loadAnalyticsEventsPage(1, currentEventsPageState.limit, type);
};

window.MoB.exportAnalyticsEventsCSV = async () => {
  showToast("Préparation de l'export CSV complet...", "gold");
  try {
    const res = await fetch("/api/analytics_events?export=true");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = data.items || [];

    if (items.length === 0) {
      showToast("Aucune interaction à exporter.", "info");
      return;
    }

    const headers = ["ID", "Date", "Heure", "Type d'action", "Détail de l'action", "Page / URL", "Horodatage ISO"];
    const escapeCsv = (val) => {
      const s = String(val ?? "").replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = items.map(item => [
      escapeCsv(item.id || ""),
      escapeCsv(item.dateFormatted || ""),
      escapeCsv(item.timeFormatted || ""),
      escapeCsv(item.type || ""),
      escapeCsv(item.label || ""),
      escapeCsv(item.path || "/"),
      escapeCsv(item.timestamp || "")
    ].join(","));

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mall_of_beauty_interactions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast(`Export de ${items.length} interaction${items.length > 1 ? 's' : ''} réussi !`, "success");
  } catch (err) {
    console.error("Erreur export CSV:", err);
    showToast("Impossible d'exporter le fichier CSV", "danger");
  }
};

// --- GESTION & CONSULTATION DES ARCHIVES MONGODB ---
let cachedArchivesList = [];

function formatArchiveDate(dateStr) {
  if (!dateStr) return "Date inconnue";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return dateStr;
  }
}

function formatPeriodDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return dateStr;
  }
}

window.MoB.openAnalyticsArchivesModal = async () => {
  const oldModal = document.getElementById("mob-analytics-archives-modal");
  if (oldModal) oldModal.remove();

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "mob-analytics-archives-modal";
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.78);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  `;

  modalOverlay.innerHTML = `
    <div style="background: #FFFFFF; border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.3); width: 100%; max-width: 880px; max-height: 88vh; display: flex; flex-direction: column; overflow: hidden; border: 1.5px solid #E2E8F0;">
      <!-- Entête Modale -->
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 18px 24px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #D4AF37;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #D4AF37; color: #0F172A; width: 34px; height: 34px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800;">
            🗄️
          </span>
          <div>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #F8FAFC;">Archives Historiques du Trafic & Sessions</h3>
            <span style="font-size: 0.78rem; color: #94A3B8;">Consultation des snapshots condensés et sauvegardés dans MongoDB Atlas</span>
          </div>
        </div>
        <button onclick="window.MoB.closeAnalyticsArchivesModal()" style="background: transparent; border: none; color: #94A3B8; font-size: 1.4rem; cursor: pointer; padding: 4px; line-height: 1;" title="Fermer">&times;</button>
      </div>

      <!-- Corps Défilable -->
      <div id="mob-archives-modal-body" style="flex: 1; overflow-y: auto; padding: 24px; background: #FAFBFD;">
        <div style="text-align: center; padding: 40px 20px; color: #64748B;">
          <div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>
          <div style="font-weight: 700; color: #0F172A;">Chargement des archives depuis MongoDB...</div>
        </div>
      </div>

      <!-- Pied de page -->
      <div style="padding: 14px 24px; background: #FFFFFF; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <span style="font-size: 0.78rem; color: #64748B;">
          💡 Les archives sont stockées sous format condensé pour préserver les quotas de la base de données.
        </span>
        <button type="button" class="btn btn-dark btn-sm" onclick="window.MoB.closeAnalyticsArchivesModal()">Fermer</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Charger les données
  await window.MoB.refreshAnalyticsArchivesList();
};

window.MoB.closeAnalyticsArchivesModal = () => {
  const modal = document.getElementById("mob-analytics-archives-modal");
  if (modal) modal.remove();
};

window.MoB.refreshAnalyticsArchivesList = async () => {
  const body = document.getElementById("mob-archives-modal-body");
  if (!body) return;

  try {
    const res = await fetch("/api/analytics_archives");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cachedArchivesList = Array.isArray(data) ? data : [];

    // Trier de la plus récente à la plus ancienne
    cachedArchivesList.sort((a, b) => new Date(b.archivedAt || 0) - new Date(a.archivedAt || 0));

    if (cachedArchivesList.length === 0) {
      body.innerHTML = `
        <div style="padding: 48px 24px; text-align: center; color: #64748B; background: #FFFFFF; border-radius: 14px; border: 1.5px dashed #CBD5E1;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📦</div>
          <div style="font-weight: 700; color: #0F172A; font-size: 1.05rem;">Aucune archive de trafic enregistrée pour l'instant.</div>
          <div style="font-size: 0.85rem; margin-top: 6px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.5;">
            Lorsque vous cliquez sur le bouton <strong>« Archiver & Réinitialiser »</strong> dans l'onglet des statistiques, l'historique complet est automatiquement sauvegardé ici sous forme condensée.
          </div>
        </div>
      `;
      return;
    }

    body.innerHTML = `
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <span style="font-size: 0.85rem; font-weight: 700; color: #0F172A;">
          ${cachedArchivesList.length} archive${cachedArchivesList.length > 1 ? 's' : ''} conservée${cachedArchivesList.length > 1 ? 's' : ''} dans MongoDB
        </span>
        <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.refreshAnalyticsArchivesList()" style="font-size: 0.78rem;">
          🔄 Actualiser
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${cachedArchivesList.map((a) => {
          const m = a.metrics || {};
          const p = a.period || {};
          const fromStr = formatPeriodDate(p.from);
          const toStr = formatPeriodDate(p.to);
          const periodLabel = (fromStr && toStr) ? (fromStr === toStr ? fromStr : `${fromStr} au ${toStr}`) : "Période";
          const compact = Array.isArray(a.eventsCompact) ? a.eventsCompact : [];

          // Regrouper les événements compacts par session ID (position [5])
          const sessionMap = new Map();
          compact.forEach(evt => {
            const sid = evt[5] || "sess_legacy";
            if (!sessionMap.has(sid)) sessionMap.set(sid, []);
            sessionMap.get(sid).push(evt);
          });
          const sessionsCount = sessionMap.size;

          return `
            <div class="luxury-card" style="padding: 20px; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
              <!-- Entête de l'archive -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: #0F172A; color: #D4AF37; font-size: 0.85rem;">📦</span>
                    <strong style="color: #0F172A; font-size: 0.98rem;">Archive du ${periodLabel}</strong>
                    <span class="badge" style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; font-weight: 800; font-size: 0.75rem;">
                      ${a.totalClicks || 0} clics
                    </span>
                    ${compact.length > 0 ? `
                      <span class="badge" style="background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; font-weight: 700; font-size: 0.72rem;">
                        ${sessionsCount} session${sessionsCount > 1 ? 's' : ''} (${compact.length} actions)
                      </span>
                    ` : ''}
                  </div>
                  <div style="font-size: 0.78rem; color: #64748B; margin-top: 5px;">
                    Archivée le <strong>${formatArchiveDate(a.archivedAt)}</strong>
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn btn-outline-gold btn-sm" onclick="window.MoB.exportSingleArchiveCSV('${a.id}')" title="Télécharger cette archive au format CSV" style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem;">
                    <span>📥 Exporter CSV</span>
                  </button>
                  <button type="button" class="btn btn-outline-danger btn-sm" onclick="window.MoB.deleteSingleArchive('${a.id}')" title="Supprimer définitivement cette archive" style="color: #DC2626; border-color: #FECACA; background: #FEF2F2; font-size: 0.78rem;">
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Grille des métriques -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(105px, 1fr)); gap: 8px; margin-bottom: 12px;">
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #2563EB;">${m.phone_call || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">📞 Appels GSM</div>
                </div>
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #059669;">${m.whatsapp || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">💬 WhatsApp</div>
                </div>
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #DB2777;">${m.instagram || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">📷 Instagram</div>
                </div>
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #0891B2;">${m.tiktok || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">🎵 TikTok</div>
                </div>
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #D97706;">${m.booking || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">📅 RDV Salon</div>
                </div>
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #7C3AED;">${m.shopper || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">🛍️ Concierge</div>
                </div>
                <div style="padding: 8px 10px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: #BE185D;">${m.loyalty || 0}</div>
                  <div style="font-size: 0.7rem; color: #64748B; margin-top: 2px;">💳 Privilège</div>
                </div>
              </div>

              <!-- Parcours détaillé ou note de synthèse -->
              ${compact.length > 0 ? `
                <details class="session-foldable-group" style="border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; margin-top: 10px;">
                  <summary style="background: #F8FAFC; padding: 10px 14px; font-size: 0.82rem; font-weight: 700; color: #0F172A; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span>🔍</span>
                      <span>Consulter les ${compact.length} interactions (${sessionsCount} session${sessionsCount > 1 ? 's' : ''})</span>
                    </div>
                    <span class="session-chevron" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #E2E8F0; font-size: 0.75rem;">▼</span>
                  </summary>
                  <div class="admin-table-wrap" style="margin: 0; border: none; border-top: 1px solid #E2E8F0; max-height: 280px; overflow-y: auto;">
                    <table class="admin-table" style="margin: 0; font-size: 0.78rem;">
                      <thead>
                        <tr style="background: #FFFFFF;">
                          <th style="padding: 6px 12px;">Date & Heure</th>
                          <th style="padding: 6px 12px;">Canal</th>
                          <th style="padding: 6px 12px;">Détails</th>
                          <th style="padding: 6px 12px;">Page</th>
                          <th style="padding: 6px 12px;">Session ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${compact.map((evt, eIdx) => `
                          <tr style="${eIdx % 2 === 0 ? 'background: #FFFFFF;' : 'background: #FAFAFA;'}">
                            <td style="padding: 8px 12px;"><strong>${evt[0] || ''} ${evt[1] || ''}</strong></td>
                            <td style="padding: 8px 12px;">${getEventBadge(evt[2])}</td>
                            <td style="padding: 8px 12px; font-weight: 600; color: #0F172A;">${evt[3] || evt[2]}</td>
                            <td style="padding: 8px 12px;"><code style="background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem;">${evt[4] || '/'}</code></td>
                            <td style="padding: 8px 12px; font-family: monospace; color: #2563EB; font-size: 0.72rem;">${evt[5] ? evt[5].replace(/^sess_/, '#') : '-'}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </details>
              ` : `
                <div style="font-size: 0.76rem; color: #64748B; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px;">
                  <span>ℹ️</span>
                  <span>Archive de synthèse globale (conserve la répartition des ${a.totalClicks || 0} clics de cette période).</span>
                </div>
              `}
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (err) {
    console.error("Erreur lors de la récupération des archives:", err);
    body.innerHTML = `
      <div style="background: #FFF1F2; border: 1.5px solid #FECDD3; border-radius: 12px; padding: 20px; color: #991B1B; text-align: center;">
        <strong style="font-size: 0.95rem;">Impossible de charger les archives depuis MongoDB.</strong>
        <p style="font-size: 0.82rem; margin: 6px 0 12px 0;">Vérifiez votre connexion internet ou réessayez.</p>
        <button class="btn btn-outline-danger btn-sm" onclick="window.MoB.refreshAnalyticsArchivesList()">Réessayer</button>
      </div>
    `;
  }
};

window.MoB.exportSingleArchiveCSV = (archiveId) => {
  const archive = cachedArchivesList.find(a => a.id === archiveId);
  if (!archive) {
    showToast("Archive introuvable.", "danger");
    return;
  }

  const escapeCsv = (val) => {
    const s = String(val ?? "").replace(/"/g, '""');
    return `"${s}"`;
  };

  const compact = Array.isArray(archive.eventsCompact) ? archive.eventsCompact : [];
  let csvContent = "";

  if (compact.length > 0) {
    const headers = ["Date", "Heure", "Type d'action", "Détail de l'action", "Page / URL", "Session ID"];
    const rows = compact.map(row => [
      escapeCsv(row[0] || ""),
      escapeCsv(row[1] || ""),
      escapeCsv(row[2] || ""),
      escapeCsv(row[3] || ""),
      escapeCsv(row[4] || ""),
      escapeCsv(row[5] || "")
    ].join(","));
    csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  } else {
    const m = archive.metrics || {};
    const headers = ["Canal / Indicateur", "Nombre de conversions"];
    const rows = [
      ["Total Clics CTA", archive.totalClicks || 0],
      ["Appels Directs GSM", m.phone_call || 0],
      ["Commandes WhatsApp", m.whatsapp || 0],
      ["Visites Instagram", m.instagram || 0],
      ["Vidéos TikTok", m.tiktok || 0],
      ["RDV Conseils Validés", m.booking || 0],
      ["Demandes Personal Shopper", m.shopper || 0],
      ["Adhésions Carte Privilège", m.loyalty || 0]
    ].map(([k, v]) => `${escapeCsv(k)},${escapeCsv(v)}`);
    csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mall_of_beauty_archive_${archive.id}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  showToast("Téléchargement du CSV de l'archive démarré !", "success");
};

window.MoB.deleteSingleArchive = async (archiveId) => {
  if (!confirm("Voulez-vous vraiment supprimer cette archive historique de MongoDB Atlas ?\nCette opération est irréversible.")) {
    return;
  }

  showToast("Suppression de l'archive...", "gold");
  try {
    const res = await fetch(`/api/analytics_archives?id=${encodeURIComponent(archiveId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    showToast("Archive supprimée avec succès.", "success");
    await window.MoB.refreshAnalyticsArchivesList();
  } catch (err) {
    console.error("Erreur suppression archive:", err);
    showToast("Impossible de supprimer l'archive.", "danger");
  }
};

window.MoB.toggleGalleryForm = () => {
  toggleAddGalleryFormState();
  refreshAdminActiveTab();
};

window.MoB.startEditGalleryItem = (id) => {
  setEditingGalleryId(id);
  refreshAdminActiveTab();
};

window.MoB.handleGalleryFileUpload = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const spinner = document.getElementById("gal-upload-spinner");
  const statusEl = document.getElementById("gal-upload-status");
  const inputSrc = document.getElementById("gal-input-src");
  const previewImg = document.getElementById("gal-preview-img");

  if (spinner) spinner.style.display = "inline-flex";
  if (statusEl) statusEl.textContent = "Téléversement vers Cloudinary en cours...";

  try {
    const res = await uploadToCloudinary(file, "mallofbeauty_assets/gallery");
    if (res.success && res.url) {
      if (inputSrc) inputSrc.value = res.url;
      if (previewImg) previewImg.src = res.url;
      if (statusEl) statusEl.innerHTML = "<span style='color: #10B981; font-weight: 700;'>✓ Photo téléversée sur Cloudinary</span>";
      showToast("Photo boutique hébergée sur Cloudinary avec succès !", "success");
    } else {
      throw new Error(res.error || "Erreur lors du téléversement");
    }
  } catch (err) {
    alert("Erreur lors de l'envoi de la photo : " + (err.message || err));
    if (statusEl) statusEl.textContent = "Erreur de téléversement";
  } finally {
    if (spinner) spinner.style.display = "none";
    event.target.value = "";
  }
};

window.MoB.selectGalleryPreset = (src, caption) => {
  const inputSrc = document.getElementById("gal-input-src");
  const inputCap = document.getElementById("gal-input-caption");
  const preview = document.getElementById("gal-preview-img");
  if (inputSrc) inputSrc.value = src;
  if (inputCap) inputCap.value = caption;
  if (preview) preview.src = src;
};

window.MoB.handleSaveGalleryItem = (e) => {
  if (e) e.preventDefault();
  const editId = document.getElementById("gal-edit-id")?.value;
  const src = document.getElementById("gal-input-src")?.value.trim();
  const caption = document.getElementById("gal-input-caption")?.value.trim();
  if (!src || !caption) {
    showToast("Veuillez renseigner la photo et la légende", "error");
    return;
  }
  if (editId) {
    updateGalleryImage(editId, { src, caption });
    showToast("Photo mise à jour avec succès !", "success");
  } else {
    addGalleryImage({ src, caption });
    showToast("Nouvelle photo ajoutée à la galerie !", "success");
  }
  setEditingGalleryId(null);
  refreshAdminActiveTab();
};

window.MoB.handleDeleteGalleryItem = async (id) => {
  if (confirm("Voulez-vous vraiment supprimer cette photo de la galerie ? Elle sera retirée de la boutique et effacée de Cloudinary.")) {
    const allImages = getGalleryImages();
    const item = allImages.find(img => img.id === id);
    if (item && item.src && item.src.includes("cloudinary.com")) {
      deleteFromCloudinary(item.src);
    }
    deleteGalleryImage(id);
    showToast("Photo retirée de la galerie.", "gold");
    refreshAdminActiveTab();
  }
};

window.MoB.handleResetGallery = () => {
  if (confirm("Restaurer les 8 photos d'origine de la boutique ?")) {
    resetGalleryImages();
    showToast("Photos d'origine restaurées !", "gold");
    refreshAdminActiveTab();
  }
};

// --- MODALE HAUTE SÉCURITÉ DE RÉINITIALISATION MONGODB (3 ÉTAPES) ---
window.MoB.openResetDatabaseModal = () => {
  const oldModal = document.getElementById("mob-reset-security-modal");
  if (oldModal) oldModal.remove();

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "mob-reset-security-modal";
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.78);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
  `;

  function renderModalStep(step) {
    let stepContent = "";

    if (step === 1) {
      stepContent = `
        <div style="background: #FFF1F2; border: 1.5px solid #FECDD3; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; color: #991B1B; font-weight: 700; font-size: 0.95rem; margin-bottom: 8px;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.1rem; color: #DC2626;"></i>
            <span>Avertissement Critique • Confirmation 1 sur 3</span>
          </div>
          <p style="font-size: 0.88rem; color: #7F1D1D; margin: 0; line-height: 1.5;">
            Vous êtes sur le point de déclencher la <strong>réinitialisation totale de la base de données MongoDB Atlas</strong> (collections <code>products</code>, <code>appointments</code>, <code>personal_shopper</code>, <code>loyalty_members</code>, <code>contacts</code>, etc.).
          </p>
        </div>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-bottom: 24px;">
          <h5 style="margin: 0 0 8px 0; color: #0F172A; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Ce qui va se passer :</h5>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.83rem; color: #475569; line-height: 1.6;">
            <li>Tous les produits actuels seront écrasés et réinitialisés aux <strong>1 113 produits d'origine</strong> avec leurs images Cloudinary.</li>
            <li>Les réservations, demandes VIP et formulaires récents seront réinitialisés avec le jeu de test initial.</li>
            <li>Cette action est <strong>immédiate et irréversible</strong> sur votre cluster distant MongoDB.</li>
          </ul>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="btn btn-outline-dark btn-sm" onclick="window.MoB.closeResetDatabaseModal()">Annuler</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.MoB.goToResetStep(2)">
            Compris, Passer à l'Étape 2 / 3 →
          </button>
        </div>
      `;
    } else if (step === 2) {
      stepContent = `
        <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; color: #92400E; font-weight: 700; font-size: 0.95rem; margin-bottom: 8px;">
            <i class="fa-solid fa-lock" style="font-size: 1.1rem; color: #D97706;"></i>
            <span>Vérification d'Intention • Confirmation 2 sur 3</span>
          </div>
          <p style="font-size: 0.86rem; color: #78350F; margin: 0; line-height: 1.5;">
            Pour prouver que vous n'effectuez pas cette manipulation par erreur, veuillez saisir la clé de sécurité suivante dans le champ :
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 18px;">
          <div style="display: inline-block; background: #0F172A; color: #F8FAFC; padding: 10px 24px; border-radius: 8px; font-family: monospace; font-size: 1.15rem; font-weight: 700; letter-spacing: 2px; user-select: all; border: 1.5px solid #D4AF37;">
            REINITIALISER MONGODB
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 0.8rem; font-weight: 600; color: #334155; margin-bottom: 6px;">Saisie de vérification :</label>
          <input type="text" id="reset-security-code-input" placeholder="Tapez exactement : REINITIALISER MONGODB" autocomplete="off" style="width: 100%; padding: 12px 14px; border-radius: 8px; border: 2px solid #CBD5E1; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.2s;" oninput="window.MoB.checkResetSecurityCode()" />
          <div id="reset-code-feedback" style="font-size: 0.78rem; color: #64748B; margin-top: 6px;">Le bouton restera verrouillé tant que le texte exact n'est pas saisi.</div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="btn btn-outline-dark btn-sm" onclick="window.MoB.goToResetStep(1)">← Retour</button>
          <button type="button" id="btn-step-2-next" class="btn btn-danger btn-sm" disabled style="opacity: 0.5; cursor: not-allowed;" onclick="window.MoB.goToResetStep(3)">
            Déverrouiller l'Étape Finale (3/3) →
          </button>
        </div>
      `;
    } else if (step === 3) {
      stepContent = `
        <div style="background: #FEF2F2; border: 2px solid #DC2626; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; color: #991B1B; font-weight: 800; font-size: 1rem; margin-bottom: 8px;">
            <i class="fa-solid fa-radiation" style="font-size: 1.25rem; color: #DC2626;"></i>
            <span>Dernière Confirmation • Confirmation 3 sur 3</span>
          </div>
          <p style="font-size: 0.88rem; color: #7F1D1D; margin: 0; line-height: 1.5; font-weight: 600;">
            Attention : Vous êtes sur le point d'écraser définitivement la base MongoDB Atlas en direct.
          </p>
        </div>

        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; user-select: none;">
            <input type="checkbox" id="reset-final-checkbox" style="width: 20px; height: 20px; margin-top: 2px; accent-color: #DC2626; cursor: pointer;" onchange="window.MoB.toggleFinalResetButton()" />
            <span style="font-size: 0.85rem; color: #1E293B; line-height: 1.5; font-weight: 600;">
              Je confirme que je souhaite remplacer irréversiblement toutes les collections actuelles de MongoDB Atlas par les données de démonstration d'origine.
            </span>
          </label>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="btn btn-outline-dark btn-sm" onclick="window.MoB.closeResetDatabaseModal()">Annuler</button>
          <button type="button" id="btn-execute-final-reset" class="btn btn-danger btn-sm" disabled style="opacity: 0.5; cursor: not-allowed; display: inline-flex; align-items: center; gap: 8px;" onclick="window.MoB.executeMongoDBReset()">
            <i class="fa-solid fa-trash-can"></i>
            <span>Écraser et Réinitialiser MongoDB</span>
          </button>
        </div>
      `;
    }

    modalOverlay.innerHTML = `
      <div style="background: #FFFFFF; border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.3); width: 100%; max-width: 540px; overflow: hidden; border: 1px solid #E2E8F0;">
        <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 20px 24px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #DC2626; color: #FFF; width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem;">
              <i class="fa-solid fa-shield-halved"></i>
            </span>
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #F8FAFC;">Réinitialisation Sécurisée MongoDB</h3>
              <span style="font-size: 0.75rem; color: #94A3B8;">Étape ${step} sur 3 • Protocole Anti-Accident</span>
            </div>
          </div>
          <button onclick="window.MoB.closeResetDatabaseModal()" style="background: transparent; border: none; color: #94A3B8; font-size: 1.2rem; cursor: pointer; padding: 4px;">&times;</button>
        </div>
        <div style="padding: 24px;">
          ${stepContent}
        </div>
      </div>
    `;
  }

  window.MoB.closeResetDatabaseModal = () => {
    modalOverlay.remove();
  };

  window.MoB.goToResetStep = (step) => {
    renderModalStep(step);
    if (step === 2) {
      setTimeout(() => {
        const input = document.getElementById("reset-security-code-input");
        if (input) input.focus();
      }, 50);
    }
  };

  window.MoB.checkResetSecurityCode = () => {
    const input = document.getElementById("reset-security-code-input");
    const nextBtn = document.getElementById("btn-step-2-next");
    const feedback = document.getElementById("reset-code-feedback");
    if (!input || !nextBtn) return;
    const value = input.value.trim();
    if (value === "REINITIALISER MONGODB") {
      input.style.borderColor = "#10B981";
      nextBtn.disabled = false;
      nextBtn.style.opacity = "1";
      nextBtn.style.cursor = "pointer";
      if (feedback) feedback.innerHTML = "<span style='color: #10B981; font-weight: 600;'>✓ Code de sécurité exact ! Vous pouvez continuer.</span>";
    } else {
      input.style.borderColor = "#CBD5E1";
      nextBtn.disabled = true;
      nextBtn.style.opacity = "0.5";
      nextBtn.style.cursor = "not-allowed";
      if (feedback) feedback.innerHTML = "<span style='color: #64748B;'>Tapez exactement <code>REINITIALISER MONGODB</code> en majuscules.</span>";
    }
  };

  window.MoB.toggleFinalResetButton = () => {
    const checkbox = document.getElementById("reset-final-checkbox");
    const execBtn = document.getElementById("btn-execute-final-reset");
    if (!checkbox || !execBtn) return;
    if (checkbox.checked) {
      execBtn.disabled = false;
      execBtn.style.opacity = "1";
      execBtn.style.cursor = "pointer";
    } else {
      execBtn.disabled = true;
      execBtn.style.opacity = "0.5";
      execBtn.style.cursor = "not-allowed";
    }
  };

  window.MoB.executeMongoDBReset = async () => {
    const execBtn = document.getElementById("btn-execute-final-reset");
    if (execBtn) {
      execBtn.disabled = true;
      execBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Réinitialisation MongoDB Atlas en cours...`;
    }

    try {
      await reloadAllDummyData();
      modalOverlay.remove();
      showToast("✨ Base MongoDB Atlas réinitialisée avec succès (1 113 produits & données démo) !", "gold");
      refreshAdminActiveTab();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          colors: ['#D4AF37', '#10B981', '#FFFFFF']
        });
      } catch (e) {}
    } catch (err) {
      alert("Erreur lors de la réinitialisation de MongoDB : " + (err.message || err));
      if (execBtn) {
        execBtn.disabled = false;
        execBtn.innerHTML = `Réessayer la réinitialisation`;
      }
    }
  };

  renderModalStep(1);
  document.body.appendChild(modalOverlay);
};

window.MoB.reloadAllDummyData = () => {
  window.MoB.openResetDatabaseModal();
};

window.MoB.confirmResetFactory = () => {
  window.MoB.openResetDatabaseModal();
};

window.MoB.handleWaveQrUpload = async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  showToast("Téléversement du QR Code Wave sur Cloudinary...", "info");
  try {
    const res = await uploadToCloudinary(file, "mallofbeauty_assets/store");
    if (res.success && res.url) {
      const urlInput = document.getElementById("set-wave-qrcode");
      if (urlInput) urlInput.value = res.url;
      const previewImg = document.getElementById("wave-qrcode-admin-preview");
      if (previewImg) previewImg.src = res.url;
      showToast("✓ QR Code Wave téléversé sur Cloudinary ! Cliquez sur « Mettre à Jour » pour sauvegarder.", "success");
    } else {
      throw new Error(res.error || "Erreur de téléversement");
    }
  } catch (err) {
    alert("Erreur lors de l'envoi du QR Code Wave vers Cloudinary : " + (err.message || err));
  } finally {
    e.target.value = "";
  }
};

window.MoB.handleSaveSettings = (e) => {
  if (e) e.preventDefault();
  const slogan = document.getElementById("set-slogan")?.value.trim() || "";
  const announcement = document.getElementById("set-announcement")?.value.trim() || "";
  const whatsappDisplay = document.getElementById("set-whatsapp")?.value.trim() || "";
  const phoneServiceDisplay = document.getElementById("set-phone")?.value.trim() || "";
  const days = document.getElementById("set-days")?.value.trim() || "";
  const hours = document.getElementById("set-hours")?.value.trim() || "";
  const landmark = document.getElementById("set-landmark")?.value.trim() || "";

  const current = getStoreSettings();
  const googleMapsUrl = document.getElementById("set-google-maps")?.value.trim() || current.contacts?.googleMapsUrl || "";
  const googleReviewWriteUrl = document.getElementById("set-google-review-url")?.value.trim() || current.contacts?.googleReviewWriteUrl || "";
  const googleRating = document.getElementById("set-google-rating")?.value.trim() || current.contacts?.googleRating || "4.9";
  const googleReviewCount = document.getElementById("set-google-count")?.value.trim() || current.contacts?.googleReviewCount || "128";
  const waveDisplay = document.getElementById("set-wave")?.value.trim() || current.contacts?.waveDisplay || "+225 07 77 02 72 35";
  const wavePaymentUrl = document.getElementById("set-wave-url")?.value.trim() || current.contacts?.wavePaymentUrl || "";
  const waveQrCode = document.getElementById("set-wave-qrcode")?.value.trim() || current.contacts?.waveQrCode || "";

  updateStoreSettings({
    slogan,
    announcement,
    contacts: {
      ...current.contacts,
      orderPhoneDisplay: current.contacts?.orderPhoneDisplay || whatsappDisplay,
      orderPhone: (current.contacts?.orderPhone || whatsappDisplay).replace(/[^0-9+]/g, ''),
      whatsappDisplay,
      whatsapp: whatsappDisplay.replace(/[^0-9+]/g, ''),
      phoneServiceDisplay,
      phoneService: phoneServiceDisplay.replace(/[^0-9+]/g, ''),
      waveDisplay,
      wave: waveDisplay.replace(/[^0-9+]/g, ''),
      wavePaymentUrl,
      waveQrCode,
      googleMapsUrl,
      googleReviewWriteUrl,
      googleRating,
      googleReviewCount
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
  refreshAdminActiveTab();
};

window.MoB.exportDatabase = () => {
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
};

window.MoB.syncFromDbNow = async () => {
  showToast("Synchronisation MongoDB en cours...", "gold");
  try {
    await initData();
    refreshAdminActiveTab();
    showToast("Synchronisation MongoDB terminée avec succès !", "success");
  } catch (err) {
    showToast("Erreur lors de la synchronisation", "danger");
  }
};

// Écoute des mises à jour asynchrones (ex: synchronisation MongoDB)
subscribeToDataChanges((event) => {
  if (event && event.type === "ANALYTICS_UPDATED" && event.stats && event.stats.total === 0) {
    cachedAnalyticsEventsData = null;
  }
  refreshAdminActiveTab();
});

// Montage initial
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmin);
} else {
  initAdmin();
}
