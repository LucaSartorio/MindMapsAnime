import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
await server.ssrLoadModule(process.env.MOD);
await server.close();
