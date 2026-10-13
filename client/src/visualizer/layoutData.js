/**
 * Client Layout Data & Enriched Plots
 * Matches Brochure Page 2: Challampally / Alekhya's Brundavan
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
  { id: 'ROAD-HWY-EAST', name: "Srisailam Highway (NH-765)", width: '100ft+', type: 'highway', x: 990, y: 20, widthPx: 60, heightPx: 670, orientation: 'vertical' },
  { id: 'ROAD-33-EAST-SERVICE', name: "Proposed 33'-0\" Wide Road (Highway Service)", width: '33ft', type: 'service', x: 940, y: 20, widthPx: 35, heightPx: 670, orientation: 'vertical' },
  { id: 'ROAD-33-MID', name: "Proposed 33'-0\" Wide Road (Main Internal Boulevard)", width: '33ft', type: 'internal', x: 20, y: 275, widthPx: 920, heightPx: 40, orientation: 'horizontal' },
  { id: 'ROAD-33-V0', name: "Proposed 33'-0\" Wide Road", width: '33ft', type: 'internal', x: 140, y: 320, widthPx: 30, heightPx: 360, orientation: 'vertical' },
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
  reserved: {
    bg: '#F59E0B',        // Amber
    border: '#D97706',
    text: '#78350F',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    threeColor: '#F59E0B',
    label: 'Reserved'
  },
  sold: {
    bg: '#94A3B8',          // Slate Grey / soft muted
    border: '#64748B',
    text: '#1E293B',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    threeColor: '#64748B',
    label: 'Sold'
  },
  blocked: {
    bg: '#475569',       // Deep Charcoal
    border: '#334155',
    text: '#FFFFFF',
    badge: 'bg-zinc-200 text-zinc-800 border-zinc-400',
    threeColor: '#475569',
    label: 'Blocked'
  }
};
