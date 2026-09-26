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
          <img src="./imgs/logo.jpeg" alt="Logo Mall of Beauty" class="brand-logo-img">
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
            <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('conseils')" class="nav-link">Conseils & RDV</a></li>
            <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('conciergerie')" class="nav-link">Personal Shopper</a></li>
            <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('fidelite')" class="nav-link">Carte Privilège</a></li>
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
