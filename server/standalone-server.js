import http from 'node:http';
import { handlePlotApi } from './plotApiMiddleware.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.url && req.url.startsWith('/api')) {
    handlePlotApi(req, res);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'online',
      service: 'Skandha Groups - Plot Booking & Confirmation Map API',
      version: '1.0.0',
      dtcpNo: 'TLP NO. 87/2024/H',
      reraNo: 'PO2400009081',
      documentation: '/api/plots'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`[Plot Map API] Server running on http://localhost:${PORT}`);
  console.log(`[Plot Map API] API Endpoints available at http://localhost:${PORT}/api/plots`);
});
