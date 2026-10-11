import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

// Use Vercel adapter when deploying on Vercel or explicitly requested
const isVercel = process.env.VERCEL === '1' || !process.env.USE_NODE;

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [clerk()],
  server: {
    port: 5173,
    host: true
  }
});
