import { getStoreSettings } from "../data/storage.js";

export function renderPersonalShopper() {
  const settings = getStoreSettings();

  return `
    <section class="section-padding section-with-bg" id="conciergerie">
      <div class="section-bg-overlay bg-shopper-store"></div>
      <div class="container">
        <div class="ps-banner">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; @media(max-width: 900px){grid-template-columns: 1fr;}">
            <!-- Présentation du Service Conciergerie -->
            <div>
              <div class="ps-deposit-badge">
                <span>🛡️ Règle Officielle : Acompte de 60% Requis</span>
              </div>
              <h2 style="font-size: 2.4rem; line-height: 1.2; margin-bottom: 20px;">
                Conciergerie Privée & <span class="text-gradient-gold">Personal Shopping</span>
              </h2>
              <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 24px;">
                Vous recherchez un parfum de niche fraîchement sorti, un sac de luxe particulier ou une édition d'apparat Vlisco introuvable ? Confiez-nous votre recherche. Grâce à notre réseau exclusif entre Paris, Dubaï et l'Afrique de l'Ouest, nous sourçons la pièce exacte pour vous.
              </p>

              <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="color: var(--gold-primary); font-size: 1.2rem;">✦</span>
                  <span style="font-size: 0.95rem; color: var(--text-main);"><strong>Parfums de créateurs & extraits rares</strong> (Baccarat, Maison Crivelli, Amouage...)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="color: var(--gold-primary); font-size: 1.2rem;">✦</span>
                  <span style="font-size: 0.95rem; color: var(--text-main);"><strong>Maroquinerie de prestige</strong> (Sacs cuir véritable, finitions joaillerie)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="color: var(--gold-primary); font-size: 1.2rem;">✦</span>
                  <span style="font-size: 0.95rem; color: var(--text-main);"><strong>Pagnes Vlisco éditions limitées</strong> et modèles collectors sur commande</span>
                </div>
              </div>

              <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: var(--radius-md); padding: 16px;">
                <div style="font-size: 0.85rem; color: var(--gold-light); font-weight: 600; margin-bottom: 4px;">Conditions de commande :</div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Un acompte de 60% est exigé dès la confirmation de la pièce pour lancer l'approvisionnement et sécuriser l'achat auprès de nos partenaires certifiés.</p>
              </div>
            </div>

            <!-- Formulaire de Demande Conciergerie -->
            <div class="luxury-card" style="background: rgba(14, 14, 18, 0.95);">
              <h3 style="font-size: 1.35rem; color: var(--gold-light); margin-bottom: 8px;">Soumettre une Recherche VIP</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Notre direction prendra personnellement contact avec vous sous 24h.</p>

              <form id="personal-shopper-form" onsubmit="window.MoB.handlePersonalShopperSubmit(event)">
                <div class="form-group">
                  <label class="form-label" for="ps-name">Votre Nom & Prénoms *</label>
                  <input type="text" id="ps-name" class="form-input" placeholder="Ex: Mme Carole Aké" required>
                </div>

                <div class="form-group">
                  <label class="form-label" for="ps-phone">Numéro WhatsApp pour le suivi *</label>
                  <input type="tel" id="ps-phone" class="form-input" placeholder="Ex: +225 07 00 00 00 00" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div class="form-group">
                    <label class="form-label" for="ps-cat">Catégorie d'article *</label>
                    <select id="ps-cat" class="form-select" required>
                      <option value="Parfumerie Haute Exclusivité">Parfumerie Exclusivité</option>
                      <option value="Maroquinerie & Sac de Luxe">Maroquinerie & Sac Luxe</option>
                      <option value="Pagne Vlisco Édition Rare">Pagne Vlisco Rare</option>
                      <option value="Autre Pièce d'Exception">Autre Pièce d'Exception</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="ps-budget">Budget estimé (FCFA)</label>
                    <input type="text" id="ps-budget" class="form-input" placeholder="Ex: 150 000 FCFA">
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="ps-item">Description précise de l'article recherché *</label>
                  <textarea id="ps-item" class="form-textarea" placeholder="Nom du parfum, marque, coloris, référence ou laissez-nous carte blanche pour vous surprendre..." required></textarea>
                </div>

                <button type="submit" class="btn btn-gold btn-lg" style="width: 100%;">
                  <span>Transmettre ma Requête au Personal Shopper</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
