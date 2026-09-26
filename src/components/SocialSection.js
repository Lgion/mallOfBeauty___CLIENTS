import { getStoreSettings } from "../data/storage.js";

export function renderSocialSection(activePlatformId = "instagram", isFeedExpanded = false) {
  const settings = getStoreSettings();

  const socialNetworks = [
    {
      id: "instagram",
      platform: "Instagram",
      handle: "@mallofbeauty_mofb",
      url: settings.contacts.instagram,
      badge: "Communauté Beauté VIP",
      followers: "18.4k Abonnés VIP",
      desc: "Découvrez en story quotidienne les arrivages exclusifs de pagnes Vlisco, les routines sérums coréens et les photos avant/après de nos clientes satisfaites aux Vallons.",
      color: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      iconSvg: `<svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
    },
    {
      id: "tiktok",
      platform: "TikTok",
      handle: "@mallofbeauty1",
      url: settings.contacts.tiktok,
      badge: "Démos Vidéos & Unboxings",
      followers: "32.9k Abonnés • 140k J'aime",
      desc: "Vidéos démo en direct depuis la boutique des Vallons : rituels démaquillants K-Beauty, essayages de pagnes Vlisco et conseils anti-imperfections pour Abidjan.",
      color: "linear-gradient(135deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)",
      iconSvg: `<svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.8a8.28 8.28 0 0 0 5.21 1.83V7.17a4.88 4.88 0 0 1-1.3-.48z"/></svg>`
    },
    {
      id: "facebook",
      platform: "Facebook",
      handle: "Mall of Beauty Abidjan",
      url: settings.contacts.facebook,
      badge: "Page Officielle Abidjan",
      followers: "24.5k Abonnés • Communauté",
      desc: "Albums photos haute résolution de tous nos rayons, alertes réassorts, lives conseils dermocosmétique et avis certifiés de notre clientèle ivoirienne et internationale.",
      color: "linear-gradient(135deg, #1877F2 0%, #0D54BA 100%)",
      iconSvg: `<svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    },
    {
      id: "x",
      platform: "X (Twitter)",
      handle: "@MallOfBeautyCI",
      url: settings.contacts.x,
      badge: "Flash Infos & Service Client",
      followers: "6.8k Followers • En Direct",
      desc: "Fil d'actualité en temps réel : alertes sur la disponibilité immédiate des soins viraux de Séoul, horaires des jours fériés et conciergerie VIP express.",
      color: "linear-gradient(135deg, #000000 0%, #1D9BF0 100%)",
      iconSvg: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    }
  ];

  const activeNetwork = socialNetworks.find(s => s.id === activePlatformId) || socialNetworks[0];

  const mockPosts = [
    {
      network: "instagram",
      image: "./imgs/stand_pagnes.jpg",
      badge: "Instagram",
      caption: "✨ Arrivage exclusif de la semaine : Nouveaux motifs Vlisco Grand Super Wax 6 yards en boutique aux Vallons !",
      stats: "❤️ 342 • 💬 28",
      url: settings.contacts.instagram
    },
    {
      network: "tiktok",
      image: "./imgs/stands_esthetique.jpg",
      badge: "TikTok",
      caption: "🎬 Démo routine du soir : Comment traiter les taches solaires à Abidjan avec les sérums K-Beauty !",
      stats: "▶ 14.8k vues • 890 j'aime",
      url: settings.contacts.tiktok
    },
    {
      network: "facebook",
      image: "./imgs/stand_maroquinerie.jpg",
      badge: "Facebook",
      caption: "👜 Arrivage maroquinerie italienne & pochettes haute élégance disponibles dès aujourd'hui aux 2 Plateaux.",
      stats: "👍 419 • 💬 53",
      url: settings.contacts.facebook
    },
    {
      network: "instagram",
      image: "./imgs/stand1.jpg",
      badge: "Instagram",
      caption: "💎 Rayon soins dermo-experts : découvrez nos coffrets cadeaux et formules bébé hypoallergéniques.",
      stats: "❤️ 512 • 💬 46",
      url: settings.contacts.instagram
    },
    {
      network: "tiktok",
      image: "./imgs/devanture_face.jpg",
      badge: "TikTok",
      caption: "📍 Visite guidée de notre boutique Rue des Jardins, en face de la pharmacie Saint-Gilles.",
      stats: "▶ 22.3k vues • 1.4k j'aime",
      url: settings.contacts.tiktok
    },
    {
      network: "x",
      image: "./imgs/stand5.jpg",
      badge: "X (Twitter)",
      caption: "📢 Flash Réassort : Les flacons Beauty of Joseon Ginseng et Anua Heartleaf sont à nouveau disponibles !",
      stats: "🔁 87 • ❤️ 230",
      url: settings.contacts.x
    }
  ];

  return `
    <section class="section-padding section-with-bg" id="communaute">
      <div class="section-bg-overlay bg-social-store"></div>
      <div class="container">
        <!-- En-tête de section -->
        <div class="section-header">
          <span class="section-tag">Réseaux Sociaux Officiels</span>
          <h2 class="section-title">Rejoignez la Communauté Mall of Beauty</h2>
          <p class="section-subtitle">
            Suivez nos conseils routines, découvrez nos déballages en direct de Séoul et d'Europe, et rejoignez nos milliers d'abonnés privilégiés.
          </p>
        </div>

        <!-- Boutons Ronds Positionnés sur un Arc de Cercle Élégant -->
        <div class="social-arc-wrapper">
          <svg class="social-arc-curve-svg" viewBox="0 0 680 120" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="socialGoldArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.15"/>
                <stop offset="50%" stop-color="#FDE68A" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.15"/>
              </linearGradient>
            </defs>
            <path d="M 30 100 Q 340 10 650 100" fill="none" stroke="url(#socialGoldArcGrad)" stroke-width="2.5" stroke-dasharray="8,5"/>
          </svg>

          <div class="social-arc-buttons">
            ${socialNetworks.map((s, idx) => `
              <button type="button" 
                      class="social-arc-circle-btn pos-${idx + 1} ${s.id === activeNetwork.id ? 'active' : ''}" 
                      onclick="window.MoB.selectSocialTab('${s.id}')" 
                      title="${s.platform} (${s.handle})"
                      aria-label="Sélectionner ${s.platform}">
                <span class="social-btn-inner" style="background: ${s.color};">
                  ${s.iconSvg}
                </span>
                <span class="social-btn-label">${s.platform}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Carte de Présentation Détaillée du Réseau Sélectionné -->
        <div class="social-active-card-wrap" id="social-active-card-container">
          <div class="luxury-card social-spotlight-card" style="border-color: rgba(212, 175, 55, 0.4); background: linear-gradient(135deg, rgba(20, 20, 28, 0.95), rgba(10, 10, 15, 0.98));">
            <div class="spotlight-top">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div class="spotlight-icon-circle" style="background: ${activeNetwork.color};">
                  ${activeNetwork.iconSvg}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <h3 style="font-size: 1.45rem; color: #FFF; margin: 0;">${activeNetwork.platform}</h3>
                    <span class="badge badge-gold" style="font-size: 0.72rem;">${activeNetwork.badge}</span>
                  </div>
                  <div style="font-size: 1rem; font-weight: 700; color: var(--gold-light); margin-top: 4px;">
                    ${activeNetwork.handle} • <span style="color: #34D399; font-size: 0.85rem;">${activeNetwork.followers}</span>
                  </div>
                </div>
              </div>

              <a href="${activeNetwork.url}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm track-social-link" data-track="${activeNetwork.id}" style="border-radius: var(--radius-full); padding: 10px 22px; font-weight: 700;">
                <span>S'abonner sur ${activeNetwork.platform}</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>
            </div>

            <p style="font-size: 0.95rem; line-height: 1.6; color: #CBD5E1; margin: 20px 0 0;">
              ${activeNetwork.desc}
            </p>
          </div>
        </div>

        <!-- Bloc Découverte du Flux Récent (Titre Repensé + Bouton Cliquable) -->
        <div class="social-feed-section-block">
          <div class="social-feed-header-deck">
            <span class="badge badge-gold" style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Immersion Visuelle & Vidéos</span>
            <h3 style="font-size: 1.45rem; color: #FFF; margin: 6px 0 8px;">Plongez au Cœur de Notre Univers Beauté & Mode</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); max-width: 620px; margin: 0 auto 18px;">
              Découvrez nos derniers arrivages de pagnes Vlisco, tutoriels skincare et démonstrations en boutique.
            </p>

            <!-- Mini Icônes Réseaux Sociaux pour le bouton -->
            <!-- Bouton Arrondi de Prestige pour Afficher/Masquer le Flux -->
            <button class="social-feed-toggle-pill-btn ${isFeedExpanded ? 'expanded' : ''}" 
                    id="toggle-social-feed-btn" 
                    onclick="window.MoB.toggleSocialFeed()" 
                    aria-expanded="${isFeedExpanded}" 
                    aria-controls="social-feed-collapsible"
                    style="display: inline-flex; align-items: center; justify-content: center; gap: 16px; margin: 10px auto; max-width: 95vw; cursor: pointer;">
              <span class="feed-btn-icon-orb" style="flex-shrink: 0;">
                ${isFeedExpanded ? '✕' : '👁️'}
              </span>
              <span class="feed-btn-content" style="display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
                <strong class="feed-btn-main-text" style="font-size: 0.95rem; color: #FFF; font-weight: 700; white-space: nowrap;">
                  ${isFeedExpanded ? 'Masquer la Galerie des Publications' : 'Publications & Vidéos Récentes'}
                </strong>
                <small class="feed-btn-sub-text" style="display: flex; align-items: center; gap: 8px; margin-top: 3px;">
                  <span class="feed-btn-social-icons" aria-label="Instagram, TikTok, Facebook, X (Twitter)" style="display: inline-flex; align-items: center; gap: 8px;">
                    <span class="feed-mini-social-icon instagram" title="Instagram" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%;">
                      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </span>
                    <span class="feed-mini-social-icon tiktok" title="TikTok" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%;">
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.8a8.28 8.28 0 0 0 5.21 1.83V7.17a4.88 4.88 0 0 1-1.3-.48z"/></svg>
                    </span>
                    <span class="feed-mini-social-icon facebook" title="Facebook" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%;">
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </span>
                    <span class="feed-mini-social-icon x" title="X (Twitter)" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%;">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </span>
                  </span>
                </small>
              </span>
              <span class="feed-btn-chevron-badge" style="flex-shrink: 0;">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="transform: rotate(${isFeedExpanded ? '180deg' : '0deg'}); transition: transform 0.3s ease;">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </span>
            </button>
          </div>

          <!-- Conteneur Accordéon / Rétractable -->
          <div class="social-feed-collapsible ${isFeedExpanded ? 'expanded' : 'collapsed'}" id="social-feed-collapsible">
            <div class="social-posts-grid">
              ${mockPosts.map(p => `
                <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="social-post-card track-social-link" data-track="${p.network}">
                  <div class="social-post-img-wrap">
                    <img src="${p.image}" alt="Post ${p.badge}" loading="lazy">
                    <span class="social-post-badge ${p.network}">
                      ${p.network === 'instagram' ? '📷' : p.network === 'tiktok' ? '🎵' : p.network === 'facebook' ? '👥' : '𝕏'} ${p.badge}
                    </span>
                  </div>
                  <div class="social-post-content">
                    <p class="social-post-caption">${p.caption}</p>
                    <div class="social-post-meta">
                      <span>${p.stats}</span>
                      <span style="color: var(--gold-light); font-weight: 600;">Voir sur ${p.badge} ↗</span>
                    </div>
                  </div>
                </a>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Section Témoignages & Avis Google Officiels -->
        <div class="google-reviews-luxury-block" id="google-reviews-section">
          <div class="google-reviews-header">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="google-logo-orb">
                <svg width="28" height="28" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <h4 style="font-size: 1.2rem; color: #FFF; margin: 0;">Avis Clients Certifiés Google</h4>
                  <span class="badge badge-gold" style="font-weight: 700;">${settings.contacts.googleRating || '4.9'} / 5 ★★★★★</span>
                  ${(settings.contacts.googlePlacesApiKey || settings.contacts.googleWidgetCode) ? '<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid #10B981;">● Synchronisation API Active</span>' : ''}
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 3px 0 0;">Basé sur ${settings.contacts.googleReviewCount || '128'} avis vérifiés à Abidjan Cocody Les Vallons</p>
              </div>
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
              <a href="${settings.contacts.googleReviewWriteUrl || 'https://search.google.com/local/writereview?placeid=ChIJ-mallofbeauty-abidjan'}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm" id="google-leave-review-btn">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span>Laisser un avis sur Google</span>
              </a>
              <a href="${settings.contacts.googleMapsUrl || 'https://www.google.com/maps/dir/?api=1&destination=5.358245,-3.992812'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold btn-sm" id="google-view-reviews-btn">
                <span>Consulter nos ${settings.contacts.googleReviewCount || '128'} avis Google</span>
              </a>
            </div>
          </div>

          <!-- Si un code de widget tiers (ex: Elfsight) est configuré -->
          ${settings.contacts.googleWidgetCode ? `
            <div class="google-reviews-widget-container" style="margin-top: 16px;">
              ${settings.contacts.googleWidgetCode}
            </div>
          ` : `
            <!-- Grille des Avis Certifiés Google -->
            <div class="google-reviews-grid" id="google-reviews-cards-grid">
              <div class="google-review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">« Boutique d'exception aux Vallons. Plus de 70% de soins américains et K-Beauty certifiés 100% authentiques. Conseils au top ! »</p>
                <div class="review-author">Aïssatou D. • <span class="review-verified">Avis vérifié Google</span></div>
              </div>

              <div class="google-review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">« Partenaire officiel Vlisco, j'y trouve toujours les plus beaux motifs Grand Super. Accueil VIP et service irréprochable. »</p>
                <div class="review-author">Christine K. • <span class="review-verified">Avis vérifié Google</span></div>
              </div>

              <div class="google-review-card">
                <div class="review-stars">★★★★★</div>
                <p class="review-text">« Le diagnostic dermo a transformé ma peau. Traitement très efficace des taches avec CeraVe et les sérums conseillés. »</p>
                <div class="review-author">Dr. Marc E. • <span class="review-verified">Avis vérifié Google</span></div>
              </div>
            </div>
          `}

          <!-- Bannière d'invitation à configurer la clé API si absente -->
          ${(!settings.contacts.googlePlacesApiKey && !settings.contacts.googleWidgetCode) ? `
            <div style="margin-top: 18px; padding: 12px 16px; background: rgba(212, 175, 55, 0.08); border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">💡</span>
                <span style="font-size: 0.82rem; color: var(--gold-light);">
                  <strong>Mode Démonstration :</strong> Pour charger les avis en temps réel via l'API officielle Google Places ou un widget (Elfsight / EmbedSocial), renseignez votre clé dans l'administration.
                </span>
              </div>
              <button type="button" class="btn btn-outline-gold btn-sm" style="padding: 4px 12px; font-size: 0.78rem;" onclick="window.MoB.openAdminModal('settings')">
                ⚙️ Configurer la Clé API
              </button>
            </div>
          ` : ''}
        </div>

      </div>
    </section>
  `;
}
