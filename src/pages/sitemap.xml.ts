import fullCatalogRaw from "../data/fullCatalogData.json";
import { INITIAL_PRODUCTS } from "../data/initialProducts.js";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "\'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

export async function GET() {
  const baseUrl = "https://mall-of-beauty-clients.vercel.app";
  const now = new Date().toISOString();

  // Dictionnaire dédoublonné de tous les 1 328 articles du catalogue
  const productMap = new Map<string, any>();

  if (Array.isArray(fullCatalogRaw)) {
    fullCatalogRaw.forEach((item: any) => {
      if (item && item.id) {
        productMap.set(item.id, item);
      }
    });
  }

  const staticRoutes = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/#catalogue`, priority: "0.9", changefreq: "daily" },
    { loc: `${baseUrl}/#services`, priority: "0.8", changefreq: "weekly" },
    { loc: `${baseUrl}/#communaute`, priority: "0.8", changefreq: "weekly" },
    { loc: `${baseUrl}/#apropos`, priority: "0.7", changefreq: "monthly" },
    { loc: `${baseUrl}/#contact`, priority: "0.7", changefreq: "monthly" }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Routes statiques principales
  for (const r of staticRoutes) {
    xml += `  <url>
    <loc>${r.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>
`;
  }

  // Fiches produits dédiées (1 328+ pages produits individuelles indexables)
  for (const [id, prod] of productMap.entries()) {
    const loc = `${baseUrl}/produit/${encodeURIComponent(id)}`;
    const imgUrl = prod.image || (Array.isArray(prod.gallery) && prod.gallery[0]);
    const name = escapeXml(prod.name || "");
    const brand = escapeXml(prod.brand || "Mall of Beauty");
    const category = escapeXml(prod.category || "Beauté");

    xml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>`;

    if (imgUrl && !imgUrl.includes("stands_esthetique")) {
      xml += `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${name} - ${brand}</image:title>
      <image:caption>${category} disponible chez Mall of Beauty aux Vallons Cocody Abidjan</image:caption>
    </image:image>`;
    }

    xml += `
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
