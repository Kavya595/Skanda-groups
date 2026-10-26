import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureDefaultAdmin } from './controllers/authController.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await ensureDefaultAdmin();
  } catch (dbErr) {
    console.warn('[Startup Notice] Initial database connection was not ready:', dbErr.message);
  }

  try {
    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Skandha Group API Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log(` API Base:     http://localhost:${PORT}/api`);
      console.log(`=======================================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n[Server Error] Port ${PORT} is already in use by another process.`);
        console.error(`Please stop any existing process on port ${PORT} or specify a different PORT in server/.env.\n`);
      } else {
        console.error('[Server Error]', err);
      }
    });
  } catch (err) {
    console.error('[Startup Error] Failed to start HTTP server:', err.message);
    process.exit(1);
  }
}

// In standard local development / standalone process, start listening
if (!process.env.VERCEL) {
  startServer();
}

// Default export required by Vercel Express service & serverless invocation
export default app;
