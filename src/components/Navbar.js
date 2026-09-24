import { getCart, getStoreSettings } from "../data/storage.js";

export function renderNavbar() {
  const settings = getStoreSettings();
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calcul du statut d'ouverture en direct (GMT / Abidjan)
  const now = new Date();
  // Abidjan est à UTC/GMT (+00:00)
  const utcHours = now.getUTCHours();
  const utcDay = now.getUTCDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const isOpenDay = utcDay >= 1 && utcDay <= 6;
  const isOpenHour = utcHours >= 9 && utcHours < 19;
  const isOpenNow = isOpenDay && isOpenHour;

  return `
    <!-- Bandeau Annonce Défilant -->
    <div class="announcement-bar" id="announcement-bar">
      <span>✨ ${settings.announcement || "Partenaire Officiel Vlisco • Diagnostic Beauté & Conseils Sur-Mesure aux Vallons"}</span>
      <span class="badge badge-gold" style="font-size: 0.7rem; padding: 2px 8px;">Cocody Vallons</span>
    </div>

    <!-- Header Sticky -->
    <header class="site-header">
      <div class="container header-container">
        <!-- Logo & Titre -->
        <a href="#accueil" class="brand-logo-link">
          <img src="/imgs/logo.jpeg" alt="Logo Mall of Beauty" class="brand-logo-img">
          <div class="brand-text-block">
            <span class="brand-name">MALL OF BEAUTY</span>
            <span class="brand-sub">LES VALLONS • ABIDJAN</span>
          </div>
        </a>

        <!-- Liens Navigation Desktop -->
        <nav>
          <ul class="nav-links">
            <li><a href="#accueil" class="nav-link">Accueil</a></li>
            <li><a href="#catalogue" class="nav-link">Catalogue Phare</a></li>
            <li><a href="javascript:void(0)" class="nav-link" id="open-full-catalog-nav-btn" style="color: var(--gold-primary); font-weight: 700;">Grand Catalogue (1 136)</a></li>
            <li><a href="#conseils" class="nav-link">Conseils & RDV</a></li>
            <li><a href="#conciergerie" class="nav-link">Personal Shopper</a></li>
            <li><a href="#fidelite" class="nav-link">Carte Privilège</a></li>
            <li><a href="#communaute" class="nav-link">Réseaux Sociaux</a></li>
            <li><a href="#localisation" class="nav-link">Accès Boutique</a></li>
          </ul>
        </nav>

        <!-- Actions Droite -->
        <div class="header-actions">
          <!-- Statut Temps Réel -->
          <div class="live-status-pill ${isOpenNow ? 'open' : 'closed'}" title="Horaires : Lun-Sam 09h-19h">
            <span class="status-dot"></span>
            <span>${isOpenNow ? 'Boutique Ouverte' : 'Boutique Fermée (Ouvre à 9h)'}</span>
          </div>

          <!-- Appel Téléphonique Direct GSM (Icône Seule) -->
          <a href="tel:${settings.contacts.phoneService}" class="btn-call-icon" id="header-call-gsm-btn" data-track="phone_call" title="Appel direct boutique (${settings.contacts.phoneServiceDisplay})" aria-label="Appeler la boutique">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </a>

          <!-- WhatsApp Direct (Icône Seule) -->
          <a href="https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Bonjour Mall of Beauty, je souhaite un conseil personnalisé pour ma peau.")}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-icon" id="header-whatsapp-btn" data-track="whatsapp" title="WhatsApp boutique (${settings.contacts.whatsappDisplay})" aria-label="Écrire sur WhatsApp">
            <svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
          </a>

          <!-- Bouton Catalogue (Icône Seule - Ouvre le Grand Catalogue) -->
          <button type="button" class="btn-catalog-icon" id="header-catalog-btn" title="Grand Catalogue (1 136 Articles)" aria-label="Grand Catalogue">
            <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          <!-- Bouton Contact / Plan d'Accès Vallons -->
          <a href="#localisation" class="btn-call-icon btn-contact-icon" id="header-contact-btn" title="Nous rendre visite aux Vallons (Plan & Contact)" aria-label="Contact et Plan d'accès">
            <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </a>

          <!-- Bouton de Paiement Wave Côte d'Ivoire -->
          <button type="button" class="btn-wave-icon" id="header-wave-btn" onclick="window.MoB.openWaveModal()" title="Paiement Wave Côte d'Ivoire" aria-label="Paiement Wave CI">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="16" fill="#1DC3F4"/>
              <path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM14.2 21.5L9.5 16.8L11.2 15.1L14.2 18.1L20.8 11.5L22.5 13.2L14.2 21.5Z" fill="white"/>
            </svg>
          </button>

          <!-- Panier Trigger -->
          <button class="btn btn-icon cart-trigger-btn" id="open-cart-btn" aria-label="Voir le panier">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="cart-count-badge" id="header-cart-count">${totalItems}</span>
          </button>

          <!-- Bouton Gestion CRUD Admin -->
          <button class="btn btn-icon" id="open-admin-btn" title="Accès Back-Office CRUD Administrateur" aria-label="Administration">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
      </div>
    </header>
  `;
}
