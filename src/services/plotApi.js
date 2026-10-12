/**
 * Plot Map API Service Layer
 * Connects directly to the REST API endpoints:
 * - GET  /api/plots
 * - GET  /api/plots/stats
 * - GET  /api/bookings
 * - POST /api/plots/:id/approve      (Admin Plot Booking Confirmation -> turns Blue #2563eb)
 * - POST /api/plots/:id/book         (Admin Direct Plot Booking -> turns Blue #2563eb)
 * - POST /api/plots/:id/confirm-sold (Admin Confirms Sale Deed -> turns Red #ef4444)
 * - POST /api/plots/:id/release      (Admin Releases Plot -> turns Green #10b981)
 * - POST /api/bookings/request       (Customer/Agent submits booking request)
 */

const API_BASE = '/api';

export const plotApi = {
  /**
   * Fetch all 96 masterplan plots with live status and color
   */
  async getPlots() {
    try {
      const res = await fetch(`${API_BASE}/plots`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[PlotAPI] Failed to fetch plots from API, fallback to localStorage/cache:', err.message);
      return null;
    }
  },

  /**
   * Fetch plot stats
   */
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/plots/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  /**
   * Fetch booking requests queue
   */
  async getBookings() {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  /**
   * ADMIN ACTION: Approve a plot booking (turns plot Blue)
   */
  async approvePlot(plotId, details = {}) {
    const res = await fetch(`${API_BASE}/plots/${plotId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to approve plot #${plotId}`);
    }
    return await res.json();
  },

  /**
   * ADMIN ACTION: Direct plot booking (turns plot Blue)
   */
  async bookPlot(plotId, details = {}) {
    const res = await fetch(`${API_BASE}/plots/${plotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to book plot #${plotId}`);
    }
    return await res.json();
  },

  /**
   * ADMIN ACTION: Confirm sale deed (turns plot Red)
   */
  async confirmSold(plotId, details = {}) {
    const res = await fetch(`${API_BASE}/plots/${plotId}/confirm-sold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to confirm sold plot #${plotId}`);
    }
    return await res.json();
  },

  /**
   * ADMIN ACTION: Release plot back to Available (turns plot Green)
   */
  async releasePlot(plotId, details = {}) {
    const res = await fetch(`${API_BASE}/plots/${plotId}/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to release plot #${plotId}`);
    }
    return await res.json();
  },

  /**
   * Submit new booking request (Awaiting Admin Confirmation)
   */
  async requestBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to submit booking request');
    }
    return await res.json();
  }
};
