import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_PLOTS_DATA } from '../src/data/plotData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'plots-db.json');
const BOOKINGS_FILE = path.join(__dirname, 'bookings-db.json');

// In-memory data store with file persistence
let plotsData = [];
let bookingsData = [];

// Initialize data
function initDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      plotsData = JSON.parse(content);
    } else {
      plotsData = JSON.parse(JSON.stringify(INITIAL_PLOTS_DATA));
      savePlots();
    }
  } catch (err) {
    console.error('[PlotAPI] Error loading plots DB, using initial data:', err.message);
    plotsData = JSON.parse(JSON.stringify(INITIAL_PLOTS_DATA));
  }

  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const content = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      bookingsData = JSON.parse(content);
    } else {
      // Sample pending booking requests for admin to review & approve
      bookingsData = [
        {
          id: 'bk-101',
          plotNumber: 15,
          plotId: 15,
          customerName: 'K. Ramesh Reddy',
          customerPhone: '+91 98480 22334',
          requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'pending_approval',
          tokenAmount: '₹50,000',
          facing: 'West',
          sqYards: 202,
          notes: 'Customer submitted token advance via NEFT. Awaiting Admin Approval.'
        },
        {
          id: 'bk-102',
          plotNumber: 23,
          plotId: 23,
          customerName: 'Priya Sharma',
          customerPhone: '+91 97012 34567',
          requestedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          status: 'pending_approval',
          tokenAmount: '₹1,00,000',
          facing: 'West',
          sqYards: 183,
          notes: 'Site visit completed. Spot booking confirmation requested.'
        }
      ];
      saveBookings();
    }
  } catch (err) {
    console.error('[PlotAPI] Error loading bookings DB:', err.message);
    bookingsData = [];
  }
}

function savePlots() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(plotsData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PlotAPI] Error saving plots DB:', err.message);
  }
}

function saveBookings() {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookingsData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PlotAPI] Error saving bookings DB:', err.message);
  }
}

initDatabase();

// Color config for response
const STATUS_COLORS = {
  available: { status: 'available', color: '#10b981', label: 'Available (Green)' },
  booked: { status: 'booked', color: '#2563eb', label: 'Booked (Blue)' },
  sold: { status: 'sold', color: '#ef4444', label: 'Sold (Red)' }
};

// Calculate summary stats
function getStats() {
  let available = 0, booked = 0, sold = 0;
  plotsData.forEach(p => {
    if (p.status === 'booked') booked++;
    else if (p.status === 'sold') sold++;
    else available++;
  });
  return {
    total: plotsData.length,
    available,
    booked,
    sold,
    pendingApprovals: bookingsData.filter(b => b.status === 'pending_approval').length
  };
}

// Helper to parse JSON body from incoming Node HTTP request
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Helper to send JSON response
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

/**
 * Handle incoming API requests
 */
