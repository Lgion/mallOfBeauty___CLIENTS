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
