import { getStoreSettings } from "../data/storage.js";

export function renderInteractiveMap() {
  const settings = getStoreSettings();

  const galleryImages = [
    { src: "./imgs/devanture_face.jpg", caption: "Façade Mall of Beauty • Les Vallons" },
    { src: "./imgs/interieur.jpg", caption: "Salon d'Accueil VIP & Conseils" },
    { src: "./imgs/stand_makeup.jpg", caption: "Bar à Maquillage & Cosmétiques" },
    { src: "./imgs/stand_maroquinerie.jpg", caption: "Maroquinerie & Sacs de Luxe" },
    { src: "./imgs/stand_pagnes.jpg", caption: "Espace Pagnes Vlisco Officiel" },
    { src: "./imgs/stand_perruques.jpg", caption: "Haute Coiffure & Perruques HD" },
    { src: "./imgs/stands_esthetique.jpg", caption: "Soins Visage & K-Beauty" },
    { src: "./imgs/devanture_cote.jpg", caption: "Vue d'angle Rue des Jardins" }
  ];

  return `
    <section class="section-padding section-with-bg" id="localisation">
      <div class="section-bg-overlay bg-location-store"></div>
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Visitez Notre Écrin</span>
          <h2 class="section-title">Nous Rendre Visite aux Vallons</h2>
          <p class="section-subtitle">
            Idéalement situé sur la prestigieuse Rue des Jardins, notre espace vous accueille dans un cadre intime, luxueux et chaleureux.
          </p>
        </div>

        <div class="map-wrapper">
          <!-- Carte Interactive Leaflet -->
          <div class="map-container-box">
            <div id="leaflet-map"></div>
          </div>

          <!-- Fiche d'Accès & Coordonnées -->
          <div class="luxury-card" style="padding: 32px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
              <span class="badge badge-gold">Point de Repère Idéal</span>
              <span style="font-size: 0.85rem; color: #10B981; font-weight: 600;">📍 En face de la Pharmacie Saint-Gilles</span>
            </div>

            <h3 style="font-size: 1.4rem; line-height: 1.3; margin-bottom: 12px; color: var(--gold-light);">
              ${settings.name} • Cocody Les Vallons
            </h3>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--gold-primary); flex-shrink: 0; margin-top: 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-main);">
                  <strong>${settings.address.street}</strong><br>
                  ${settings.address.district}, ${settings.address.city} (${settings.address.country})
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--gold-primary); flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-main);">
                  <strong>${settings.openingHours.days}</strong> : ${settings.openingHours.hours}<br>
                  <span style="color: var(--text-dim);">Fermé le ${settings.openingHours.closed}</span>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--gold-primary); flex-shrink: 0; margin-top: 2px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-main);">
                  Secrétariat : <a href="tel:${settings.contacts.phoneService}" style="color: var(--gold-light); font-weight: 600;">${settings.contacts.phoneServiceDisplay}</a><br>
                  WhatsApp Direction : <a href="https://wa.me/${settings.contacts.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" style="color: #34D399; font-weight: 600;">${settings.contacts.whatsappDisplay}</a>
                </div>
              </div>
            </div>

            <!-- Boutons Itinéraire & Yango -->
            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=5.358245,-3.992812" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                <span>Itinéraire Google Maps</span>
              </a>
              <a href="https://yango.com" target="_blank" rel="noopener noreferrer" class="btn btn-outline-gold btn-sm" title="Commander une course avec Yango">
                <span>🚕 Venir avec Yango</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Galerie Photos Réelles de la Boutique -->
        <div style="margin-top: 60px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="font-size: 1.5rem; color: var(--gold-light);">L'Atmosphère Mall of Beauty en Images</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Un univers soigné pour vous sublimer à chaque visite.</p>
          </div>

          <div class="gallery-grid">
            ${galleryImages.map(item => `
              <div class="gallery-item">
                <img src="${item.src}" alt="${item.caption}" class="gallery-img" loading="lazy">
                <div style="position: absolute; bottom: 0; inset-inline: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); padding: 12px; font-size: 0.78rem; color: #FFF; font-weight: 500;">
                  ${item.caption}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initMapInstance() {
  const mapElement = document.getElementById("leaflet-map");
  if (!mapElement || typeof L === "undefined") return;

  // Empêche la réinitialisation si déjà créé
  if (mapElement._leaflet_id) return;

  const lat = 5.358245;
  const lng = -3.992812;

  const map = L.map("leaflet-map", {
    center: [lat, lng],
    zoom: 16,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // Fond de carte sombre et prestigieux
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  // Marqueur personnalisé doré
  const customIcon = L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="background: #D4AF37; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(212, 175, 55, 0.8); border: 3px solid #000; color: #000; font-weight: 800; font-size: 12px;">
        MoB
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
  marker.bindPopup(`
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; color: #111;">
      <strong style="color: #B38F26; font-size: 14px;">MALL OF BEAUTY</strong><br>
      <span style="font-size: 12px;">Rue des Jardins, N° 3077</span><br>
      <span style="font-size: 11px; color: #555;">En face de la pharmacie Saint-Gilles</span>
    </div>
  `).openPopup();
}
