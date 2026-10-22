import { getStoreSettings } from "../data/storage.js";

export function renderFooter() {
  const settings = getStoreSettings();
  const whatsappDigits = settings.contacts.whatsapp.replace(/[^0-9]/g, '');

  return `
    <footer class="site-footer" id="site-footer">
      <div class="section-bg-overlay bg-footer-store"></div>
      <div class="container">
        
        <!-- En-tête de Marque Prestige (Mobile & Desktop) -->
        <div class="footer-prestige-hero">
          <div class="footer-logo-ring">
            <img src="https://res.cloudinary.com/dfpxi9ywm/image/upload/v1791669198/mallofbeauty_assets/logo.jpg" alt="Mall of Beauty" class="footer-logo-badge">
          </div>
          <h3 class="footer-hero-title">MALL OF BEAUTY</h3>
          <p class="footer-hero-slogan">« <em>${settings.slogan}</em> »</p>
          <div class="footer-hero-sub">
            <span>Cocody Les Vallons</span>
            <span class="footer-dot">•</span>
            <span>Rue des Jardins</span>
            <span class="footer-dot">•</span>
            <span>Abidjan</span>
          </div>

          <!-- Raccourcis Tactiles Rapides en Mobile (Pills Glassmorphism) -->
          <div class="footer-mobile-action-bar">
            <a href="https://wa.me/${whatsappDigits}" target="_blank" rel="noopener noreferrer" class="footer-action-chip chip-wa">
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
              <span>WhatsApp VIP</span>
            </a>
            <a href="tel:${settings.contacts.orderPhone}" class="footer-action-chip chip-phone">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>Commandes</span>
            </a>
            <a href="${settings.contacts.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="footer-action-chip chip-maps">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Itinéraire</span>
            </a>
          </div>

          <!-- Badges de Réassurance Prestige -->
          <div class="footer-badges-pill-row">
            <span class="footer-pill-badge">🇺🇸 70% Origine USA Certifiée</span>
            <span class="footer-pill-badge">👑 Partenaire Officiel Vlisco</span>
            <span class="footer-pill-badge">⭐ 4.9/5 Avis Google (128 avis)</span>
            <span class="footer-pill-badge">⚡️ Livraison Yango & GP Monde</span>
          </div>
        </div>

        <!-- Grille de Contenu / Accordéons Tactiles en Mobile -->
        <div class="footer-grid footer-grid-modern">
          <!-- Col 1 : Présentation & Réseaux -->
          <div class="footer-col footer-col-identity">
            <h4 class="footer-col-title">Sanctuaire de Beauté</h4>
            <p class="footer-text-summary">
              Depuis près de 10 ans, l'adresse de référence à Abidjan pour les soins dermo-experts américains certifiés, la K-Beauty authentique et les pagnes Vlisco Grand Super.
            </p>
            <div class="footer-social-cluster">
              <a href="${settings.contacts.instagram}" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="Instagram @mallofbeauty_mofb">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="${settings.contacts.tiktok}" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="TikTok MoB">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.8a8.28 8.28 0 0 0 5.21 1.83V7.17a4.88 4.88 0 0 1-1.3-.48z"/></svg>
              </a>
              <a href="https://wa.me/${whatsappDigits}" target="_blank" rel="noopener noreferrer" class="footer-social-btn" title="WhatsApp Conciergerie">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
              </a>
            </div>
          </div>

          <!-- Col 2 : Univers & Rayons -->
          <div class="footer-col">
            <details class="footer-accordion" open>
              <summary class="footer-accordion-header">
                <h4>Univers Boutique</h4>
                <span class="footer-chevron"></span>
              </summary>
              <ul class="footer-links">
                <li><a href="#catalogue" onclick="window.MoB.filterCategory('usa')">🇺🇸 70% Origine USA</a></li>
                <li><a href="#catalogue" onclick="window.MoB.filterCategory('soins-visage')">Visage & K-Beauty</a></li>
                <li><a href="#catalogue" onclick="window.MoB.filterCategory('soins-corps')">Soins Corps & Laits</a></li>
                <li><a href="#catalogue" onclick="window.MoB.filterCategory('soins-cheveux')">Capillaire & Défrisants</a></li>
                <li><a href="#catalogue" onclick="window.MoB.openFullCatalog()">Grand Catalogue (1 137)</a></li>
                <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('fidelite')">Gamme Femme & Club VIP</a></li>
              </ul>
            </details>
          </div>

          <!-- Col 3 : Services d'Excellence -->
          <div class="footer-col">
            <details class="footer-accordion" open>
              <summary class="footer-accordion-header">
                <h4>Services d'Excellence</h4>
                <span class="footer-chevron"></span>
              </summary>
              <ul class="footer-links">
                <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('conseils')">Diagnostic Visage Sur-Mesure</a></li>
                <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('conseils')">Suivi Réactions & SAV Beauté</a></li>
                <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('conciergerie')">Personal Shopping (Acompte 60%)</a></li>
                <li><a href="javascript:void(0)" onclick="window.MoB.openVipService('fidelite')">Programme Carte Privilège</a></li>
                <li><a href="#localisation">Livraison Express Yango</a></li>
                <li><a href="#localisation">Expéditions GP & DHL Monde</a></li>
                <li><a href="javascript:void(0)" onclick="window.MoB.openAdminModal()">Espace Administration (CRUD)</a></li>
              </ul>
            </details>
          </div>

          <!-- Col 4 : Commandes & Accès -->
          <div class="footer-col">
            <details class="footer-accordion" open>
              <summary class="footer-accordion-header">
                <h4>Commandes & Accès</h4>
                <span class="footer-chevron"></span>
              </summary>
              <div class="footer-contact-details">
                <div class="footer-contact-line">
                  <span class="footer-line-icon">📍</span>
                  <div>
                    <strong>${settings.address.street}</strong><br>
                    Quartier ${settings.address.district}
                  </div>
                </div>
                <div class="footer-contact-line">
                  <span class="footer-line-icon">⭐️</span>
                  <span style="color: var(--gold-light);">${settings.address.landmark}</span>
                </div>
                <div class="footer-contact-line">
                  <span class="footer-line-icon">📞</span>
                  <div>
                    Commandes : <a href="tel:${settings.contacts.orderPhone}" class="footer-gold-link">${settings.contacts.orderPhoneDisplay}</a>
                  </div>
                </div>
                <div class="footer-contact-line">
                  <span class="footer-line-icon">💬</span>
                  <div>
                    WhatsApp : <a href="https://wa.me/${whatsappDigits}" target="_blank" style="color: #34D399; font-weight: 700;">${settings.contacts.whatsappDisplay}</a>
                  </div>
                </div>
                <div class="footer-contact-line">
                  <span class="footer-line-icon">🕒</span>
                  <span>${settings.openingHours.days} : ${settings.openingHours.hours}</span>
                </div>
              </div>
            </details>
          </div>
        </div>

        <!-- Bas de Page & Copyright avec Anti-Overlap pour Docks Flottants -->
        <div class="footer-bottom footer-bottom-modern">
          <div class="footer-bottom-copy">
            © ${new Date().getFullYear()} <strong>Mall of Beauty (MoB)</strong>. Tous droits réservés. Partenaire Officiel Vlisco.
          </div>
          <div class="footer-bottom-links">
            <span>Cocody Les Vallons, Abidjan</span>
            <span class="footer-dot">•</span>
            <a href="javascript:void(0)" onclick="window.MoB.openAdminModal()" class="footer-admin-link">Accès Gestion Boutique</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
