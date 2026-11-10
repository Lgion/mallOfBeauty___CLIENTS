import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';

export const GET: APIRoute = async (context) => {
  try {
    // 1. Vérification de l'authentification Administrateur
    const auth = context.locals.auth ? context.locals.auth() : null;
    const userId = auth?.userId;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Non autorisé. Veuillez vous connecter.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await clerkClient(context).users.getUser(userId);
    const userEmails: string[] = (user.emailAddresses || [])
      .map(e => e.emailAddress?.trim().toLowerCase())
      .filter(Boolean);

    const parseEmails = (envVal: string | undefined): string[] => {
      if (!envVal) return [];
      return envVal.split(/[\s,;]+/).map(e => e.trim().toLowerCase()).filter(Boolean);
    };

    const adminEmails = parseEmails(process.env.ADMIN_EMAILS || import.meta.env.ADMIN_EMAILS);
    const employeeEmails = parseEmails(process.env.ADMIN_EMPLOYE || import.meta.env.ADMIN_EMPLOYE);

    const isAuthorized = userEmails.some(e => adminEmails.includes(e) || employeeEmails.includes(e));
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Accès réservé aux administrateurs.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Récupération des identifiants Vercel
    const token = process.env.VERCEL_TOKEN || process.env.VERCEL_BEARER_TOKEN || import.meta.env.VERCEL_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID || process.env.PROJECT_ID || import.meta.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID || import.meta.env.VERCEL_TEAM_ID;

    if (!token || !projectId) {
      return new Response(JSON.stringify({
        configured: false,
        message: "Variables VERCEL_TOKEN ou VERCEL_PROJECT_ID non détectées.",
        hasToken: Boolean(token),
        hasProjectId: Boolean(projectId)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Définition de la période (30 derniers jours)
    const untilDate = new Date();
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);

    const since = sinceDate.toISOString().split('T')[0];
    const until = untilDate.toISOString().split('T')[0];

    const baseUrl = 'https://api.vercel.com/v1/query/web-analytics';
    const baseParams = new URLSearchParams({
      projectId,
      since,
      until
    });
    if (teamId) {
      baseParams.append('teamId', teamId);
    }

    const headers = {
      Authorization: `Bearer ${token.trim()}`,
      'Content-Type': 'application/json'
    };

    // Helper pour fetcher l'API Vercel avec gestion des erreurs
    const fetchVercel = async (endpoint: string, extraParams: Record<string, string> = {}) => {
      const url = new URL(`${baseUrl}/${endpoint}`);
      baseParams.forEach((val, key) => url.searchParams.append(key, val));
      Object.entries(extraParams).forEach(([k, v]) => url.searchParams.append(k, v));

      const res = await fetch(url.toString(), { headers });
      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[Vercel Analytics API] ${endpoint} returned ${res.status}:`, errorText);
        return null;
      }
      return res.json();
    };

    // 4. Requêtes en parallèle vers les différents axes (Où, Quand, Comment)
    const [
      visitsCountResult,
      byDayResult,
      byPathResult,
      byReferrerResult,
      byCountryResult,
      byDeviceResult
    ] = await Promise.allSettled([
      fetchVercel('visits/count'),
      fetchVercel('visits/aggregate', { by: 'day' }),
      fetchVercel('visits/aggregate', { by: 'requestPath', limit: '10' }),
      fetchVercel('visits/aggregate', { by: 'referrerHostname', limit: '10' }),
      fetchVercel('visits/aggregate', { by: 'country', limit: '10' }),
      fetchVercel('visits/aggregate', { by: 'deviceType', limit: '5' })
    ]);

    const getValue = (result: PromiseSettledResult<any>) => 
      result.status === 'fulfilled' ? result.value : null;

    return new Response(JSON.stringify({
      configured: true,
      period: { since, until, days: 30 },
      overview: getValue(visitsCountResult) || { total: 0, pageViews: 0 },
      byDay: getValue(byDayResult) || [],
      byPath: getValue(byPathResult) || [],
      byReferrer: getValue(byReferrerResult) || [],
      byCountry: getValue(byCountryResult) || [],
      byDevice: getValue(byDeviceResult) || []
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=60' // Cache court de 1 minute pour fluidité
      }
    });

  } catch (error: any) {
    console.error('[Vercel Analytics Route Error]', error);
    return new Response(JSON.stringify({
      configured: false,
      error: error.message || 'Erreur interne lors de la récupération des statistiques.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

