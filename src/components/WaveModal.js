import { getStoreSettings, getCart, getProductById } from "../data/storage.js";

export function renderWaveModal() {
  const settings = getStoreSettings();
  const waveQrCode = settings.contacts.waveQrCode || "./imgs/wave_qr_code.svg";
  const wavePaymentUrl = settings.contacts.wavePaymentUrl || "https://pay.wave.com/m/M_CI_mallofbeauty";

  // Calcul automatique du panier en cours
  const cart = getCart();
  const cartTotal = cart.reduce((sum, item) => {
    const p = getProductById(item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const initialAmount = cartTotal > 0 ? cartTotal : 10000;
  const quickPills = [5000, 10000, 15000, 20000, 30000, 50000];

  return `
    <div class="modal-backdrop active wave-modal-backdrop-custom" id="wave-modal-backdrop" onclick="if(event.target === this) window.MoB.closeWaveModal()" style="z-index: 2100;">
      <div class="wave-exact-dialog" role="dialog" aria-labelledby="wave-exact-title">
        
        <!-- En-tête Bleu Wave Officiel conforme à l'image -->
        <div class="wave-exact-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="wave-exact-penguin-box">
              <img src="./imgs/wave_penguin.svg" alt="Wave Penguin" class="wave-exact-penguin-img">
            </div>
            <div>
              <h3 id="wave-exact-title" class="wave-exact-header-title">Paiement Wave</h3>
              <span class="wave-exact-header-sub">Mall of Beauty • Les Vallons</span>
            </div>
          </div>
          <button class="wave-exact-close-btn" onclick="window.MoB.closeWaveModal()" aria-label="Fermer la fenêtre Wave">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Corps Blanc conforme à la maquette de référence -->
        <div class="wave-exact-body">
          
          <!-- Champ Saisie du Montant (FCFA) -->
          <div class="wave-amount-section">
            <label class="wave-amount-label">Montant à payer (FCFA)</label>
            <div class="wave-amount-input-wrap">
              <input type="number" 
                     id="wave-amount-input" 
                     class="wave-amount-input" 
                     value="${initialAmount}" 
                     min="100" 
                     step="500" 
                     oninput="window.MoB.onWaveAmountInput(this.value)">
              <span class="wave-amount-suffix">FCFA</span>
            </div>
          </div>

          <!-- Grille des 6 Pastilles de Montant Rapide -->
          <div class="wave-quick-pills-grid">
            ${quickPills.map(val => `
              <button type="button" 
                      class="wave-quick-pill ${val === initialAmount ? 'active' : ''}" 
                      data-amount="${val}"
                      onclick="window.MoB.setWaveAmount(${val})">
                ${val.toLocaleString('fr-FR')} F
              </button>
            `).join("")}
          </div>

          <!-- Carte QR Code avec Bordure Cyan Wave -->
          <div class="wave-exact-qr-card">
            <div class="wave-exact-qr-header">
              <span>Payez avec</span>
              <span class="wave-logo-text">wave</span>
            </div>

            <div class="wave-exact-qr-frame">
              <img src="${waveQrCode}" alt="QR Code Paiement Wave Côte d'Ivoire" class="wave-exact-qr-image" id="wave-modal-qr-preview">
            </div>

            <div class="wave-exact-amount-pill" id="wave-qr-amount-display">
              ${initialAmount.toLocaleString('fr-FR')} FCFA
            </div>

            <div class="wave-exact-partners-footer">
              PARTENAIRES AGRÉÉS : UBA • ORABANK
            </div>
          </div>

          <!-- Étapes Numérotées en Cercles Bleus -->
          <div class="wave-exact-steps-list">
            <div class="wave-step-row">
              <span class="wave-step-num">1</span>
              <span class="wave-step-text">Ouvrez l'application <strong>Wave Côte d'Ivoire</strong> sur votre smartphone.</span>
            </div>
            <div class="wave-step-row">
              <span class="wave-step-num">2</span>
              <span class="wave-step-text">Appuyez sur <strong>Scanner</strong> et visez ce QR code.</span>
            </div>
            <div class="wave-step-row">
              <span class="wave-step-num">3</span>
              <span class="wave-step-text">Validez le règlement pour <strong>Mall of Beauty</strong>.</span>
            </div>
          </div>

          <!-- Boutons d'Action Inférieurs (Mobile & Copier) -->
          <div class="wave-exact-bottom-actions">
            <a href="${wavePaymentUrl}" target="_blank" rel="noopener noreferrer" class="btn-wave-exact-launch" id="wave-direct-launch-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span>Ouvrir dans Wave (Mobile)</span>
            </a>

            <button type="button" class="btn-wave-exact-copy" onclick="window.MoB.copyWavePaymentLink('${wavePaymentUrl}')">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span>Copier lien</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}
