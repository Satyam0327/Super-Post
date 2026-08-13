import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import generateHandler from './api/generate';
import * as oauthHandlers from './api/oauth';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.use(express.json());

  // API Route for Gemini
  app.post('/api/generate', generateHandler);

  // OAuth Routes
  app.get('/api/auth/linkedin/url', oauthHandlers.getLinkedinAuthUrl);
  app.get('/api/auth/twitter/url', oauthHandlers.getTwitterAuthUrl);
  
  app.get(['/auth/callback/linkedin', '/auth/callback/linkedin/'], oauthHandlers.handleLinkedinCallback);
  app.get(['/auth/callback/twitter', '/auth/callback/twitter/'], oauthHandlers.handleTwitterCallback);

  // Posting API Routes
  app.post('/api/post/linkedin', oauthHandlers.postToLinkedin);
  app.post('/api/post/twitter', oauthHandlers.postToTwitter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
