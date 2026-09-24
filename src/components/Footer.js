import { getStoreSettings } from "../data/storage.js";

export function renderFooter() {
  const settings = getStoreSettings();

  return `
    <footer class="site-footer">
      <div class="section-bg-overlay bg-footer-store"></div>
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1 : Marque & Slogan -->
          <div class="footer-col">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <img src="./imgs/logo.jpeg" alt="Mall of Beauty" style="height: 52px; border-radius: 6px;">
              <div>
                <h3 style="font-size: 1.3rem; color: #FFF; margin: 0;">MALL OF BEAUTY</h3>
                <span style="font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.12em;">Les Vallons • Cocody</span>
              </div>
            </div>

            <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              « <em>${settings.slogan}</em> » — Depuis près de 10 ans, le sanctuaire de la beauté authentique, des cosmétiques coréens certifiés et des pagnes Vlisco hollandais d'exception à Abidjan.
            </p>

            <div style="display: flex; gap: 12px;">
              <a href="${settings.contacts.instagram}" target="_blank" rel="noopener noreferrer" class="btn btn-icon" title="Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="${settings.contacts.tiktok}" target="_blank" rel="noopener noreferrer" class="btn btn-icon" title="TikTok">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.8a8.28 8.28 0 0 0 5.21 1.83V7.17a4.88 4.88 0 0 1-1.3-.48z"/></svg>
              </a>
              <a href="https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" class="btn btn-icon" title="WhatsApp Direction">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
              </a>
            </div>
          </div>

          <!-- Col 2 : Univers & Rayons -->
          <div class="footer-col">
            <h4>Univers Boutique</h4>
            <ul class="footer-links">
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('k-beauty')">K-Beauty & Dermocosmétique</a></li>
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('bebe-enfant')">Soins Bébés & Enfants</a></li>
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('soins-homme')">Soins Homme & Front Sombre</a></li>
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('textiles-vlisco')">Pagnes Vlisco Officiels</a></li>
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('maroquinerie')">Maroquinerie & Chaussures</a></li>
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('perruques')">Perruques & Capillaire</a></li>
              <li><a href="#catalogue" onclick="window.MoB.filterCategory('maquillage')">Maquillage & Bijoux</a></li>
            </ul>
          </div>

          <!-- Col 3 : Services & Conciergerie -->
          <div class="footer-col">
            <h4>Services d'Excellence</h4>
            <ul class="footer-links">
              <li><a href="#conseils">Diagnostic Visage Sur-Mesure</a></li>
              <li><a href="#conseils">Suivi Réactions & SAV Beauté</a></li>
              <li><a href="#conciergerie">Personal Shopping (Acompte 60%)</a></li>
              <li><a href="#fidelite">Programme Carte Privilège</a></li>
              <li><a href="#localisation">Livraison Express Yango</a></li>
              <li><a href="#localisation">Expéditions GP & DHL Monde</a></li>
              <li><a href="javascript:void(0)" onclick="window.MoB.openAdminModal()">Espace Administration (CRUD)</a></li>
            </ul>
          </div>

          <!-- Col 4 : Coordonnées Directes -->
          <div class="footer-col">
            <h4>Nous Contacter</h4>
            <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
              <div>📍 <strong>${settings.address.street}</strong></div>
              <div>Quartier ${settings.address.district}</div>
              <div style="color: var(--gold-light);">⭐️ ${settings.address.landmark}</div>
              <div style="margin-top: 6px;">📞 Secrétariat : <a href="tel:${settings.contacts.phoneService}" style="color: #FFF;">${settings.contacts.phoneServiceDisplay}</a></div>
              <div>💬 WhatsApp : <a href="https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" style="color: #34D399;">${settings.contacts.whatsappDisplay}</a></div>
              <div style="margin-top: 6px;">🕒 ${settings.openingHours.days} : ${settings.openingHours.hours}</div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>
            © ${new Date().getFullYear()} <strong>Mall of Beauty (MoB)</strong>. Tous droits réservés. Partenaire Officiel Vlisco.
          </div>
          <div style="display: flex; gap: 20px;">
            <span>Cocody Les Vallons, Abidjan</span>
            <span>•</span>
            <a href="javascript:void(0)" onclick="window.MoB.openAdminModal()" style="color: var(--gold-primary);">Accès Gestion Boutique (CRUD)</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
