import { clerkMiddleware } from '@clerk/astro/server';

let clerkHandler: any = null;
try {
  clerkHandler = clerkMiddleware();
} catch (e) {
  console.warn('[Clerk] Failed to initialize middleware:', e);
}

export const onRequest = async (context: any, next: any) => {
  if (clerkHandler) {
    try {
      return await clerkHandler(context, next);
    } catch (err) {
      console.error('[Clerk middleware error]:', err);
      return await next();
    }
  }
  return await next();
};
