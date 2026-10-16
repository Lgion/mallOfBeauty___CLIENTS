import type { APIRoute } from 'astro';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || (import.meta.env && import.meta.env.CLOUDINARY_CLOUD_NAME),
  api_key: process.env.CLOUDINARY_API_KEY || (import.meta.env && import.meta.env.CLOUDINARY_API_KEY),
  api_secret: process.env.CLOUDINARY_API_SECRET || (import.meta.env && import.meta.env.CLOUDINARY_API_SECRET)
});

export const POST: APIRoute = async ({ request }) => {
  try {
    let fileData: string | null = null;
    let folder = 'mallofbeauty_assets/products';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const requestedFolder = formData.get('folder') as string | null;
      if (requestedFolder) folder = requestedFolder;

      if (!file) {
        return new Response(JSON.stringify({ error: "Aucun fichier fourni dans le formulaire" }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      fileData = `data:${file.type || 'image/jpeg'};base64,${buffer.toString('base64')}`;
    } else {
      const body = await request.json();
      if (body.folder) folder = body.folder;
      fileData = body.file || body.image;
    }

    if (!fileData) {
      return new Response(JSON.stringify({ error: "Données d'image introuvables" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const uploadRes = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: 'image'
    });

    return new Response(JSON.stringify({
      success: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height,
      format: uploadRes.format
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return new Response(JSON.stringify({ error: err.message || "Erreur lors de l'upload Cloudinary" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    let publicId = url.searchParams.get('public_id');
    const imageUrl = url.searchParams.get('url');

    if (!publicId && imageUrl) {
      const match = imageUrl.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (match) publicId = match[1];
    }

    if (!publicId) {
      try {
        const body = await request.json();
        publicId = body.public_id;
        if (!publicId && body.url) {
          const match = body.url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
          if (match) publicId = match[1];
        }
      } catch (e) {}
    }

    if (!publicId) {
      return new Response(JSON.stringify({ error: "Identifiant public_id ou URL de l'image manquant" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const delRes = await cloudinary.uploader.destroy(publicId);

    return new Response(JSON.stringify({
      success: true,
      public_id: publicId,
      result: delRes.result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error("Cloudinary delete error:", err);
    return new Response(JSON.stringify({ error: err.message || "Erreur lors de la suppression Cloudinary" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
