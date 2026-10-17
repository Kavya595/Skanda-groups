/**
 * Configurable plot status color palette and style helpers for Leaflet, React Leaflet, 2D, and 3D
 */
export const STATUS_COLORS = {
  available: {
    fill: '#22c55e',
    stroke: '#15803d',
    label: 'Available',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  reserved: {
    fill: '#f59e0b',
    stroke: '#d97706',
    label: 'Reserved / On Hold',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  booked: {
    fill: '#2563eb',
    stroke: '#1d4ed8',
    label: 'Booked',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  sold: {
    fill: '#ef4444',
    stroke: '#b91c1c',
    label: 'Sold',
    badgeBg: 'bg-red-100 text-red-800 border-red-300'
  },
  blocked: {
    fill: '#64748b',
    stroke: '#475569',
    label: 'Unavailable / Blocked',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  selected: {
    fill: '#f97316',
    stroke: '#c2410c',
    label: 'Selected Plot',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-400'
  }
};

/**
 * Returns Leaflet path options for a plot polygon
 */
export function getPlotPathOptions(status = 'available', isSelected = false, isMatched = true, isHovered = false) {
  const normStatus = (status || 'available').toLowerCase();
  const config = STATUS_COLORS[normStatus] || STATUS_COLORS.available;

  if (isSelected) {
    return {
      color: '#ea580c', // Dark orange outline
      weight: 4,
      opacity: 1.0,
      fillColor: config.fill,
      fillOpacity: 0.95
    };
  }

  if (isHovered) {
    return {
      color: '#ffffff', // Crisp white outline on hover
      weight: 3,
      opacity: 1.0,
      fillColor: config.fill,
      fillOpacity: 0.90
    };
  }

  return {
    color: config.stroke,
    weight: 1.5,
    opacity: isMatched ? 1.0 : 0.25,
    fillColor: config.fill,
    fillOpacity: isMatched ? 0.72 : 0.15
  };
}
