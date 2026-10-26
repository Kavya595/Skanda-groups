/**
 * Client Layout Data & Enriched Plots
 * Matches Brochure Page 2: Challampally / Kadthal Venture
 * DTCP Approved TLP NO. 87/2024/H | TS RERA: P02400009081
 */

export const parkData = {
  id: 'PARK-01',
  name: 'Site Reserved for Open Space (Park)',
  areaCents: 'Ac. 0.758 cents',
  dimensions: "209'-9\" x 169'-3\" x 201'-6\"",
  bounds: { x: 40, y: 80, width: 220, height: 180 },
  features: ['Landscaped Gardens', 'Jogging Track', 'Children Play Area', 'Lush Avenue Trees']
};

export const layoutRoads = [
  { id: 'ROAD-60-TOP', name: "Proposed 60'-0\" Wide Road (to Maisigandi Temple)", width: '60ft', type: 'arterial', x: 20, y: 20, widthPx: 960, heightPx: 45, orientation: 'horizontal' },
  { id: 'ROAD-33-EAST', name: "Proposed 33'-0\" Wide Road", width: '33ft', type: 'arterial', x: 940, y: 20, widthPx: 45, heightPx: 670, orientation: 'vertical' },
  { id: 'ROAD-33-MID', name: "Proposed 33'-0\" Wide Road (Main Internal Boulevard)", width: '33ft', type: 'internal', x: 20, y: 275, widthPx: 920, heightPx: 40, orientation: 'horizontal' },
  { id: 'ROAD-33-V0', name: "Proposed 33'-0\" Wide Road (Between Park & Plots)", width: '33ft', type: 'internal', x: 140, y: 320, widthPx: 30, heightPx: 360, orientation: 'vertical' },
  { id: 'ROAD-33-V1', name: "Proposed 33'-0\" Wide Road", width: '33ft', type: 'internal', x: 375, y: 65, widthPx: 30, heightPx: 615, orientation: 'vertical' },
  { id: 'ROAD-33-V2', name: "Proposed 33'-0\" Wide Road", width: '33ft', type: 'internal', x: 535, y: 65, widthPx: 30, heightPx: 615, orientation: 'vertical' },
  { id: 'ROAD-33-V3', name: "Proposed 33'-0\" Wide Road", width: '33ft', type: 'internal', x: 695, y: 65, widthPx: 30, heightPx: 615, orientation: 'vertical' },
  { id: 'ROAD-33-V4', name: "Proposed 33'-0\" Wide Road", width: '33ft', type: 'internal', x: 845, y: 65, widthPx: 30, heightPx: 615, orientation: 'vertical' }
];

export const statusColors = {
  available: {
    bg: '#10B981',       // Emerald Green
    border: '#059669',
    text: '#064E3B',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    threeColor: '#10B981',
    label: 'Available'
  },
  booked: {
    bg: '#F59E0B',        // Amber / Sunny Yellow
    border: '#D97706',
    text: '#78350F',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    threeColor: '#F59E0B',
    label: 'Booked'
  },
  sold: {
    bg: '#F89898',        // Coral Red / Sold Out
    border: '#EF4444',
    text: '#7F1D1D',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    threeColor: '#F89898',
    label: 'Sold Out'
  }
};

statusColors.reserved = statusColors.booked;
statusColors.blocked = statusColors.available;
