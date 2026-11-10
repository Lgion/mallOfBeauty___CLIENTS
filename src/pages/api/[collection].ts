import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../lib/mongodb';

export const GET: APIRoute = async ({ params, request }) => {
  const collectionName = params.collection;
  if (!collectionName) return new Response("Collection missing", { status: 400 });
  
  try {
    const { db } = await connectToDatabase();
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');
    const typeFilter = url.searchParams.get('type');
    const exportAll = url.searchParams.get('export') === 'true';

    // Support pagination, filtres et export pour analytics_events et collections volumineuses
    if (pageParam !== null || limitParam !== null || exportAll) {
      const query: Record<string, any> = {};
      if (typeFilter && typeFilter !== 'all') {
        query.type = typeFilter;
      }

      const total = await db.collection(collectionName).countDocuments(query);

      if (exportAll) {
        const allItems = await db.collection(collectionName)
          .find(query)
          .sort({ timestamp: -1, _id: -1 })
          .toArray();
        return new Response(JSON.stringify({ items: allItems, total }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const page = Math.max(1, parseInt(pageParam || '1', 10));
      const limit = Math.max(1, Math.min(100, parseInt(limitParam || '20', 10)));
      const skip = (page - 1) * limit;

      const items = await db.collection(collectionName)
        .find(query)
        .sort({ timestamp: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return new Response(JSON.stringify({
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Comportement standard (retourne array brut)
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
    const clearAll = url.searchParams.get('clearAll') === 'true';

    const { db } = await connectToDatabase();
    if (clearAll) {
      await db.collection(collectionName).deleteMany({});
      return new Response(JSON.stringify({ success: true, cleared: true }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!id) return new Response("Missing id", { status: 400 });

    await db.collection(collectionName).deleteOne({ id });
    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
