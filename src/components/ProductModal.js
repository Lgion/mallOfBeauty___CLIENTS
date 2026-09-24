import { getProductById, getStoreSettings } from "../data/storage.js";
import { formatPriceFCFA } from "./Catalog.js";

export function renderProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return "";

  const settings = getStoreSettings();
  const whatsappNumber = settings.contacts.whatsapp.replace(/[^0-9]/g, '');
  const whatsappMsg = encodeURIComponent(
    `Bonjour Mall of Beauty, je souhaite commander le produit suivant :\n` +
    `• Référence : ${product.name}\n` +
    `• Prix : ${formatPriceFCFA(product.price)}\n` +
    `Pouvez-vous me confirmer sa disponibilité en boutique aux Vallons et les modalités de livraison ? Merci !`
  );

  return `
    <div class="modal-backdrop active" id="product-modal-backdrop" onclick="if(event.target === this) window.MoB.closeProductModal()">
      <div class="modal-content">
        <button class="modal-close" onclick="window.MoB.closeProductModal()" aria-label="Fermer">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 32px; @media(max-width: 700px){grid-template-columns: 1fr;}">
          <!-- Image -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="width: 100%; aspect-ratio: 1; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); background: #111;">
              <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            ${product.gallery && product.gallery.length > 1 ? `
              <div style="display: flex; gap: 10px; overflow-x: auto;">
                ${product.gallery.map(img => `
                  <img src="${img}" alt="Aperçu" style="width: 60px; height: 60px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-subtle); cursor: pointer;" onclick="this.closest('.modal-content').querySelector('img').src = '${img}'">
                `).join("")}
              </div>
            ` : ''}
          </div>

          <!-- Détails & Commandes -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <span class="badge badge-gold" style="margin-bottom: 8px;">${product.categoryLabel || product.category}</span>
              <h2 style="font-size: 1.5rem; line-height: 1.3; margin-bottom: 6px;">${product.name}</h2>
              <div style="font-size: 0.88rem; color: var(--text-dim);">Marque : <strong style="color: var(--gold-light);">${product.brand}</strong></div>
            </div>

            <div style="display: flex; align-items: baseline; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <span style="font-size: 1.8rem; font-weight: 700; color: var(--gold-light); font-family: var(--font-serif);">${formatPriceFCFA(product.price)}</span>
              ${product.oldPrice ? `<span style="font-size: 1rem; color: var(--text-dim); text-decoration: line-through;">${formatPriceFCFA(product.oldPrice)}</span>` : ''}
              <span class="badge badge-emerald" style="margin-left: auto;">En Stock (${product.stock} dispo)</span>
            </div>

            <div>
              <h4 style="font-size: 0.95rem; color: var(--gold-light); margin-bottom: 6px;">Description & Bienfaits :</h4>
              <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-muted);">${product.description || product.shortDesc}</p>
            </div>

            ${product.usage ? `
              <div style="background: rgba(212, 175, 55, 0.08); border-left: 3px solid var(--gold-primary); padding: 12px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                <h5 style="font-size: 0.85rem; color: var(--gold-light); margin-bottom: 4px;">💡 Conseils d'utilisation & Suivi MoB :</h5>
                <p style="font-size: 0.82rem; color: var(--text-main); margin: 0;">${product.usage}</p>
              </div>
            ` : ''}

            <!-- Actions d'Achat -->
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: 16px;">
              <button class="btn btn-gold btn-lg" onclick="window.MoB.handleAddToCart('${product.id}'); window.MoB.closeProductModal();">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <span>Ajouter au Panier</span>
              </button>

              <a href="https://wa.me/${whatsappNumber}?text=${whatsappMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
                <span>Commander directement via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
