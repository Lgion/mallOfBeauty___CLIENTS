import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../lib/mongodb';

export const GET: APIRoute = async ({ params }) => {
  const collectionName = params.collection;
  if (!collectionName) return new Response("Collection missing", { status: 400 });
  
  try {
    const { db } = await connectToDatabase();
    const data = await db.collection(collectionName).find({}).toArray();
    return new Response(JSON.stringify(data), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const collectionName = params.collection;
  if (!collectionName) return new Response("Collection missing", { status: 400 });

  try {
    const data = await request.json();
    const { _id, ...rest } = data;
    const { db } = await connectToDatabase();
    if (rest.id) {
      await db.collection(collectionName).updateOne({ id: rest.id }, { $set: rest }, { upsert: true });
    } else {
      await db.collection(collectionName).insertOne(rest);
    }
    return new Response(JSON.stringify({ success: true, data: rest }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  const collectionName = params.collection;
  if (!collectionName) return new Response("Collection missing", { status: 400 });

  try {
    const data = await request.json();
    const { _id, ...rest } = data;
    const { db } = await connectToDatabase();
    const filter = rest.id ? { id: rest.id } : {};
    await db.collection(collectionName).updateOne(filter, { $set: rest }, { upsert: true });
    return new Response(JSON.stringify({ success: true, data: rest }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const collectionName = params.collection;
  if (!collectionName) return new Response("Collection missing", { status: 400 });

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response("Missing id", { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection(collectionName).deleteOne({ id });
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