export async function handlePlotApi(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const parsedUrl = new URL(req.url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 1. GET /api/plots - List all plots
  if (pathname === '/api/plots' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      stats: getStats(),
      count: plotsData.length,
      data: plotsData
    });
  }

  // 2. GET /api/plots/stats - Summary counts
  if (pathname === '/api/plots/stats' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      stats: getStats()
    });
  }

  // 3. GET /api/bookings - List all booking approval requests
  if (pathname === '/api/bookings' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      count: bookingsData.length,
      pendingCount: bookingsData.filter(b => b.status === 'pending_approval').length,
      bookings: bookingsData
    });
  }

  // 4. POST /api/bookings/request - Submit new plot booking request (from customer/agent)
  if (pathname === '/api/bookings/request' && method === 'POST') {
    const body = await parseBody(req);
    const plotNo = Number(body.plotNumber || body.plotId);
    const plot = plotsData.find(p => p.number === plotNo || p.id === plotNo);

    if (!plot) {
      return sendJson(res, 404, { success: false, error: `Plot #${plotNo} not found.` });
    }

    if (plot.status !== 'available') {
      return sendJson(res, 400, { 
        success: false, 
        error: `Plot #${plotNo} is currently ${plot.status.toUpperCase()} and cannot be booked.` 
      });
    }

    const newBooking = {
      id: `bk-${Date.now()}`,
      plotNumber: plot.number,
      plotId: plot.id,
      customerName: body.customerName || body.name || 'Anonymous Buyer',
      customerPhone: body.customerPhone || body.phone || 'Not provided',
      requestedAt: new Date().toISOString(),
      status: 'pending_approval',
      tokenAmount: body.tokenAmount || 'Token on Registration',
      facing: plot.facing,
      sqYards: plot.sqYards,
      notes: body.notes || 'Inquiry submitted online awaiting Admin approval.'
    };

    bookingsData.unshift(newBooking);
    saveBookings();

    return sendJson(res, 201, {
      success: true,
      message: `Booking request for Plot #${plot.number} created. Awaiting Admin Approval.`,
      booking: newBooking
    });
  }

  // Match /api/plots/:id routes
  const plotRouteMatch = pathname.match(/^\/api\/plots\/(\d+)(?:\/(.*))?$/);
  if (plotRouteMatch) {
    const plotId = Number(plotRouteMatch[1]);
    const action = plotRouteMatch[2]; // undefined, 'book', 'approve', 'confirm-sold', 'release'
    const plotIndex = plotsData.findIndex(p => p.number === plotId || p.id === plotId);

    if (plotIndex === -1) {
      return sendJson(res, 404, { success: false, error: `Plot #${plotId} does not exist in masterplan.` });
    }

    const plot = plotsData[plotIndex];

    // GET /api/plots/:id
    if (!action && method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        data: plot,
        colorInfo: STATUS_COLORS[plot.status] || STATUS_COLORS.available
      });
    }

    // POST /api/plots/:id/approve - ADMIN APPROVAL ACTION
    if (action === 'approve' && method === 'POST') {
      const body = await parseBody(req);
      
      plotsData[plotIndex] = {
        ...plot,
        status: 'booked',
        lastUpdated: new Date().toISOString(),
        customer: {
          name: body.customerName || plot.customer?.name || 'Approved Buyer',
          phone: body.customerPhone || plot.customer?.phone || '',
          tokenAmount: body.tokenAmount || plot.customer?.tokenAmount || 'Token Confirmed',
          approvedBy: 'Admin',
          approvedAt: new Date().toISOString(),
          notes: body.notes || 'Booking confirmed and approved by Admin.'
        }
      };

      // Also mark corresponding booking request as approved if exists
      const relatedBooking = bookingsData.find(b => (b.plotNumber === plotId || b.plotId === plotId) && b.status === 'pending_approval');
      if (relatedBooking) {
        relatedBooking.status = 'approved';
        relatedBooking.approvedAt = new Date().toISOString();
        relatedBooking.adminNotes = body.notes || 'Approved by Admin';
        saveBookings();
      }

      savePlots();

      return sendJson(res, 200, {
        success: true,
        message: `Plot #${plotId} booking approved by Admin! Plot color updated to Blue (#2563eb).`,
        color: '#2563eb',
        plot: plotsData[plotIndex],
        stats: getStats()
      });
    }

    // POST /api/plots/:id/book - DIRECT BOOK ACTION
    if (action === 'book' && method === 'POST') {
      const body = await parseBody(req);

      plotsData[plotIndex] = {
        ...plot,
        status: 'booked',
        lastUpdated: new Date().toISOString(),
        customer: {
          name: body.customerName || body.name || 'Direct Booking',
          phone: body.customerPhone || body.phone || '',
          tokenAmount: body.tokenAmount || 'Advance Token Paid',
          bookedBy: 'Admin Access',
          bookedAt: new Date().toISOString(),
          notes: body.notes || 'Admin confirmed direct plot booking.'
        }
      };

      savePlots();

      return sendJson(res, 200, {
        success: true,
        message: `Plot #${plotId} booked successfully! Status changed to Booked. Color updated to Blue (#2563eb).`,
        color: '#2563eb',
        plot: plotsData[plotIndex],
        stats: getStats()
      });
    }

    // POST /api/plots/:id/confirm-sold - CONFIRM SOLD OUT DEED
    if (action === 'confirm-sold' && method === 'POST') {
      const body = await parseBody(req);

      plotsData[plotIndex] = {
        ...plot,
        status: 'sold',
        lastUpdated: new Date().toISOString(),
        customer: {
          name: body.customerName || plot.customer?.name || 'Registered Owner',
          phone: body.customerPhone || plot.customer?.phone || '',
          deedNumber: body.deedNumber || 'REG-' + Date.now().toString().slice(-6),
          soldBy: 'Admin Registration',
          soldAt: new Date().toISOString(),
          notes: body.notes || 'Registration deed completed. Plot sold out.'
        }
      };

      savePlots();

      return sendJson(res, 200, {
        success: true,
        message: `Plot #${plotId} sale deed confirmed! Status changed to Sold. Color updated to Red (#ef4444).`,
        color: '#ef4444',
        plot: plotsData[plotIndex],
        stats: getStats()
      });
    }

    // POST /api/plots/:id/release - CANCEL / RELEASE BACK TO GREEN
    if (action === 'release' && method === 'POST') {
      plotsData[plotIndex] = {
        ...plot,
        status: 'available',
        lastUpdated: new Date().toISOString(),
        customer: null
      };

      savePlots();

      return sendJson(res, 200, {
        success: true,
        message: `Plot #${plotId} released back to Available! Color updated to Green (#10b981).`,
        color: '#10b981',
        plot: plotsData[plotIndex],
        stats: getStats()
      });
    }
  }

  // 404 for unknown route
  return sendJson(res, 404, {
    success: false,
    error: `API endpoint ${method} ${pathname} not found.`,
    availableEndpoints: [
      'GET  /api/plots',
      'GET  /api/plots/stats',
      'GET  /api/plots/:id',
      'POST /api/plots/:id/approve',
      'POST /api/plots/:id/book',
      'POST /api/plots/:id/confirm-sold',
      'POST /api/plots/:id/release',
      'GET  /api/bookings',
      'POST /api/bookings/request'
    ]
  });
}

/**
 * Vite Plugin definition for seamless dev-server middleware
 */
export function plotApiVitePlugin() {
  return {
    name: 'plot-booking-api-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          handlePlotApi(req, res);
        } else {
          next();
        }
      });
    }
  };
}
