import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// CORS Configuration (supporting localhost, custom domains, and Vercel preview/production URLs)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.endsWith('.vercel.app') ||
      (process.env.VERCEL_URL && origin.includes(process.env.VERCEL_URL))
    ) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static assets & client build (for monolithic local runs)
const clientDist = path.join(__dirname, '../../client/dist');
const clientPublic = path.join(__dirname, '../../client/public');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}
if (fs.existsSync(clientPublic)) {
  app.use(express.static(clientPublic));
}

// Health check endpoints
const healthHandler = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: "Skandha Group - Alekhya's Brundavan API"
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Connect to MongoDB on-demand (cached for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Database Connection Middleware Error]:', err.message);
  }
  next();
});

// Mount REST API
app.use('/api', apiRoutes);

// SPA fallback for HTML5 routing (when running monolithically locally)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Central error handler
app.use(errorHandler);

export default app;
