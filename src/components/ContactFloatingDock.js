import { getStoreSettings } from "../data/storage.js";

/**
 * Dock de Contact Flottant Fixé à Droite de l'Écran (Appel Direct GSM & WhatsApp)
 */
export function renderContactFloatingDock() {
  const settings = getStoreSettings();
  const phone = settings.contacts.orderPhone || "+2250777027235";
  const phoneDisplay = settings.contacts.orderPhoneDisplay || "+225 07 77 02 72 35";
  const waNumber = (settings.contacts.whatsapp || "+2250777027235").replace(/[^0-9]/g, '');
  const waMsg = encodeURIComponent("Bonjour Mall of Beauty, je souhaite passer commande ou demander un renseignement sur vos soins.");

  return `
    <aside class="contact-fixed-dock" id="contact-fixed-dock" aria-label="Contacts Directs et Commandes Rapides">
      <!-- 1. Bouton Appel Téléphonique Direct GSM -->
      <a 
        href="tel:${phone}" 
        class="contact-dock-btn contact-dock-phone" 
        id="dock-call-gsm-btn" 
        data-track="phone_call" 
        title="Appel Direct Boutique (${phoneDisplay})" 
        aria-label="Appeler la boutique"
      >
        <div class="contact-dock-arrow">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div class="contact-dock-content">
          <span class="contact-dock-label">Appel Direct</span>
          <span class="contact-dock-sub">${phoneDisplay}</span>
        </div>
        <div class="contact-dock-icon-wrap phone-icon-wrap">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span class="contact-dock-pulse phone-pulse"></span>
        </div>
        <span class="contact-dock-glow"></span>
      </a>

      <!-- 2. Bouton Chat & Commandes WhatsApp Direct -->
      <a 
        href="https://wa.me/${waNumber}?text=${waMsg}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="contact-dock-btn contact-dock-wa" 
        id="dock-whatsapp-btn" 
        data-track="whatsapp" 
        title="WhatsApp Boutique & Commandes (${settings.contacts.whatsappDisplay || phoneDisplay})" 
        aria-label="Écrire sur WhatsApp"
      >
        <div class="contact-dock-arrow">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div class="contact-dock-content">
          <span class="contact-dock-label">WhatsApp MoB</span>
          <span class="contact-dock-sub">Commandes 7j/7</span>
        </div>
        <div class="contact-dock-icon-wrap wa-icon-wrap">
          <svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
          <span class="contact-dock-pulse wa-pulse"></span>
        </div>
        <span class="contact-dock-glow"></span>
      </a>
    </aside>
  `;
}
