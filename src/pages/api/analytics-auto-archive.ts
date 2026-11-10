import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../lib/mongodb';

export const GET: APIRoute = async ({ request }) => {
  try {
    const { db } = await connectToDatabase();
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';

    // 1. Lire les paramètres de la boutique
    const settingsColl = db.collection('store_settings');
    const settings = (await settingsColl.findOne({})) || {};
    const retentionDays = Math.max(7, parseInt(String(settings.analyticsRetentionDays || 60), 10));
    const lastAutoArchiveMonth = settings.lastAutoArchiveMonth || "";

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Condition de déclenchement :
    // - Si force === true (déclenchement manuel par l'admin)
    // - OU si nous sommes le 1er du mois (ou au-delà) et que l'auto-archivage n'a pas encore tourné ce mois-ci
    const isDue = force || (now.getDate() >= 1 && lastAutoArchiveMonth !== currentMonthKey);

    if (!isDue) {
      return new Response(JSON.stringify({
        success: true,
        executed: false,
        reason: "already_ran_this_month",
        month: currentMonthKey,
        retentionDays,
        lastAutoArchiveMonth,
        lastAutoArchiveDate: settings.lastAutoArchiveDate || null
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Calcul du seuil de coupure : les événements antérieurs à (now - retentionDays) sont archivés
    const cutoffDate = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);
    const cutoffIso = cutoffDate.toISOString();

    const eventsColl = db.collection('analytics_events');
    const oldEvents = await eventsColl
      .find({ timestamp: { $lt: cutoffIso } })
      .sort({ timestamp: -1 })
      .toArray();

    // S'il n'y a aucun événement antérieur au seuil :
    if (oldEvents.length === 0) {
      await settingsColl.updateOne(
        { _id: settings._id },
        { 
          $set: { 
            lastAutoArchiveMonth: currentMonthKey,
            lastAutoArchiveDate: now.toISOString()
          } 
        }
      );
      return new Response(JSON.stringify({
        success: true,
        executed: true,
        archivedCount: 0,
        message: `Aucune interaction active n'est antérieure à ${retentionDays} jours.`,
        month: currentMonthKey,
        retentionDays,
        cutoffDate: cutoffIso
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Condensation des événements à archiver
    const compactEvents = oldEvents.map(e => [
      e.dateFormatted || e.timestamp?.slice(0, 10) || "",
      e.timeFormatted || "",
      e.type || "",
      e.label || "",
      e.path || "/",
      e.sessionId || ""
    ]);

    const metrics: Record<string, number> = {
      phone_call: 0,
      whatsapp: 0,
      instagram: 0,
      tiktok: 0,
      booking: 0,
      shopper: 0,
      loyalty: 0,
      vip_service: 0,
      catalog: 0,
      wave: 0
    };
    oldEvents.forEach(e => {
      const t = e.type || "other";
      metrics[t] = (metrics[t] || 0) + 1;
    });

    const archiveRecord = {
      id: `archive_auto_${currentMonthKey}_${Date.now()}`,
      archivedAt: now.toISOString(),
      isAutoArchive: true,
      retentionDaysApplied: retentionDays,
      period: {
        from: oldEvents[oldEvents.length - 1]?.timestamp || cutoffIso,
        to: oldEvents[0]?.timestamp || cutoffIso
      },
      totalClicks: oldEvents.length,
      metrics,
      eventsCount: oldEvents.length,
      eventsCompact: compactEvents
    };

    // 4. Enregistrer dans la collection analytics_archives
    await db.collection('analytics_archives').insertOne(archiveRecord);

    // 5. Supprimer ces événements archivés du journal actif
    await eventsColl.deleteMany({ timestamp: { $lt: cutoffIso } });

    // 6. Recalculer les compteurs restants pour analytics_clicks
    const remainingEvents = await eventsColl.find({}).sort({ timestamp: -1 }).toArray();
    const remainingMetrics: Record<string, number> = {
      phone_call: 0,
      whatsapp: 0,
      instagram: 0,
      tiktok: 0,
      booking: 0,
      shopper: 0,
      loyalty: 0,
      vip_service: 0,
      catalog: 0,
      wave: 0
    };
    remainingEvents.forEach(e => {
      const t = e.type || "other";
      remainingMetrics[t] = (remainingMetrics[t] || 0) + 1;
    });

    const lastEventObj = remainingEvents[0];
    const updatedClicksDoc = {
      id: "analytics",
      total: remainingEvents.length,
      ...remainingMetrics,
      events: remainingEvents.slice(0, 80),
      lastEvent: lastEventObj ? `${(lastEventObj.type || '').toUpperCase()}: ${lastEventObj.label || ''}` : "Archivage mensuel automatique",
      updatedAt: now.toISOString()
    };
    await db.collection('analytics_clicks').updateOne(
      { id: "analytics" },
      { $set: updatedClicksDoc },
      { upsert: true }
    );

    // 7. Enregistrer l'état du mois exécuté dans store_settings
    await settingsColl.updateOne(
      { _id: settings._id },
      { 
        $set: { 
          lastAutoArchiveMonth: currentMonthKey,
          lastAutoArchiveDate: now.toISOString()
        } 
      }
    );

    return new Response(JSON.stringify({
      success: true,
      executed: true,
      archivedCount: oldEvents.length,
      remainingCount: remainingEvents.length,
      archiveId: archiveRecord.id,
      month: currentMonthKey,
      retentionDays,
      cutoffDate: cutoffIso
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Erreur auto-archivage analytics:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const settingsColl = db.collection('store_settings');
    const settings = (await settingsColl.findOne({})) || {};

    const updates: Record<string, any> = {};
    if (typeof body.retentionDays === 'number') {
      updates.analyticsRetentionDays = Math.max(7, Math.min(365, body.retentionDays));
    }
    if (body.resetMonthFlag === true) {
      updates.lastAutoArchiveMonth = "";
    }

    if (Object.keys(updates).length > 0) {
      await settingsColl.updateOne({ _id: settings._id }, { $set: updates });
    }

    return new Response(JSON.stringify({ success: true, settings: updates }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

