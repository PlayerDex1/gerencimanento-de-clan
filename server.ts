import express from 'express';
import { createServer as createViteServer } from 'vite';
import apiApp from './api/index.js';
import { startMarketBot } from './src/bot/marketBot.js';
import 'dotenv/config';

async function startServer() {
  const app = express();

  // Mount the API routes
  app.use(apiApp);

  // Setup Vite for local development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:3000');
    // Start Discord Market Bot
    startMarketBot();
  });
}

startServer();
