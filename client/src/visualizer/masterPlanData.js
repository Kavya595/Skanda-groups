/**
 * Master Plan Digitized GIS Dataset — Alekhya's Brundavan, Kadthal
 * DTCP Approved Layout: TLP NO. 87/2024/H | TS RERA: PO2400009081
 * Reference: Authoritative Brochure Page 2 (96 Plots, Ac. 0.758 Park, Srisailam Highway NH-765)
 *
 * Local Coordinate System:
 * - Origin (0, 0): Center of layout
 * - X: West (-) to East (+) towards Srisailam Highway
 * - Z: North (-) to South (+) towards Phase 4
 * - Y: Height (elevation)
 * Units: meters (1 meter ~ 3.28 feet)
 */

export const LAYOUT_BOUNDS = {
  minX: -88,
  maxX: 70,
  minZ: -52,
  maxZ: 64,
  centerX: -9,
  centerZ: 6,
  width: 158,
  depth: 116
};

/**
 * Real-World Geographic Alignment at Kadthal, Srisailam Highway (NH-765)
 * Location: Maisigandi Temple Road, Kadthal, Ranga Reddy Dist, Telangana
 * DTCP Approval: TLP NO. 87/2024/H | TS RERA: PO2400009081
 */
export const SITE_GEO = {
  center: [16.9555, 78.5125], // [lat, lng] Kadthal Maisigandi Temple Road, Srisailam Highway
  zoom: 18,
  minZoom: 10,
  maxZoom: 21,
  locality: "Kadthal, Srisailam Highway, Hyderabad",
  pinCode: "509358",
  state: "Telangana"
};

// Coordinate projection from local (x, z) meters to [lat, lng]
export function localToLatLng(x, z) {
  const LAT_METERS_PER_DEG = 110649;
  const LNG_METERS_PER_DEG = 106399;
  const lat = SITE_GEO.center[0] - (z / LAT_METERS_PER_DEG);
  const lng = SITE_GEO.center[1] + (x / LNG_METERS_PER_DEG);
  return [lat, lng];
}

/**
 * Exact Digitized Sanctioned Boundary Polygon from Authoritative Brochure Map
 * Traces exact cuts, the diagonal taper under Plot 36 (42'-9" down to 19'-9"),
 * the stepped southern blocks, vertical road stubs opening to 4th Phase,
 * East 33' road boundary, and Central Park (Ac. 0.758 cents).
 */
export const SITE_BOUNDARY_LOCAL = [
  // 1. Top-Left: North-West corner at 60'-0" road frontage
  [-88, -52],
  // 2. Top-Right: North-East corner at 60' road & East 33' road junction
  [70, -52],
  // 3. East: Along East 33' road to Southeast corner of Plot 96
  [70, 60],
  // 4. Block K bottom (Plot 96 & 83)
  [57, 60],
  // 5-6. Road V4 opening to 4th Phase (between Block K and Block J)
  [57, 64],
  [50, 64],
  // 7. Block J bottom (Plot 82 & 71)
  [50, 60],
  [29, 60],
  // 8-9. Road V3 opening to 4th Phase (between Block J and Block I)
  [29, 64],
  [22, 64],
  // 10. Block I bottom (Plot 70 & 59)
  [22, 60],
  [0, 60],
  // 11-12. Road V2 opening to 4th Phase (between Block I and Block H)
  [0, 64],
  [-7, 64],
  // 13. Block H bottom (Plot 57 & 56)
  [-7, 60],
  [-29, 60],
  // 14-15. Road V1 opening to 4th Phase (between Block H and Block G)
  [-29, 64],
  [-36, 64],
  // 16. Block G bottom (Plot 46 & 37)
  [-36, 60],
  [-58, 60],
  // 17-18. Road V0 opening to 4th Phase (between Block G and Block F)
  [-58, 64],
  [-65, 64],
  // 19. Block F bottom: Southeast corner of Plot 36 (facing Road V0)
  [-65, 60],
  // 20. Exact diagonal taper cut under Plot 36 (19'-9" west vs 42'-9" east depth)
  [-78, 54],
  // 21. West edge of Block F (along Plots 36, 35, 34, 33, 32, 31)
  [-78, 4],
  // 22. Jog West along 33' Road to Southwest corner of Park
  [-88, 4],
  // 23. Up West boundary of Park (Ac. 0.758 cents, 209'-9" length)
  [-88, -42]
];

