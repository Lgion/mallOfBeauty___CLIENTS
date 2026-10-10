import { clerkMiddleware } from '@clerk/astro/server';

const clerkHandler = clerkMiddleware();

export const onRequest = async (context, next) => {
  return await clerkHandler(context, next);
};
