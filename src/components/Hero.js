import { getStoreSettings, getGalleryImages } from "../data/storage.js";

export function renderHero(isGalleryUnfolded = false) {
  const settings = getStoreSettings();
  const galleryImages = getGalleryImages();
  const phone = settings?.contacts?.orderPhone || "+2250777027235";
  const phoneDisplay = settings?.contacts?.orderPhoneDisplay || "+225 07 77 02 72 35";
  const whatsappNum = (settings?.contacts?.whatsapp || phone).replace(/[^0-9]/g, '');

  return `
    <section class="hero-section" id="accueil">
      <div class="hero-bg-overlay"></div>
      
      <div class="container hero-content">
        <!-- Badge Distinction Épuré & Prestigieux -->
        <div class="hero-pill-badge">
          <span style="color: var(--gold-primary);">👑</span>
          <span>Mall of Beauty • L'Écrin d'Exception aux Vallons</span>
        </div>

        <!-- Slogan & Titre de Prestige -->
        <h1 class="hero-title">
          <span class="text-gradient-gold">« ${settings.slogan} »</span><br>
          Haute Cosmétique & Élégance à Abidjan
        </h1>

        <!-- Sous-titre Épuré & Focus Spécifique : 70% Produits Américains -->
        <p class="hero-subtitle">
          Spécialiste de référence aux Vallons : plus de <strong>70% de nos soins d'origine Américaine (USA)</strong> et rituels <b>K-Beauty certifiés</b>, pagnes <strong>Vlisco officiels</strong>, maroquinerie italienne et diagnostic dermo-expert sur-mesure.
        </p>

        <!-- CTA Principaux Épurés (Style Haute Joaillerie / Beauté de Luxe) -->
        <div class="hero-cta-group">
          <!-- CTA 1 : Grand Catalogue -->
          <button class="btn btn-gold btn-lg" id="hero-open-full-catalog-btn" title="Consulter le Grand Catalogue (1 136 articles certifiés)">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span>Consulter le Catalogue</span>
          </button>

          <!-- CTA 2 : Commande Directe WhatsApp / GSM au 07 77 02 72 35 -->
          <a href="https://wa.me/${whatsappNum}?text=${encodeURIComponent("Bonjour Mall of Beauty, je souhaite passer une commande.")}" 
             target="_blank" rel="noopener noreferrer" 
             class="btn btn-outline-gold btn-lg" 
             id="hero-order-wa-btn" 
             data-track="whatsapp" 
             title="Commander directement au ${phoneDisplay}">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/>
            </svg>
            <span>Commander : ${phoneDisplay}</span>
          </a>

          <!-- CTA 3 : Appel Direct GSM -->
          <a href="tel:${phone}" class="btn btn-outline-gold btn-lg btn-icon-only-mobile" id="hero-call-gsm-btn" data-track="phone_call" title="Appeler l'accueil boutique (${phoneDisplay})">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span class="hide-mobile">Appel Direct</span>
          </a>
        </div>

        <!-- Chiffres Clés & Réassurance Distinctifs -->
        <div class="hero-metrics">
          <div class="metric-item">
            <span class="metric-value">70% USA</span>
            <span class="metric-label">Cosmétiques Certifiés Américains</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">10 Ans</span>
            <span class="metric-label">D'Excellence & Confiance aux Vallons</span>
          </div>
          <div class="metric-item">
            <span class="metric-value">Vlisco Officiel</span>
            <span class="metric-label">Partenaire Agréé Grand Super</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Galerie Photos Réelles de la Boutique (Bloc Foldable avec Max 2 Lignes & Scroll) -->
    <section class="section-padding section-gallery" id="galerie-boutique" style="padding-top: 24px; padding-bottom: 40px;">
      <div class="container">
        <div class="gallery-accordion-card">
          <!-- Barre d'En-tête Foldable Cliquable -->
          <div class="gallery-accordion-header ${isGalleryUnfolded ? 'unfolded' : 'folded'}" 
               id="gallery-accordion-header"
               onclick="window.MoB.toggleGalleryFold(event)"
               onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.MoB.toggleGalleryFold(event);}"
               role="button"
               tabindex="0"
               aria-expanded="${isGalleryUnfolded}"
               title="${isGalleryUnfolded ? 'Cliquer pour replier la galerie' : 'Cliquer pour déplier et voir les photos'}">
            <div class="gallery-header-left">
              <span class="gallery-badge-pulse">
                <span class="pulse-dot-gal"></span>
                <span>📸 Galerie Boutique</span>
              </span>
              <div class="gallery-title-wrap">
                <h3 class="gallery-main-title">
                  L'Atmosphère Mall of Beauty en Images
                  <span class="gallery-count-pill" id="gallery-count-pill">${galleryImages.length} photos</span>
                </h3>
                <p class="gallery-sub-title">Un univers soigné pour vous sublimer à chaque visite aux Vallons.</p>
              </div>
            </div>

            <div class="gallery-header-right">
              <button type="button" class="btn-gallery-fold-toggle" id="gallery-toggle-btn" onclick="window.MoB.toggleGalleryFold(event)" aria-label="${isGalleryUnfolded ? 'Replier la galerie' : 'Déplier la galerie'}">
                <span class="fold-btn-label" id="gallery-toggle-btn-label">${isGalleryUnfolded ? 'Masquer la galerie' : 'Déplier la galerie'}</span>
                <span class="fold-btn-chevron ${isGalleryUnfolded ? 'rotated' : ''}" id="gallery-toggle-chevron">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </span>
              </button>
            </div>
          </div>

          <!-- Contenu Dépliable (Max 2 Lignes avec Scroll au-delà) -->
          <div class="gallery-foldable-body ${isGalleryUnfolded ? 'open' : 'closed'}" id="gallery-foldable-body">
            <div class="gallery-scroll-container" id="gallery-scroll-container">
              <div class="gallery-grid" id="gallery-grid-inner">
                ${galleryImages.map(item => `
                  <div class="gallery-item" data-id="${item.id || ''}">
                    <img src="${item.src}" alt="${item.caption}" class="gallery-img" loading="lazy">
                    <div class="gallery-item-caption">
                      <span>${item.caption}</span>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            ${galleryImages.length > 8 ? `
              <div class="gallery-scroll-hint" id="gallery-scroll-hint">
                <span>↕ Faites défiler pour voir l'ensemble des ${galleryImages.length} photos</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}
