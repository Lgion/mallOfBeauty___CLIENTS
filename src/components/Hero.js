import { getStoreSettings } from "../data/storage.js";

export function renderHero() {
  const settings = getStoreSettings();

  return `
    <section class="hero-section" id="accueil">
      <div class="hero-bg-overlay"></div>
      
      <div class="container hero-content">
        <!-- Badge Distinction -->
        <div class="hero-pill-badge">
          <span style="color: var(--gold-primary);">👑</span>
          <span>Partenaire Officiel Vlisco • Près de 10 ans d'Excellence aux Vallons</span>
        </div>

        <!-- Slogan Officiel & Titre -->
        <h1 class="hero-title">
          <span class="text-gradient-gold">« ${settings.slogan} »</span><br>
          L'Élégance Pure à Abidjan
        </h1>

        <p class="hero-subtitle">
          Bienvenue au <strong>Mall of Beauty (MoB)</strong>. Découvrez nos rituels dermocosmétiques coréens et occidentaux, les soins doux pour bébé et maman, les pagnes Vlisco Grand Super de prestige, notre maroquinerie italienne et un service de conseil sur-mesure d'exception.
        </p>

        <!-- CTA Principaux en Arc de Cercle Élégant (Boutons Ronds / Médaillons de Prestige) -->
        <div class="hero-arc-wrapper">
          <svg class="hero-arc-curve-svg" viewBox="0 0 680 120" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="heroGoldArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.15"/>
                <stop offset="50%" stop-color="#FDE68A" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.15"/>
              </linearGradient>
            </defs>
            <path d="M 30 100 Q 340 10 650 100" fill="none" stroke="url(#heroGoldArcGrad)" stroke-width="2.5" stroke-dasharray="6,4"/>
          </svg>

          <div class="hero-arc-buttons">
            <!-- Bouton Rond 1 (Gauche) : Grand Catalogue -->
            <button class="hero-round-btn arc-left" id="hero-open-full-catalog-btn" title="Consulter le Grand Catalogue (1 136 articles certifiés)">
              <div class="round-btn-halo"></div>
              <span class="round-btn-icon prominent-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  <path d="M12 6l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" fill="var(--gold-primary)"/>
                </svg>
              </span>
              <span class="round-btn-title-minimal">Catalogue</span>
            </button>

            <!-- Bouton Rond 2 (Centre, Sommet de l'Arc) : Diagnostic & Soins Sur-Mesure -->
            <a href="#conseils" class="hero-round-btn arc-center" title="Prendre rendez-vous pour un diagnostic beauté dermo-expert">
              <div class="round-btn-halo pulse-halo"></div>
              <span class="round-btn-icon prominent-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M10 2h4M12 2v3M9 5h6M7 9h10a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a1 1 0 0 1 1-1z"/>
                  <path d="M12 12v4M10 14h4" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="round-btn-title-minimal">Diagnostic</span>
            </a>

            <!-- Bouton Rond 3 (Droite) : Appel Direct GSM -->
            <a href="tel:${settings.contacts.phoneService}" class="hero-round-btn arc-right" id="hero-call-gsm-btn" data-track="phone_call" title="Appeler directement l'accueil boutique">
              <div class="round-btn-halo"></div>
              <span class="round-btn-icon prominent-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  <path d="M14 2a8 8 0 0 1 8 8M14 6a4 4 0 0 1 4 4" stroke-linecap="round"/>
                </svg>
              </span>
              <span class="round-btn-title-minimal">Appeler</span>
            </a>
          </div>
        </div>

        <!-- Chiffres Clés & Réassurance -->
        <div class="hero-metrics">
          <div class="metric-item">
            <span class="metric-value">10 Ans</span>
            <span class="metric-label">De Réputation & Confiance</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">100%</span>
            <span class="metric-label">Produits Authentiques Certifiés</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">Express</span>
            <span class="metric-label">Livraison Yango & DHL Monde</span>
          </div>
        </div>
      </div>
    </section>
  `;
}
