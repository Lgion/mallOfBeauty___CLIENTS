import { getCart, getProductById, getStoreSettings, updateCartQuantity, removeFromCart, clearCart } from "../data/storage.js";
import { formatPriceFCFA } from "./Catalog.js";

export function renderCartDrawer() {
  const cart = getCart();
  const settings = getStoreSettings();

  const cartDetails = cart.map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product != null);

  const subtotal = cartDetails.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <div class="drawer-backdrop" id="cart-drawer-backdrop" onclick="if(event.target === this) window.MoB.closeCartDrawer()">
      <div class="cart-drawer">
        <!-- En-tête -->
        <div class="drawer-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <h3 style="font-size: 1.2rem; color: #FFF;">Votre Panier (${totalItems})</h3>
          </div>
          <button class="btn btn-icon" onclick="window.MoB.closeCartDrawer()" aria-label="Fermer le panier">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Corps du Panier -->
        <div class="drawer-body">
          ${cartDetails.length === 0 ? `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted); margin: auto;">
              <div style="font-size: 3rem; margin-bottom: 14px;">🛍️</div>
              <h4 style="color: #FFF; margin-bottom: 8px;">Votre panier est vide</h4>
              <p style="font-size: 0.88rem; margin-bottom: 24px;">Découvrez nos soins K-Beauty, pagnes Vlisco et accessoires d'exception.</p>
              <button class="btn btn-outline-gold btn-sm" onclick="window.MoB.closeCartDrawer(); window.location.hash = '#catalogue';">Explorer la boutique</button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${cartDetails.map(item => `
                <div class="cart-item">
                  <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
                  <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.product.name}</h4>
                    <div class="cart-item-price">${formatPriceFCFA(item.product.price)}</div>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <button class="btn-action-sm btn-danger" style="padding: 2px 6px; font-size: 0.75rem;" onclick="window.MoB.handleRemoveFromCart('${item.product.id}')" title="Supprimer">
                      ✕
                    </button>
                    <div class="cart-qty-ctrl">
                      <button class="cart-qty-btn" onclick="window.MoB.handleUpdateQty('${item.product.id}', ${item.quantity - 1})">-</button>
                      <span style="font-size: 0.85rem; font-weight: 700; min-width: 16px; text-align: center;">${item.quantity}</span>
                      <button class="cart-qty-btn" onclick="window.MoB.handleUpdateQty('${item.product.id}', ${item.quantity + 1})">+</button>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>

            <!-- Options de Livraison & Coordonnées -->
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-md); padding: 16px; margin-top: 10px;">
              <h4 style="font-size: 0.9rem; color: var(--gold-light); margin-bottom: 10px;">Mode de réception :</h4>
              <div class="form-group" style="margin-bottom: 12px;">
                <select id="cart-delivery-type" class="form-select" style="font-size: 0.85rem; padding: 10px;">
                  <option value="Retrait en Boutique (Gratuit - Les Vallons)">Retrait en Boutique (Gratuit - Les Vallons)</option>
                  <option value="Livraison Express Yango (Abidjan)">Livraison Express Yango (Abidjan)</option>
                  <option value="Expédition GP / DHL (Intérieur / International)">Expédition GP / DHL (Intérieur / International)</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <input type="text" id="cart-client-name" class="form-input" placeholder="Votre nom complet" style="font-size: 0.85rem; padding: 10px;">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <input type="text" id="cart-client-address" class="form-input" placeholder="Commune, quartier ou repère précis" style="font-size: 0.85rem; padding: 10px;">
              </div>
            </div>
          `}
        </div>

        <!-- Pied du Tiroir (Totaux & Commande) -->
        ${cartDetails.length > 0 ? `
          <div class="drawer-footer">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--text-muted); font-size: 0.95rem;">Sous-total estimé :</span>
              <span style="font-size: 1.4rem; font-weight: 700; color: var(--gold-light); font-family: var(--font-serif);">${formatPriceFCFA(subtotal)}</span>
            </div>

            <button class="btn btn-whatsapp btn-lg" style="width: 100%;" onclick="window.MoB.handleCheckoutWhatsApp()">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.879.814 2.796.814 3.183 0 5.769-2.587 5.77-5.766.001-3.183-2.585-5.8-5.77-5.8zm3.376 8.204c-.14.394-.807.754-1.127.799-.304.043-.701.077-2.022-.441-1.688-.662-2.775-2.39-2.86-2.502-.085-.113-.687-.912-.687-1.739 0-.827.433-1.233.587-1.402.155-.17.338-.212.451-.212.113 0 .226.002.324.007.103.005.241-.039.377.288.14.339.479 1.171.522 1.256.043.085.072.184.015.297-.057.113-.086.184-.17.283-.085.099-.178.22-.254.296-.085.085-.173.177-.075.346.099.169.439.724.943 1.173.649.579 1.197.758 1.366.843.169.085.268.071.368-.043.099-.113.424-.494.537-.663.113-.17.226-.142.38-.085.155.057.986.465 1.155.55.169.085.282.127.324.198.043.071.043.41-.097.804z"/></svg>
              <span>Valider ma commande sur WhatsApp</span>
            </button>

            <button class="btn btn-outline-gold btn-sm" style="width: 100%;" onclick="window.MoB.handleClearCart()">
              Vider le panier
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
