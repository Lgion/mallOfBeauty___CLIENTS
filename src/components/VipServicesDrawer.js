import { renderAdvisoryBooking } from "./AdvisoryBooking.js";
import { renderPersonalShopper } from "./PersonalShopper.js";
import { renderLoyaltyCard } from "./LoyaltyCard.js";

/**
 * 3 Boutons Flottants Fixés à Gauche de l'Écran (Dock VIP Haute Parfumerie)
 */
export function renderVipFloatingButtons() {
  return `
    <aside class="vip-fixed-dock" id="vip-fixed-dock" aria-label="Services VIP & Privilèges">
      <!-- Bouton 1 : Conseil Sur-Mesure / Diagnostic Dermo -->
      <button 
        type="button" 
        class="vip-dock-btn" 
        id="vip-btn-conseils" 
        onclick="window.MoB.openVipService('conseils')" 
        aria-label="Conseil Sur-Mesure et Diagnostic Beauté"
      >
        <div class="vip-dock-circle-inner vip-dock-icon-wrap">
          <span class="vip-dock-icon">
            <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <defs>
                <linearGradient id="vip-sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFF1F2"/>
                  <stop offset="45%" stop-color="#FB7185"/>
                  <stop offset="100%" stop-color="#FBBF24"/>
                </linearGradient>
                <linearGradient id="vip-sparkle-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="rgba(251, 113, 133, 0.35)"/>
                  <stop offset="100%" stop-color="rgba(251, 191, 36, 0.25)"/>
                </linearGradient>
              </defs>
              <path d="m12 2.5-2.2 6.2a1.8 1.8 0 0 1-1.1 1.1L2.5 12l6.2 2.2a1.8 1.8 0 0 1 1.1 1.1l2.2 6.2 2.2-6.2a1.8 1.8 0 0 1 1.1-1.1l6.2-2.2-6.2-2.2a1.8 1.8 0 0 1-1.1-1.1L12 2.5z" 
                    stroke="url(#vip-sparkle-grad)" stroke-width="1.8" fill="url(#vip-sparkle-fill)"/>
              <path d="M4.5 4v3M3 5.5h3" stroke="#FDE047" stroke-width="1.8"/>
              <path d="M19.5 17v3M18 18.5h3" stroke="#FDA4AF" stroke-width="1.8"/>
              <circle cx="12" cy="12" r="1.5" fill="#FFFBEB"/>
            </svg>
          </span>
        </div>
        <span class="vip-dock-pulse" aria-hidden="true"></span>
        <div class="dock-tooltip vip-dock-tooltip" role="tooltip">
          <div class="dock-tooltip-row">
            <span class="dock-tooltip-title">Conseil Sur-Mesure</span>
            <span class="dock-tooltip-badge">Offert</span>
          </div>
          <span class="dock-tooltip-sub">Diagnostic Dermo • 30 min</span>
        </div>
      </button>

      <!-- Bouton 2 : Conciergerie Privée / Personal Shopping -->
      <button 
        type="button" 
        class="vip-dock-btn" 
        id="vip-btn-conciergerie" 
        onclick="window.MoB.openVipService('conciergerie')" 
        aria-label="Conciergerie Privée et Personal Shopping"
      >
        <div class="vip-dock-circle-inner vip-dock-icon-wrap">
          <span class="vip-dock-icon">
            <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <defs>
                <linearGradient id="vip-diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#E0F2FE"/>
                  <stop offset="40%" stop-color="#38BDF8"/>
                  <stop offset="100%" stop-color="#0284C7"/>
                </linearGradient>
                <linearGradient id="vip-diamond-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="rgba(56, 189, 248, 0.45)"/>
                  <stop offset="100%" stop-color="rgba(2, 132, 199, 0.15)"/>
                </linearGradient>
              </defs>
              <polygon points="6,3 18,3 22,9.5 12,21.5 2,9.5" stroke="url(#vip-diamond-grad)" stroke-width="1.8" fill="url(#vip-diamond-fill)"/>
              <line x1="2" y1="9.5" x2="22" y2="9.5" stroke="#BAE6FD" stroke-width="1.5"/>
              <polyline points="6,3 9.5,9.5 12,21.5" stroke="url(#vip-diamond-grad)" stroke-width="1.4"/>
              <polyline points="18,3 14.5,9.5 12,21.5" stroke="url(#vip-diamond-grad)" stroke-width="1.4"/>
              <polygon points="9.5,9.5 12,3 14.5,9.5 12,21.5" fill="rgba(224, 242, 254, 0.3)"/>
              <circle cx="7" cy="6" r="0.9" fill="#FFFFFF"/>
            </svg>
          </span>
        </div>
        <span class="vip-dock-pulse" aria-hidden="true"></span>
        <div class="dock-tooltip vip-dock-tooltip" role="tooltip">
          <div class="dock-tooltip-row">
            <span class="dock-tooltip-title">Conciergerie Privée</span>
            <span class="dock-tooltip-badge">Sourcing VIP</span>
          </div>
          <span class="dock-tooltip-sub">Personal Shopping • Acompte 60%</span>
        </div>
      </button>

      <!-- Bouton 3 : Carte Privilège VIP Mall of Beauty -->
      <button 
        type="button" 
        class="vip-dock-btn" 
        id="vip-btn-fidelite" 
        onclick="window.MoB.openVipService('fidelite')" 
        aria-label="Carte Privilège et Club VIP Mall of Beauty"
      >
        <div class="vip-dock-circle-inner vip-dock-icon-wrap">
          <span class="vip-dock-icon">
            <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <defs>
                <linearGradient id="vip-crown-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FEF08A"/>
                  <stop offset="45%" stop-color="#F59E0B"/>
                  <stop offset="100%" stop-color="#D97706"/>
                </linearGradient>
                <linearGradient id="vip-crown-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="rgba(245, 158, 11, 0.4)"/>
                  <stop offset="100%" stop-color="rgba(217, 119, 6, 0.15)"/>
                </linearGradient>
              </defs>
              <path d="M2.5 5.5 5.5 17h13l3-11.5-5.5 6-4-7-4 7-4.5-6z" stroke="url(#vip-crown-grad)" stroke-width="1.8" fill="url(#vip-crown-fill)"/>
              <rect x="4.5" y="18" width="15" height="2.5" rx="1.2" stroke="url(#vip-crown-grad)" stroke-width="1.3" fill="rgba(254, 240, 138, 0.3)"/>
              <circle cx="2.5" cy="5.5" r="1.5" fill="#FEF08A" stroke="#F59E0B" stroke-width="0.8"/>
              <circle cx="21.5" cy="5.5" r="1.5" fill="#FEF08A" stroke="#F59E0B" stroke-width="0.8"/>
              <circle cx="12" cy="4.5" r="1.8" fill="#FDE047" stroke="#D97706" stroke-width="0.8"/>
              <circle cx="12" cy="14" r="1.4" fill="#EF4444"/>
              <circle cx="8" cy="14.5" r="1.1" fill="#10B981"/>
              <circle cx="16" cy="14.5" r="1.1" fill="#10B981"/>
            </svg>
          </span>
        </div>
        <span class="vip-dock-pulse" aria-hidden="true"></span>
        <div class="dock-tooltip vip-dock-tooltip" role="tooltip">
          <div class="dock-tooltip-row">
            <span class="dock-tooltip-title">Carte Privilège MoB</span>
            <span class="dock-tooltip-badge">Club VIP</span>
          </div>
          <span class="dock-tooltip-sub">Code Réduction • -10% Anniversaire</span>
        </div>
      </button>
    </aside>
  `;
}