export const statusColors = {
  available: {
    bg: '#9BD89E',         // Plots99 Soft Map Green
    border: '#6BBF6F',
    text: '#064E3B',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    threeColor: '#9BD89E',
    label: 'Available'
  },
  reserved: {
    bg: '#FBE38E',         // Plots99 Warm Sunny Yellow
    border: '#EAB308',
    text: '#78350F',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    threeColor: '#FBE38E',
    label: 'Reserved'
  },
  sold: {
    bg: '#F89898',         // Plots99 Soft Coral Red
    border: '#EF4444',
    text: '#7F1D1D',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    threeColor: '#F89898',
    label: 'Sold'
  },
  blocked: {
    bg: '#CBD5E1',         // Plots99 Soft Ash Grey
    border: '#94A3B8',
    text: '#1E293B',
    badge: 'bg-slate-200 text-slate-800 border-slate-400',
    threeColor: '#CBD5E1',
    label: 'Blocked'
  }
};

export const parkData = {
  id: 'PARK-01',
  name: 'Site Reserved for Open Space (Park)',
  areaCents: 'Ac. 0.758 cents',
  dimensions: "209'-9\" x 169'-3\" x 201'-6\"",
  polygon: [
    [-88, -42],
    [-58, -42],
    [-58, -3],
    [-88, -3]
  ],
  center: [-73, -22.5],
  width: 30,
  depth: 39,
  features: ['Landscaped Gardens', 'Jogging Track', 'Children Play Area', 'Lush Avenue Palm Trees']
};

export const layoutRoads = [
  {
    id: 'ROAD-60-TOP',
    name: "Proposed 60'-0\" Wide Road (to Maisigandi Temple)",
    shortName: "60' ROAD",
    width: '60ft',
    type: 'arterial',
    polygon: [
      [-88, -52],
      [70, -52],
      [70, -42],
      [-88, -42]
    ],
    center: [-9, -47],
    widthMeters: 10,
    hasDivider: true
  },
  {
    id: 'ROAD-HWY-EAST',
    name: "Srisailam Highway (NH-765)",
    shortName: "SRISAILAM HIGHWAY",
    width: '100ft+',
    type: 'highway',
    polygon: [
      [74, -56],
      [90, -56],
      [90, 66],
      [74, 66]
    ],
    center: [82, 5],
    widthMeters: 16,
    hasDivider: true
  },
  {
    id: 'ROAD-33-SERVICE',
    name: "Proposed 33'-0\" Wide Road (facing Srisailam Highway)",
    shortName: "33' EAST ROAD",
    width: '33ft',
    type: 'service',
    polygon: [
      [63, -52],
      [70, -52],
      [70, 60],
      [63, 60]
    ],
    center: [66.5, 4],
    widthMeters: 7
  },
  {
    id: 'ROAD-33-MID',
    name: "Proposed 33'-0\" Wide Road (Internal Main Boulevard)",
    shortName: "33' MAIN ROAD",
    width: '33ft',
    type: 'internal',
    polygon: [
      [-88, -3],
      [63, -3],
      [63, 4],
      [-88, 4]
    ],
    center: [-12.5, 0.5],
    widthMeters: 7
  },
  {
    id: 'ROAD-33-V0',
    name: "Proposed 33'-0\" Wide Road (to 4th Phase)",
    shortName: "33' ROAD",
    width: '33ft',
    type: 'internal',
    polygon: [
      [-65, 4],
      [-58, 4],
      [-58, 64],
      [-65, 64]
    ],
    center: [-61.5, 34],
    widthMeters: 7
  },
  {
    id: 'ROAD-33-V1',
    name: "Proposed 33'-0\" Wide Road (to 4th Phase)",
    shortName: "33' ROAD",
    width: '33ft',
    type: 'internal',
    polygon: [
      [-36, -42],
      [-29, -42],
      [-29, 64],
      [-36, 64]
    ],
    center: [-32.5, 11],
    widthMeters: 7
  },
  {
    id: 'ROAD-33-V2',
    name: "Proposed 33'-0\" Wide Road (to 4th Phase)",
    shortName: "33' ROAD",
    width: '33ft',
    type: 'internal',
    polygon: [
      [-7, -42],
      [0, -42],
      [0, 64],
      [-7, 64]
    ],
    center: [-3.5, 11],
    widthMeters: 7
  },
  {
    id: 'ROAD-33-V3',
    name: "Proposed 33'-0\" Wide Road (to 4th Phase)",
    shortName: "33' ROAD",
    width: '33ft',
    type: 'internal',
    polygon: [
      [22, -42],
      [29, -42],
      [29, 64],
      [22, 64]
    ],
    center: [25.5, 11],
    widthMeters: 7
  },
  {
    id: 'ROAD-33-V4',
    name: "Proposed 33'-0\" Wide Road (to 4th Phase)",
    shortName: "33' ROAD",
    width: '33ft',
    type: 'internal',
    polygon: [
      [50, -42],
      [57, -42],
      [57, 64],
      [50, 64]
    ],
    center: [53.5, 11],
    widthMeters: 7
  }
];

