import { getStoreSettings } from "../data/storage.js";

export function renderAdvisoryBooking() {
  const settings = getStoreSettings();

  return `
    <section class="section-padding section-with-bg" id="conseils">
      <div class="section-bg-overlay bg-advisory-store"></div>
      <div class="container">
        <div class="advisory-wrapper">
          <!-- Colonne Gauche : Philosophie du Conseil & SAV Beauté -->
          <div>
            <span class="section-tag">Expertise & Accompagnement</span>
            <h2 class="section-title">Le Conseil Sur-Mesure & le Suivi Personnalisé (SAV)</h2>
            <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 24px;">
              Chez <strong>Mall of Beauty</strong>, nous ne nous contentons pas de vendre un produit. Nous analysons la typologie de votre épiderme, comprenons vos habitudes de vie à Abidjan et concevons une routine adaptée avec un <strong>suivi rigoureux</strong> pour réajuster selon les réactions de votre peau.
            </p>

            <div class="advisory-feature-list">
              <div class="advisory-feature-item">
                <div class="advisory-feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; color: var(--gold-light); margin-bottom: 4px;">Femmes Enceintes & Allaitantes</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Protocoles dermo-sûrs sans actifs contre-indiqués, ciblant le masque de grossesse et l'hydratation.</p>
                </div>
              </div>

              <div class="advisory-feature-item">
                <div class="advisory-feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; color: var(--gold-light); margin-bottom: 4px;">Pôle Hommes & Peaux Tropicales</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Traitement de l'hyperpigmentation du front (soleil & pollution) et apaisement des boutons de rasage.</p>
                </div>
              </div>

              <div class="advisory-feature-item">
                <div class="advisory-feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; color: var(--gold-light); margin-bottom: 4px;">Futures Mariées & Cérémonies</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Préparation du teint d'apparat, éclat haute définition et harmonisation avec votre pagne Vlisco.</p>
                </div>
              </div>

              <div class="advisory-feature-item">
                <div class="advisory-feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                </div>
                <div>
                  <h4 style="font-size: 1rem; color: var(--gold-light); margin-bottom: 4px;">Bébés & Tout-Petits</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Sélection des huiles douces, laits protecteurs Cetaphil et Johnson's pour le confort du nourrisson.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne Droite : Formulaire Interactif de Réservation -->
          <div class="luxury-card" style="border: 1px solid var(--border-highlight); box-shadow: var(--shadow-gold);">
            <div style="margin-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 16px;">
              <span class="badge badge-gold" style="margin-bottom: 8px;">Consultation Gratuite</span>
              <h3 style="font-size: 1.4rem; color: var(--text-main);">Prendre Rendez-vous pour un Diagnostic</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted);">En boutique aux Vallons ou par appel visio WhatsApp.</p>
            </div>

            <form id="advisory-booking-form" onsubmit="window.MoB.handleAdvisorySubmit(event)">
              <div class="form-group">
                <label class="form-label" for="adv-name">Nom complet *</label>
                <input type="text" id="adv-name" class="form-input" placeholder="Ex: Marie-Josée Kouassi" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label" for="adv-phone">Téléphone / WhatsApp *</label>
                  <input type="tel" id="adv-phone" class="form-input" placeholder="Ex: +225 07 00 00 00 00" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="adv-profile">Profil / Préoccupation *</label>
                  <select id="adv-profile" class="form-select" required>
                    <option value="Femme Enceinte ou Allaitante">Femme Enceinte ou Allaitante</option>
                    <option value="Future Mariée / Cérémonie">Future Mariée / Cérémonie</option>
                    <option value="Soins Homme (Front Sombre & Rasage)">Soins Homme (Front & Rasage)</option>
                    <option value="Diagnostic K-Beauty & Taches">Diagnostic K-Beauty & Taches</option>
                    <option value="Routine Bébé & Enfant">Routine Bébé & Enfant</option>
                    <option value="Autre Conseil Personnalisé">Autre Conseil Personnalisé</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label" for="adv-mode">Lieu de consultation *</label>
                  <select id="adv-mode" class="form-select" required>
                    <option value="En boutique (Les Vallons, Rue des Jardins)">En boutique (Les Vallons)</option>
                    <option value="Visio WhatsApp à distance">Visio WhatsApp à distance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="adv-date">Date & Heure souhaitées</label>
                  <input type="datetime-local" id="adv-date" class="form-input">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="adv-notes">Vos préoccupations cutanées ou attentes particulières</label>
                <textarea id="adv-notes" class="form-textarea" placeholder="Décrivez votre peau, les produits déjà testés, ou le résultat souhaité..."></textarea>
              </div>

              <button type="submit" class="btn btn-gold btn-lg" style="width: 100%;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/></svg>
                <span>Confirmer ma Demande de Rendez-vous</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}
