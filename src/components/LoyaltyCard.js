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

        <div style="display: grid; grid-template-columns: 1fr; gap: 48px; align-items: flex-start; @media(max-width: 900px){grid-template-columns: 1fr;}">
          <!-- Carte Métallique Visuelle & Formulaire d'Adhésion -->
          <div>
            <div class="loyalty-card-metal" id="visual-loyalty-card">
              <div class="loyalty-card-top">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="./imgs/logo.jpeg" alt="Logo" style="height: 38px; border-radius: 4px;">
                  <span style="font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700; color: #FFF; letter-spacing: 0.08em;">MALL OF BEAUTY</span>
                </div>
                <div class="loyalty-chip"></div>
              </div>

              <div class="loyalty-card-number" id="card-number-display">
                MOB • VIP • 2026
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

            <!-- Boîte de Succès avec Code Client Généré -->
            <div id="loyalty-code-success-card" style="display: none; margin-top: 20px; background: rgba(18, 18, 24, 0.95); border: 1.5px solid var(--gold-primary); border-radius: var(--radius-md); padding: 20px; text-align: center; box-shadow: var(--shadow-gold);">
              <span class="badge badge-gold" style="margin-bottom: 8px;">Adhésion Validée ✨</span>
              <h4 style="color: #FFF; margin-bottom: 6px; font-size: 1.1rem;">Félicitations ! Voici votre Code Client VIP :</h4>
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--gold-light); font-family: monospace; letter-spacing: 0.15em; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 8px; margin: 10px auto 14px; border: 1px dashed rgba(197, 160, 89, 0.4); max-width: 280px;" id="generated-client-code-display">
                MOB-VIP-0000
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                Conservez précieusement ce code. Il est rattaché à votre compte pour profiter de vos <strong>-10% à votre anniversaire</strong> et de vos cadeaux en boutique.
              </p>
              <button type="button" class="btn btn-gold btn-sm" onclick="window.MoB.copyClientCode()" id="copy-client-code-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>Copier mon Code Client</span>
              </button>
            </div>

            <!-- Formulaire d'Adhésion en Ligne -->
            <div class="luxury-card" id="loyalty-form-card" style="margin-top: 24px; background: rgba(15, 14, 18, 0.95); border-color: rgba(197, 160, 89, 0.3);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="font-size: 1.2rem; color: var(--gold-light);">Souscrire à la Carte Privilège</h3>
                <span class="badge badge-gold">Adhésion Gratuite</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 18px;">
                Renseignez vos coordonnées pour générer immédiatement votre <strong>Code Client VIP</strong> et débloquer vos <strong>-10% d'anniversaire valables pendant 10 jours</strong>.
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
                    <label class="form-label" for="loyalty-pref">Univers Préféré *</label>
                    <select id="loyalty-pref" class="form-select">
                      <option value="Gamme Femme & Soins Dermo" selected>Gamme Femme & Soins Dermo-Experts</option>
                      <option value="Dermocosmétique USA (70%) & K-Beauty">Dermocosmétique USA (70%) & K-Beauty</option>
                      <option value="Pagnes Vlisco Prestige">Pagnes Vlisco Prestige Officiel</option>
                      <option value="Gamme Homme">Gamme Homme & Barbe</option>
                      <option value="Soins Bébés & Enfants">Soins Bébés & Enfants</option>
                      <option value="Maroquinerie & Parfums">Maroquinerie & Parfums Rares</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn btn-gold btn-lg" style="width: 100%; margin-top: 8px;">
                  <span>Générer mon Code Client & Activer la Carte</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                </button>
              </form>
            </div>
          </div>

          <!-- Les Piliers d'Avantages Privilège -->
          <div style="display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box;">
            <div class="luxury-card" style="padding: 20px; box-sizing: border-box; width: 100%;">
              <div style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
                <div style="color: var(--gold-primary); display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: rgba(197, 160, 89, 0.12); border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.3); flex-shrink: 0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><circle cx="2" cy="4" r="1.2" fill="currentColor"/><circle cx="22" cy="4" r="1.2" fill="currentColor"/><circle cx="12" cy="4" r="1.2" fill="currentColor"/><path d="M4 19h16"/></svg>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.08rem; color: var(--gold-light); margin: 0; word-break: break-word;">Gamme Femme & Dermo-Excellence</h3>
                    <span class="badge badge-gold" style="flex-shrink: 0; font-size: 0.72rem; padding: 3px 8px;">Prioritaire VIP</span>
                  </div>
                  <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0; line-height: 1.5;">
                    Accès privilégié en avant-première aux nouveautés américaines certifiées (70% de la collection) et conseils dermo-experts personnalisés pour votre typologie de peau.
                  </p>
                </div>
              </div>
            </div>

            <div class="luxury-card" style="padding: 20px; box-sizing: border-box; width: 100%;">
              <div style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
                <div style="color: var(--gold-primary); display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: rgba(197, 160, 89, 0.12); border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.3); flex-shrink: 0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.08rem; color: var(--gold-light); margin: 0; word-break: break-word;">Cadeau d'Anniversaire VIP</h3>
                    <span class="badge badge-gold" style="flex-shrink: 0; font-size: 0.72rem; padding: 3px 8px;">-10% de réduction</span>
                  </div>
                  <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0; line-height: 1.5;">
                    Valable pendant <strong>10 jours consécutifs</strong> autour de votre date d'anniversaire sur l'ensemble des soins, parfums et cosmétiques de la boutique.
                  </p>
                </div>
              </div>
            </div>

            <div class="luxury-card" style="padding: 20px; box-sizing: border-box; width: 100%;">
              <div style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
                <div style="color: var(--gold-primary); display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: rgba(197, 160, 89, 0.12); border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.3); flex-shrink: 0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.08rem; color: var(--gold-light); margin: 0; word-break: break-word;">Récompense Cycle de Carte</h3>
                    <span class="badge badge-gold" style="flex-shrink: 0; font-size: 0.72rem; padding: 3px 8px;">-15% de remise</span>
                  </div>
                  <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0; line-height: 1.5;">
                    À l'achèvement de votre carte de fidélité, profitez d'une remise exceptionnelle de <strong>15% sur tout votre panier</strong> d'achat.
                  </p>
                </div>
              </div>
            </div>

            <div class="luxury-card" style="padding: 20px; box-sizing: border-box; width: 100%;">
              <div style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
                <div style="color: var(--gold-primary); display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: rgba(197, 160, 89, 0.12); border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.3); flex-shrink: 0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                    <h3 style="font-size: 1.08rem; color: var(--gold-light); margin: 0; word-break: break-word;">Échantillons & Nouveautés USA</h3>
                    <span class="badge badge-emerald" style="flex-shrink: 0; font-size: 0.72rem; padding: 3px 8px;">Gratuit & Prioritaire</span>
                  </div>
                  <p style="font-size: 0.86rem; color: var(--text-muted); margin: 0; line-height: 1.5;">
                    Doses d'essai offertes à chaque achat et alertes réassorts privées sur les produits viraux américains et coréens.
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
