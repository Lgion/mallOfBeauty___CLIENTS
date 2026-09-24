/**
 * Transitions Artistiques & Thématiques Personnalisées
 * Spécifiquement sculptées pour chaque passage de bloc dans la page
 */

// 1. Transition Vitrine Produits -> Diagnostic & Conseils Beauté (Thème Dermo-Pureté & Soins)
export function renderTransitionProductsToAdvisory() {
  return `
    <div class="section-transition-wrap trans-dermo-purete" aria-hidden="true">
      <div class="transition-curve-container">
        <svg class="transition-wave-svg" viewBox="0 0 1440 110" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dermoWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.1"/>
              <stop offset="30%" stop-color="#34D399" stop-opacity="0.7"/>
              <stop offset="50%" stop-color="#FDE68A" stop-opacity="0.95"/>
              <stop offset="70%" stop-color="#34D399" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.1"/>
            </linearGradient>
            <filter id="dermoGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#10B981" flood-opacity="0.35"/>
            </filter>
          </defs>
          <!-- Double onde fluide évoquant la texture d'un sérum liquide -->
          <path d="M0,55 C280,95 440,20 720,55 C1000,90 1200,25 1440,55" fill="none" stroke="url(#dermoWaveGrad)" stroke-width="2.5" filter="url(#dermoGlow)"/>
          <path d="M0,70 C360,35 600,85 720,55 C840,25 1100,75 1440,40" fill="none" stroke="url(#dermoWaveGrad)" stroke-width="1" stroke-dasharray="4,6" opacity="0.6"/>
        </svg>
      </div>

      <div class="transition-floating-crest">
        <div class="crest-capsule dermo-theme">
          <span class="crest-icon-badge">🧴</span>
          <div class="crest-text-block">
            <span class="crest-tag">Dermo-Consultation & Écoute</span>
            <strong class="crest-title">Du Choix des Soins au Diagnostic Personnalisé aux Vallons</strong>
          </div>
          <span class="crest-icon-badge">💧</span>
        </div>
      </div>
    </div>
  `;
}

// 2. Transition Diagnostic Beauté -> Conciergerie & Personal Shopper (Thème Haute Couture & Vlisco)
export function renderTransitionAdvisoryToShopper() {
  return `
    <div class="section-transition-wrap trans-haute-couture" aria-hidden="true">
      <div class="transition-curve-container">
        <svg class="transition-wave-svg" viewBox="0 0 1440 110" preserveAspectRatio="none">
          <defs>
            <linearGradient id="coutureWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.15"/>
              <stop offset="35%" stop-color="#D4AF37" stop-opacity="0.85"/>
              <stop offset="50%" stop-color="#F59E0B" stop-opacity="1"/>
              <stop offset="65%" stop-color="#D4AF37" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.15"/>
            </linearGradient>
            <filter id="coutureGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#D4AF37" flood-opacity="0.4"/>
            </filter>
          </defs>
          <!-- Entrelacs inspirés du tissage des fils d'or Vlisco et de la maroquinerie -->
          <path d="M0,60 Q360,10 720,60 T1440,60" fill="none" stroke="url(#coutureWaveGrad)" stroke-width="2.5" filter="url(#coutureGlow)"/>
          <path d="M0,40 Q360,90 720,40 T1440,40" fill="none" stroke="url(#coutureWaveGrad)" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
        </svg>
      </div>

      <div class="transition-floating-crest">
        <div class="crest-capsule couture-theme">
          <span class="crest-icon-badge">💎</span>
          <div class="crest-text-block">
            <span class="crest-tag">Conciergerie Privée Internationale</span>
            <strong class="crest-title">Du Soin Quotidien au Sourcing d'Exception & Pagnes Rares</strong>
          </div>
          <span class="crest-icon-badge">✈️</span>
        </div>
      </div>
    </div>
  `;
}

// 3. Transition Personal Shopper -> Carte Privilège & Club VIP (Thème Couronne & Fidélité Royale)
export function renderTransitionShopperToLoyalty() {
  return `
    <div class="section-transition-wrap trans-cercle-privilege" aria-hidden="true">
      <div class="transition-curve-container">
        <svg class="transition-wave-svg" viewBox="0 0 1440 110" preserveAspectRatio="none">
          <defs>
            <linearGradient id="royaltyWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#EC4899" stop-opacity="0.15"/>
              <stop offset="35%" stop-color="#F59E0B" stop-opacity="0.8"/>
              <stop offset="50%" stop-color="#FDE68A" stop-opacity="1"/>
              <stop offset="65%" stop-color="#F59E0B" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#EC4899" stop-opacity="0.15"/>
            </linearGradient>
            <filter id="royaltyGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#F59E0B" flood-opacity="0.45"/>
            </filter>
          </defs>
          <!-- Arcs impériaux festonnés évoquant les couronnes d'apparat -->
          <path d="M0,75 C240,25 480,95 720,45 C960,95 1200,25 1440,75" fill="none" stroke="url(#royaltyWaveGrad)" stroke-width="2.5" filter="url(#royaltyGlow)"/>
          <path d="M200,60 C400,30 600,70 720,50 C840,70 1040,30 1240,60" fill="none" stroke="url(#royaltyWaveGrad)" stroke-width="1" stroke-dasharray="3,5" opacity="0.75"/>
        </svg>
      </div>

      <div class="transition-floating-crest">
        <div class="crest-capsule royal-theme">
          <span class="crest-icon-badge">👑</span>
          <div class="crest-text-block">
            <span class="crest-tag">Le Cercle Privilège MoB</span>
            <strong class="crest-title">Votre Fidélité Honorée • -10% Offerts à Votre Anniversaire</strong>
          </div>
          <span class="crest-icon-badge">⭐</span>
        </div>
      </div>
    </div>
  `;
}
