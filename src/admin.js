import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/admin.css";

import confetti from "canvas-confetti";
import { 
  renderAdminDashboard, setEditingProductId, toggleAddProductFormState,
  setEditingGalleryId, toggleAddGalleryFormState,
  switchAdminTabLive, refreshAdminActiveTab
} from "./components/AdminDashboard.js";

import { 
  getProducts, getProductById, addProduct, updateProduct, deleteProduct, toggleFeatured,
  getAppointments, addAppointment, updateAppointmentStatus, deleteAppointment,
  getPersonalShopperRequests, addPersonalShopperRequest, updatePersonalShopperStatus, updatePersonalShopperDeposit, deletePersonalShopperRequest,
  getLoyaltyMembers, addLoyaltyMember, deleteLoyaltyMember,
  getContacts, addContact, updateContactStatus, deleteContact,
  getAnalyticsClicks, trackClick, resetAnalyticsClicks,
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

window.MoB.toggleAddProductForm = () => {
  toggleAddProductFormState();
  refreshAdminActiveTab();
};

window.MoB.cancelProductEdit = () => {
  setEditingProductId(null);
  refreshAdminActiveTab();
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
    const featInput = document.getElementById("form-product-featured");
    if (featInput) featInput.checked = !!p.isFeatured;
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

  const productPayload = {
    name, brand, category, price, oldPrice, stock,
    shortDesc, description, usage, image, isFeatured
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

window.MoB.handleResetAnalytics = () => {
  if (confirm("Réinitialiser tous les compteurs de clics et conversions à zéro ?")) {
    resetAnalyticsClicks();
    showToast("Statistiques réinitialisées.", "info");
    refreshAdminActiveTab();
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
    showToast("Veuillez renseigner l'URL et la légende de la photo", "error");
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

window.MoB.handleDeleteGalleryItem = (id) => {
  if (confirm("Voulez-vous vraiment supprimer cette photo de la galerie ?")) {
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

window.MoB.reloadAllDummyData = () => {
  reloadAllDummyData();
  showToast("✨ Données factices réalistes rechargées avec succès !", "gold");
  initAdmin();
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      colors: ['#D4AF37', '#F3E5AB', '#FFFFFF']
    });
  } catch (e) {}
};

window.MoB.handleWaveQrUpload = (e) => {
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
subscribeToDataChanges(() => {
  refreshAdminActiveTab();
});

// Montage initial
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmin);
} else {
  initAdmin();
}