/**
 * Le Grand Tiroir / Salon VIP avec Effet Wow Splendide
 */
export function renderVipDrawer(activeTab = "conseils", isClosing = false) {
  const tabs = [
    { 
      id: "conseils", 
      label: "Conseil Sur-Mesure", 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2.5-2.2 6.2a1.8 1.8 0 0 1-1.1 1.1L2.5 12l6.2 2.2a1.8 1.8 0 0 1 1.1 1.1l2.2 6.2 2.2-6.2a1.8 1.8 0 0 1 1.1-1.1l6.2-2.2-6.2-2.2a1.8 1.8 0 0 1-1.1-1.1L12 2.5z" stroke="#FB7185" stroke-width="2" fill="rgba(251, 113, 133, 0.3)"/><path d="M4.5 4v3M3 5.5h3" stroke="#FDE047" stroke-width="1.8"/></svg>`, 
      tag: "Diagnostic Dermo" 
    },
    { 
      id: "conciergerie", 
      label: "Conciergerie Privée", 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="6,3 18,3 22,9.5 12,21.5 2,9.5" stroke="#38BDF8" stroke-width="2" fill="rgba(56, 189, 248, 0.3)"/><line x1="2" y1="9.5" x2="22" y2="9.5" stroke="#BAE6FD" stroke-width="1.5"/></svg>`, 
      tag: "Personal Shopper" 
    },
    { 
      id: "fidelite", 
      label: "Carte Privilège", 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 5.5 5.5 17h13l3-11.5-5.5 6-4-7-4 7-4.5-6z" stroke="#F59E0B" stroke-width="2" fill="rgba(245, 158, 11, 0.3)"/><circle cx="12" cy="4.5" r="1.5" fill="#FDE047"/></svg>`, 
      tag: "Club VIP MoB" 
    }
  ];

  let bodyContent = "";
  if (activeTab === "conseils") {
    bodyContent = renderAdvisoryBooking();
  } else if (activeTab === "conciergerie") {
    bodyContent = renderPersonalShopper();
  } else if (activeTab === "fidelite") {
    bodyContent = renderLoyaltyCard();
  }

  return `
    <div 
      class="vip-drawer-backdrop ${isClosing ? 'closing' : 'active'}" 
      id="vip-drawer-backdrop" 
      onclick="if(event.target === this) window.MoB.closeVipService()"
    >
      <aside 
        class="vip-drawer-panel ${isClosing ? 'closing' : 'active'}" 
        id="vip-drawer-panel"
        role="dialog" 
        aria-modal="true" 
        aria-label="Salon Privé Mall of Beauty"
      >
        <!-- Barre Supérieure de Prestige & Navigation par Onglets -->
        <header class="vip-drawer-header">
          <div class="vip-drawer-brand">
            <div class="vip-drawer-crest">✦</div>
            <div class="vip-drawer-brand-text">
              <span class="vip-drawer-brand-title">SALON PRIVÉ & SERVICES EXCLUSIFS</span>
              <span class="vip-drawer-brand-sub">MALL OF BEAUTY • LES VALLONS ABIDJAN</span>
            </div>
          </div>

          <!-- Onglets Segmentés Or Champagne pour switcher instantanément -->
          <nav class="vip-drawer-nav">
            ${tabs.map(t => `
              <button 
                type="button" 
                class="vip-nav-tab ${activeTab === t.id ? 'active' : ''}" 
                onclick="window.MoB.switchVipTab('${t.id}')"
              >
                <span class="vip-nav-tab-icon">${t.icon}</span>
                <span class="vip-nav-tab-label">${t.label}</span>
              </button>
            `).join('')}
          </nav>

          <!-- Bouton de Fermeture Élégant -->
          <button 
            type="button" 
            class="vip-drawer-close-btn" 
            onclick="window.MoB.closeVipService()" 
            aria-label="Fermer le Salon Privé"
            title="Fermer (Échap)"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </header>

        <!-- Corps Déroulant avec le Contenu Actif -->
        <div class="vip-drawer-body" id="vip-drawer-body">
          <div class="vip-tab-content-active">
            ${bodyContent}
          </div>
        </div>
      </aside>
    </div>
  `;
}
