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
          <span class="vip-dock-icon">💆‍♀️</span>
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
          <span class="vip-dock-icon">💎</span>
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
          <span class="vip-dock-icon">👑</span>
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
    { id: "conseils", label: "Conseil Sur-Mesure", icon: "💆‍♀️", tag: "Diagnostic Dermo" },
    { id: "conciergerie", label: "Conciergerie Privée", icon: "💎", tag: "Personal Shopper" },
    { id: "fidelite", label: "Carte Privilège", icon: "👑", tag: "Club VIP MoB" }
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