// Helper to create rectangular polygon quad
function createQuad(x0, x1, z0, z1) {
  return [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1]
  ];
}

// Master Plot Specifications digitized from Brochure Page 2
export const masterPlotsData = [
  // ==========================================
  // TOP SECTION: NORTH BLOCKS (Z: -42 to -3)
  // ==========================================

  // BLOCK E-TOP (Highway Service Strip: Plots 1 to 6)
  // X: 57 to 63 (Width 6m). Z range: -42 to -3 (39m / 6 plots = 6.5m each)
  { plotNumber: 1, block: 'Block E', areaSqYds: 241, dimensions: "58'-3\" x 37'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'reserved', quad: [57, 63, -42, -35.5] },
  { plotNumber: 2, block: 'Block E', areaSqYds: 247, dimensions: "58'-3\" x 38'-3\"", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63, -35.5, -29] },
  { plotNumber: 3, block: 'Block E', areaSqYds: 217, dimensions: "59'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63, -29, -22.5] },
  { plotNumber: 4, block: 'Block E', areaSqYds: 221, dimensions: "60'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63, -22.5, -16] },
  { plotNumber: 5, block: 'Block E', areaSqYds: 225, dimensions: "61'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63, -16, -9.5] },
  { plotNumber: 6, block: 'Block E', areaSqYds: 385, dimensions: "63' x 55'", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold', quad: [57, 63, -9.5, -3] },

  // BLOCK D-TOP (Plots 7 to 12)
  // Between Road V3 (X: 29) and Road V4 (X: 50). Center X: 39.5.
  // Z range: -42 to -3 (39m / 3 plots = 13m each)
  // West Row (facing Road V3): Plots 10, 8, 7
  { plotNumber: 10, block: 'Block D', areaSqYds: 243, dimensions: "55'-1\" x 39'-9\"", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available', quad: [29, 39.5, -42, -29] },
  { plotNumber: 8,  block: 'Block D', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, -29, -16] },
  { plotNumber: 7,  block: 'Block D', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, -16, -3] },
  // East Row (facing Road V4): Plots 9, 11, 12
  { plotNumber: 9,  block: 'Block D', areaSqYds: 240, dimensions: "55'-1\" x 39'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'available', quad: [39.5, 50, -42, -29] },
  { plotNumber: 11, block: 'Block D', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, -29, -16] },
  { plotNumber: 12, block: 'Block D', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved', quad: [39.5, 50, -16, -3] },

  // BLOCK C-TOP (Plots 13 to 16)
  // Between Road V2 (X: 0) and Road V3 (X: 22). Center X: 11.
  // Z range: -42 to -3 (39m / 2 plots = 19.5m each)
  // West Row (facing Road V2): Plots 16, 14
  { plotNumber: 16, block: 'Block C', areaSqYds: 260, dimensions: "55'-1\" x 42'-6\"", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available', quad: [0, 11, -42, -22.5] },
  { plotNumber: 14, block: 'Block C', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, -22.5, -3] },
  // East Row (facing Road V3): Plots 15, 13
  { plotNumber: 15, block: 'Block C', areaSqYds: 252, dimensions: "55'-1\" x 41'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'reserved', quad: [11, 22, -42, -22.5] },
  { plotNumber: 13, block: 'Block C', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, -22.5, -3] },

  // BLOCK B-TOP (Plots 17 to 24)
  // Between Road V1 (X: -29) and Road V2 (X: -7). Center X: -18.
  // Z range: -42 to -3 (39m / 4 plots = 9.75m each)
  // West Row (facing Road V1): Plots 24, 22, 21, 20
  { plotNumber: 24, block: 'Block B', areaSqYds: 251, dimensions: "50'-1\" x 45'-3\"", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'sold', quad: [-29, -18, -42, -32.25] },
  { plotNumber: 22, block: 'Block B', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, -32.25, -22.5] },
  { plotNumber: 21, block: 'Block B', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, -22.5, -12.75] },
  { plotNumber: 20, block: 'Block B', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, -12.75, -3] },
  // East Row (facing Road V2): Plots 23, 19, 18, 17
  { plotNumber: 23, block: 'Block B', areaSqYds: 246, dimensions: "50'-1\" x 44'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'available', quad: [-18, -7, -42, -32.25] },
  { plotNumber: 19, block: 'Block B', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, -32.25, -22.5] },
  { plotNumber: 18, block: 'Block B', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, -22.5, -12.75] },
  { plotNumber: 17, block: 'Block B', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, -12.75, -3] },

  // BLOCK A-TOP (Plots 25 to 30)
  // Between Park (X: -58) and Road V1 (X: -36). Center X: -47.
  // Z range: -42 to -3 (39m / 3 plots = 13m each)
  // West Row (facing Park/West): Plots 29, 28, 27
  { plotNumber: 29, block: 'Block A', areaSqYds: 264, dimensions: "50'-1\" x 47'", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available', quad: [-58, -47, -42, -29] },
  { plotNumber: 28, block: 'Block A', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, -29, -16] },
  { plotNumber: 27, block: 'Block A', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, -16, -3] },
  // East Row (facing Road V1): Plots 30, 26, 25
  { plotNumber: 30, block: 'Block A', areaSqYds: 264, dimensions: "50'-1\" x 48'", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'reserved', quad: [-47, -36, -42, -29] },
  { plotNumber: 26, block: 'Block A', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, -29, -16] },
  { plotNumber: 25, block: 'Block A', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, -16, -3] },

  // ==========================================
  // BOTTOM SECTION: SOUTH BLOCKS (Z: 4 to 60)
  // ==========================================

  // BLOCK F-WEST (West Strip: Plots 31 to 36)
  // X: -78 to -65 (Width 13m). Z range: 4 to 60 (56m / 6 plots = 9.33m each)
  { plotNumber: 31, block: 'Block F', areaSqYds: 362, dimensions: "58'-9\" x 55'", facing: 'North-East', isCorner: true, roadWidth: '33ft', status: 'sold', quad: [-78, -65, 4, 13.3] },
  { plotNumber: 32, block: 'Block F', areaSqYds: 219, dimensions: "59'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-78, -65, 13.3, 22.6] },
  { plotNumber: 33, block: 'Block F', areaSqYds: 221, dimensions: "60'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-78, -65, 22.6, 32.0] },
  { plotNumber: 34, block: 'Block F', areaSqYds: 223, dimensions: "60'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-78, -65, 32.0, 41.3] },
  { plotNumber: 35, block: 'Block F', areaSqYds: 223, dimensions: "60'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-78, -65, 41.3, 50.6] },
  {
    plotNumber: 36,
    block: 'Block F',
    areaSqYds: 672,
    dimensions: "60'-9\" x 99'-6\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'blocked',
    quad: [-78, -65, 50.6, 60],
    polygon: [
      [-78, 50.6],
      [-65, 50.6],
      [-65, 60],
      [-78, 54]
    ]
  },

  // BLOCK G-MID (Plots 37 to 46)
  // Between Road V0 (X: -58) and Road V1 (X: -36). Center X: -47.
  // Z range: 4 to 60 (56m / 5 plots = 11.2m each)
  // West Row (facing Road V0): Plots 41, 40, 39, 38, 37
  { plotNumber: 41, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 4, 15.2] },
  { plotNumber: 40, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 15.2, 26.4] },
  { plotNumber: 39, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 26.4, 37.6] },
  { plotNumber: 38, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 37.6, 48.8] },
  { plotNumber: 37, block: 'Block G', areaSqYds: 261, dimensions: "55' x 42'-9\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-58, -47, 48.8, 60] },
  // East Row (facing Road V1): Plots 42, 43, 44, 45, 46
  { plotNumber: 42, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved', quad: [-47, -36, 4, 15.2] },
  { plotNumber: 43, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, 15.2, 26.4] },
  { plotNumber: 44, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, 26.4, 37.6] },
  { plotNumber: 45, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, 37.6, 48.8] },
  { plotNumber: 46, block: 'Block G', areaSqYds: 403, dimensions: "58'-3\" x 73'-9\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold', quad: [-47, -36, 48.8, 60] },

  // BLOCK H-MID (Plots 47 to 58)
  // Between Road V1 (X: -29) and Road V2 (X: -7). Center X: -18.
  // Z range: 4 to 60 (56m / 6 plots = 9.33m each)
  // West Row (facing Road V1): Plots 51, 50, 49, 48, 47, 56
  { plotNumber: 51, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 4, 13.33] },
  { plotNumber: 50, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 13.33, 22.66] },
  { plotNumber: 49, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 22.66, 32.0] },
  { plotNumber: 48, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 32.0, 41.33] },
  { plotNumber: 47, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 41.33, 50.66] },
  { plotNumber: 56, block: 'Block H', areaSqYds: 315, dimensions: "50' x 56'-9\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'sold', quad: [-29, -18, 50.66, 60] },
  // East Row (facing Road V2): Plots 52, 53, 54, 55, 58, 57
  { plotNumber: 52, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 4, 13.33] },
  { plotNumber: 53, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 13.33, 22.66] },
  { plotNumber: 54, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 22.66, 32.0] },
  { plotNumber: 55, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 32.0, 41.33] },
  { plotNumber: 58, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 41.33, 50.66] },
  { plotNumber: 57, block: 'Block H', areaSqYds: 315, dimensions: "50' x 56'-9\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-18, -7, 50.66, 60] },

  // BLOCK I-MID (Plots 59 to 70)
  // Between Road V2 (X: 0) and Road V3 (X: 22). Center X: 11.
  // Z range: 4 to 60 (56m / 6 plots = 9.33m each)
  // West Row (facing Road V2): Plots 64, 63, 62, 61, 60, 59
  { plotNumber: 64, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 4, 13.33] },
  { plotNumber: 63, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 13.33, 22.66] },
  { plotNumber: 62, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 22.66, 32.0] },
  { plotNumber: 61, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 32.0, 41.33] },
  { plotNumber: 60, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 41.33, 50.66] },
  { plotNumber: 59, block: 'Block I', areaSqYds: 313, dimensions: "50' x 56'-3\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [0, 11, 50.66, 60] },
  // East Row (facing Road V3): Plots 65, 66, 67, 68, 69, 70
  { plotNumber: 65, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved', quad: [11, 22, 4, 13.33] },
  { plotNumber: 66, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 13.33, 22.66] },
  { plotNumber: 67, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 22.66, 32.0] },
  { plotNumber: 68, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 32.0, 41.33] },
  { plotNumber: 69, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 41.33, 50.66] },
  { plotNumber: 70, block: 'Block I', areaSqYds: 314, dimensions: "50' x 56'-6\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold', quad: [11, 22, 50.66, 60] },

  // BLOCK J-MID (Plots 71 to 82)
  // Between Road V3 (X: 29) and Road V4 (X: 50). Center X: 39.5.
  // Z range: 4 to 60 (56m / 6 plots = 9.33m each)
  // West Row (facing Road V3): Plots 76, 75, 74, 73, 72, 71
  { plotNumber: 76, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 4, 13.33] },
  { plotNumber: 75, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 13.33, 22.66] },
  { plotNumber: 74, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 22.66, 32.0] },
  { plotNumber: 73, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 32.0, 41.33] },
  { plotNumber: 72, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 41.33, 50.66] },
  { plotNumber: 71, block: 'Block J', areaSqYds: 347, dimensions: "55' x 56'-9\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 50.66, 60] },
  // East Row (facing Road V4): Plots 77, 78, 79, 80, 81, 82
  { plotNumber: 77, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 4, 13.33] },
  { plotNumber: 78, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 13.33, 22.66] },
  { plotNumber: 79, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 22.66, 32.0] },
  { plotNumber: 80, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 32.0, 41.33] },
  { plotNumber: 81, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 41.33, 50.66] },
  { plotNumber: 82, block: 'Block J', areaSqYds: 347, dimensions: "55' x 56'-9\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 50.66, 60] },

  // BLOCK K-EAST (Plots 83 to 96)
  // Between Road V4 (X: 57) and Highway Service Road (X: 70). Center X: 63.5.
  // Z range: 4 to 60 (56m / 7 plots = 8.0m each)
  // West Row (facing Road V4): Plots 89, 88, 87, 86, 85, 84, 83
  { plotNumber: 89, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 4, 12] },
  { plotNumber: 88, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 12, 20] },
  { plotNumber: 87, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 20, 28] },
  { plotNumber: 86, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 28, 36] },
  { plotNumber: 85, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 36, 44] },
  { plotNumber: 84, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 44, 52] },
  { plotNumber: 83, block: 'Block K', areaSqYds: 293, dimensions: "55' x 48'", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 52, 60] },
  // East Row (facing Highway Service Road): Plots 90, 91, 92, 93, 94, 95, 96
  { plotNumber: 90, block: 'Block K', areaSqYds: 373, dimensions: "64' x 52'-6\"", facing: 'East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 4, 12] },
  { plotNumber: 91, block: 'Block K', areaSqYds: 194, dimensions: "53'-1\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 12, 20] },
  { plotNumber: 92, block: 'Block K', areaSqYds: 197, dimensions: "53'-10\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 20, 28] },
  { plotNumber: 93, block: 'Block K', areaSqYds: 200, dimensions: "54'-6\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 28, 36] },
  { plotNumber: 94, block: 'Block K', areaSqYds: 203, dimensions: "55'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 36, 44] },
  { plotNumber: 95, block: 'Block K', areaSqYds: 295, dimensions: "55'-10\" x 48'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 44, 52] },
  { plotNumber: 96, block: 'Block K', areaSqYds: 435, dimensions: "65'-3\" x 60'-6\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold', quad: [63.5, 70, 52, 60] }
];

// Enrich plots with polygon vertices, 3D bounds, and pricing
export function getEnrichedPlots(overridePlots = null) {
  const source = overridePlots || masterPlotsData;
  return masterPlotsData.map(def => {
    // If override from database exists, merge its dynamic status/price
    const live = overridePlots?.find(p => p.plotNumber === def.plotNumber);
    const [x0, x1, z0, z1] = def.quad;
    const width = Math.abs(x1 - x0);
    const depth = Math.abs(z1 - z0);
    const centerX = (x0 + x1) / 2;
    const centerZ = (z0 + z1) / 2;

    const baseStatus = live?.status || def.status;
    const price = live?.price !== undefined ? live.price : (def.price || 12500);

    return {
      ...def,
      ...live,
      status: baseStatus,
      price,
      areaSqFt: def.areaSqYds * 9,
      polygon: def.polygon || createQuad(x0, x1, z0, z1),
      bounds: {
        x: x0,
        z: z0,
        width,
        depth
      },
      center: [centerX, centerZ],
      // Geographic Coordinates [latitude, longitude] at Kadthal, Srisailam Highway
      geoCenter: localToLatLng(centerX, centerZ),
      geoPolygon: def.polygon
        ? def.polygon.map(([px, pz]) => localToLatLng(px, pz))
        : [
            localToLatLng(x0, z0),
            localToLatLng(x1, z0),
            localToLatLng(x1, z1),
            localToLatLng(x0, z1)
          ],
      // 2D SVG canvas normalized coordinates (scaled to standard 1200x800 viewBox)
      // Map X: [-90, +90] -> SVG [60, 1140] (factor: 6.0)
      // Map Z: [-55, +65] -> SVG [60, 740] (factor: 5.66)
      svgPolygon: def.polygon
        ? def.polygon.map(([px, pz]) => [(px + 95) * 6.0, (pz + 58) * 5.6])
        : [
            [(x0 + 95) * 6.0, (z0 + 58) * 5.6],
            [(x1 + 95) * 6.0, (z0 + 58) * 5.6],
            [(x1 + 95) * 6.0, (z1 + 58) * 5.6],
            [(x0 + 95) * 6.0, (z1 + 58) * 5.6]
          ]
    };
  });
}

// Site boundary in geographic coordinates [lat, lng] tracing exact brochure cuts
export const SITE_BOUNDARY_GEO = SITE_BOUNDARY_LOCAL.map(([x, z]) => localToLatLng(x, z));
