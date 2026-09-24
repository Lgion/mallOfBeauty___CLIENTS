import confetti from "canvas-confetti";

export function renderLoyaltyCard() {
  return `
    <section class="section-padding section-with-bg" id="fidelite">
      <div class="section-bg-overlay bg-loyalty-store"></div>
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Programme Privilège</span>
          <h2 class="section-title">La Carte Privilège Mall of Beauty</h2>
          <p class="section-subtitle">
            Parce que votre fidélité mérite les plus belles attentions, bénéficiez de réductions exclusives et d'accès privés aux nouveaux arrivages.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: flex-start; @media(max-width: 900px){grid-template-columns: 1fr;}">
          <!-- Carte Métallique Visuelle & Formulaire d'Adhésion -->
          <div>
            <div class="loyalty-card-metal" id="visual-loyalty-card">
              <div class="loyalty-card-top">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="/imgs/logo.jpeg" alt="Logo" style="height: 38px; border-radius: 4px;">
                  <span style="font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; color: #FFF; letter-spacing: 0.08em;">MALL OF BEAUTY</span>
                </div>
                <div class="loyalty-chip"></div>
              </div>

              <div class="loyalty-card-number">
                5428 •••• •••• 3077
              </div>

              <div class="loyalty-card-bottom">
                <div>
                  <div style="font-size: 0.65rem; color: var(--gold-light); text-transform: uppercase; letter-spacing: 0.1em;">MEMBRE PRIVILÈGE</div>
                  <div style="font-size: 1rem; font-weight: 700; color: #FFF; text-transform: uppercase;" id="card-holder-display">CHÈRE CLIENTE VIP</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 0.65rem; color: var(--gold-light); text-transform: uppercase; letter-spacing: 0.1em;">STATUT</div>
                  <div style="font-size: 0.9rem; font-weight: 800; color: var(--gold-light);">OR EXCLUSIF</div>
                </div>
              </div>
            </div>

            <!-- Formulaire d'Adhésion en Ligne -->
            <div class="luxury-card" style="margin-top: 24px; background: rgba(15, 14, 18, 0.95); border-color: rgba(212, 175, 55, 0.3);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="font-size: 1.2rem; color: var(--gold-light);">Souscrire à la Carte Privilège</h3>
                <span class="badge badge-gold">Gratuit</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 18px;">
                Enregistrez votre date d'anniversaire pour débloquer automatiquement vos <strong>-10% valables pendant 10 jours</strong>.
              </p>

              <form id="loyalty-registration-form" onsubmit="window.MoB.handleLoyaltySubmit(event)">
                <div class="form-group">
                  <label class="form-label" for="loyalty-name">Nom & Prénoms *</label>
                  <input type="text" id="loyalty-name" class="form-input" placeholder="Ex: Marie-Josée Gbagbo" required
                    oninput="document.getElementById('card-holder-display').textContent = this.value.toUpperCase() || 'CHÈRE CLIENTE VIP'">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="form-group">
                    <label class="form-label" for="loyalty-phone">Téléphone WhatsApp *</label>
                    <input type="tel" id="loyalty-phone" class="form-input" placeholder="Ex: +225 07 00 00 00 00" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="loyalty-bday">Date d'Anniversaire *</label>
                    <input type="date" id="loyalty-bday" class="form-input" required>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="form-group">
                    <label class="form-label" for="loyalty-neighborhood">Quartier (Abidjan / Hors)</label>
                    <input type="text" id="loyalty-neighborhood" class="form-input" placeholder="Ex: Vallons, Marcory, Plateau...">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="loyalty-pref">Univers Préféré</label>
                    <select id="loyalty-pref" class="form-select">
                      <option value="Dermocosmétique & K-Beauty">Dermocosmétique & K-Beauty</option>
                      <option value="Pagnes Vlisco Prestige">Pagnes Vlisco Prestige</option>
                      <option value="Soins Bébés & Enfants">Soins Bébés & Enfants</option>
                      <option value="Gamme Homme">Gamme Homme</option>
                      <option value="Maroquinerie & Parfums">Maroquinerie & Parfums</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn btn-gold btn-lg" style="width: 100%; margin-top: 8px;">
                  <span>Activer ma Carte Privilège VIP</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                </button>
              </form>
            </div>
          </div>

          <!-- Les 3 Piliers d'Avantages -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="luxury-card" style="padding: 24px;">
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="font-size: 2rem;">🎂</div>
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.15rem; color: var(--gold-light);">Cadeau d'Anniversaire VIP</h3>
                    <span class="badge badge-gold">-10% de réduction</span>
                  </div>
                  <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
                    Valable pendant <strong>10 jours consécutifs</strong> autour de votre date d'anniversaire sur l'ensemble des soins, parfums et cosmétiques de la boutique.
                  </p>
                </div>
              </div>
            </div>

            <div class="luxury-card" style="padding: 24px;">
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="font-size: 2rem;">💳</div>
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.15rem; color: var(--gold-light);">Récompense Cycle de Carte</h3>
                    <span class="badge badge-gold">-15% de remise</span>
                  </div>
                  <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
                    À l'achèvement de votre carte de fidélité, profitez d'une remise exceptionnelle de <strong>15% sur tout votre panier</strong> d'achat.
                  </p>
                </div>
              </div>
            </div>

            <div class="luxury-card" style="padding: 24px;">
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="font-size: 2rem;">🎁</div>
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.15rem; color: var(--gold-light);">Échantillons & Avant-Premières</h3>
                    <span class="badge badge-emerald">Gratuit & Prioritaire</span>
                  </div>
                  <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">
                    Testez les nouveautés K-Beauty en avant-première et recevez des doses d'essai exclusives offertes à chaque passage en boutique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
