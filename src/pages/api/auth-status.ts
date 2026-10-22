import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';

export const GET: APIRoute = async (context) => {
  try {
    const auth = context.locals.auth ? context.locals.auth() : null;
    const userId = auth?.userId;
    if (!userId) {
      return new Response(JSON.stringify({ isAdmin: false, role: 'public' }), {
        status: 200,
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

    let role = 'public';
    if (userEmails.some(e => adminEmails.includes(e))) role = 'admin';
    else if (userEmails.some(e => employeeEmails.includes(e))) role = 'employe';

    return new Response(JSON.stringify({ isAdmin: role === 'admin' || role === 'employe', role }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ isAdmin: false, error: error.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
