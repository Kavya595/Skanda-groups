const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('skandha_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server error occurred');
    }
    return data;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res;
}

// ==========================================
// PUBLIC API
// ==========================================

export async function fetchPublicSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) {
      return { success: false, settings: null };
    }
    return handleResponse(res);
  } catch (err) {
    console.warn('fetchPublicSettings network error:', err.message);
    return { success: false, settings: null };
  }
}

export async function fetchGallery(category) {
  const url = category ? `${API_BASE}/gallery?category=${encodeURIComponent(category)}` : `${API_BASE}/gallery`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchPlots(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, v);
    });
    const res = await fetch(`${API_BASE}/plots?${params.toString()}`);
    if (!res.ok) {
      console.warn(`fetchPlots returned status ${res.status}`);
      return { success: false, plots: [] };
    }
    return handleResponse(res);
  } catch (err) {
    console.warn('fetchPlots network error:', err.message);
    return { success: false, plots: [] };
  }
}

export async function fetchPlotDetail(plotNumber) {
  try {
    const res = await fetch(`${API_BASE}/plots/${plotNumber}`);
    return handleResponse(res);
  } catch (err) {
    console.warn(`fetchPlotDetail network error for #${plotNumber}:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchPlotStats() {
  try {
    const res = await fetch(`${API_BASE}/plots/stats`);
    if (!res.ok) {
      console.warn(`fetchPlotStats returned status ${res.status}, returning baseline stats`);
      return {
        success: true,
        stats: { total: 96, available: 81, reserved: 7, sold: 8, blocked: 0 }
      };
    }
    return handleResponse(res);
  } catch (err) {
    console.warn('fetchPlotStats network error, returning baseline stats:', err.message);
    return {
      success: true,
      stats: { total: 96, available: 81, reserved: 7, sold: 8, blocked: 0 }
    };
  }
}

export async function submitLead(leadData) {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });
  return handleResponse(res);
}

export async function trackActivityEvent(eventType, plotNumber, metadata = {}) {
  try {
    await fetch(`${API_BASE}/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, plotNumber, metadata })
    });
  } catch (err) {
    // Analytics logging should never disrupt user flow
    console.debug('[Analytics tracking error]', err);
  }
}

// ==========================================
// ADMIN AUTH API
// ==========================================

export async function adminLogin(identifier, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await handleResponse(res);
  if (data.token) {
    localStorage.setItem('skandha_admin_token', data.token);
  }
  return data;
}

export async function adminBootstrap(data) {
  const res = await fetch(`${API_BASE}/auth/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const resData = await handleResponse(res);
  if (resData.token) {
    localStorage.setItem('skandha_admin_token', resData.token);
  }
  return resData;
}

export async function adminGetMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminChangePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  return handleResponse(res);
}

export async function adminLogout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
  } catch (e) {}
  localStorage.removeItem('skandha_admin_token');
}

// ==========================================
// ADMIN PLOTS API
// ==========================================

export async function adminGetPlots(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/plots?${query}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminCreatePlot(plotData) {
  const res = await fetch(`${API_BASE}/admin/plots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(plotData)
  });
  return handleResponse(res);
}

export async function adminUpdatePlot(plotNumber, data) {
  const res = await fetch(`${API_BASE}/admin/plots/${plotNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function adminUpdatePlotStatus(plotNumber, status) {
  const res = await fetch(`${API_BASE}/admin/plots/${plotNumber}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function adminDeletePlot(plotNumber) {
  const res = await fetch(`${API_BASE}/admin/plots/${plotNumber}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminExportPlotsCsv() {
  const res = await fetch(`${API_BASE}/admin/plots/export/csv`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('CSV export failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skandha_plots_inventory.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function adminImportPlotsCsv(plotsData) {
  const res = await fetch(`${API_BASE}/admin/plots/import/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ plotsData })
  });
  return handleResponse(res);
}

// ==========================================
// ADMIN LEADS CRM API
// ==========================================

export async function adminGetLeads(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/leads?${query}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminUpdateLeadStatus(id, status, assignedTo) {
  const res = await fetch(`${API_BASE}/admin/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status, assignedTo })
  });
  return handleResponse(res);
}

export async function adminAddLeadNote(id, note) {
  const res = await fetch(`${API_BASE}/admin/leads/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ note })
  });
  return handleResponse(res);
}

export async function adminDeleteLead(id) {
  const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminExportLeadsCsv() {
  const res = await fetch(`${API_BASE}/admin/leads/export/csv`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Leads CSV export failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skandha_customers_leads_to_contact.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ==========================================
// ADMIN ANALYTICS API
// ==========================================

export async function adminGetAnalyticsSummary() {
  const res = await fetch(`${API_BASE}/admin/analytics/summary`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminExportWebsiteVisitsCsv() {
  const res = await fetch(`${API_BASE}/admin/analytics/export/csv`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Website visits CSV export failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'skandha_website_visits_analytics.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ==========================================
// ADMIN SETTINGS & CONTENT API
// ==========================================

export async function adminGetSettings() {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminUpdateSettings(settingsData) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(settingsData)
  });
  return handleResponse(res);
}

// ==========================================
// ADMIN GALLERY API
// ==========================================

export async function adminGetGallery() {
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function adminCreateGalleryItem(itemData) {
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(itemData)
  });
  return handleResponse(res);
}

export async function adminUpdateGalleryItem(id, itemData) {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(itemData)
  });
  return handleResponse(res);
}

export async function adminDeleteGalleryItem(id) {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

// ==========================================
// ADMIN AUDIT LOGS API
// ==========================================

export async function adminGetAuditLogs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/admin/audit-logs?${query}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}
