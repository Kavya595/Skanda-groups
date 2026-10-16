/**
 * Master Plan Digitized GIS Dataset — Skandha Group, Kadthal
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
  // 3. East: Along East 33' road to Southeast corner of layout
  [70, 67.5],
  // 4. Block K bottom: Slanted cut under Plot 96 and Plot 83
  [63.5, 65.5],
  [57, 63.5],
  // 5-6. Road V4 opening to 4th Phase
  [57, 67.5],
  [50, 67.5],
  // 7-8. Block J bottom: Slanted cut under Plot 82 and Plot 71
  [50, 65.7],
  [39.5, 63.7],
  [29, 61.8],
  // 9-10. Road V3 opening to 4th Phase
  [29, 64],
  [22, 64],
  // 11-12. Block I bottom: Flat cut under Plot 70 and Plot 59
  [22, 61.9],
  [0, 61.8],
  // 13-14. Road V2 opening to 4th Phase
  [0, 64],
  [-7, 64],
  // 15-16. Block H bottom: Flat cut under Plot 58 and chamfer cut under Plot 47
  [-7, 61.9],
  [-18, 62],
  [-25, 62],
  [-29, 60],
  // 17-18. Road V1 opening to 4th Phase
  [-29, 64],
  [-36, 64],
  // 19-20. Block G bottom: Slanted cut under Plot 46 and Plot 37
  [-36, 61.5],
  [-47, 55.5],
  [-58, 50],
  // 21-22. Road V0 opening to 4th Phase
  [-58, 52],
  [-65, 52],
  // 23-24. Block F bottom: Slanted taper cut under Plot 36 (42'-9" east to 19'-9" west)
  [-65, 50],
  [-78, 43],
  // 25. West edge of Block F (along Plots 36, 35, 34, 33)
  [-78, 4],
  // 26. Jog West along 33' Road to Southwest corner of Park
  [-88, 4],
  // 27. Up West boundary of Park (Ac. 0.758 cents, 209'-9" length)
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
      [70, 67.5],
      [63, 67.5]
    ],
    center: [66.5, 7.75],
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
      [-58, 52],
      [-65, 52]
    ],
    center: [-61.5, 28],
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
      [57, 67.5],
      [50, 67.5]
    ],
    center: [53.5, 12.75],
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

  // BLOCK A-TOP (Plots 25 to 32)
  // Between Park (X: -58) and Road V1 (X: -36). Center X: -47.
  // Z range: -42 to -3 (39m total: 4 plots per row)
  // West Row (facing Park): Plots 29, 30, 31, 32
  { plotNumber: 29, block: 'Block A', areaSqYds: 264, dimensions: "50'-1\" x 47'", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available', quad: [-58, -47, -42, -32.5] },
  { plotNumber: 30, block: 'Block A', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'reserved', quad: [-58, -47, -32.5, -23.0] },
  { plotNumber: 31, block: 'Block A', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'sold', quad: [-58, -47, -23.0, -13.5] },
  { plotNumber: 32, block: 'Block A', areaSqYds: 306, dimensions: "50' x 55'", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-58, -47, -13.5, -3] },
  // East Row (facing Road V1): Plots 25, 26, 27, 28
  { plotNumber: 25, block: 'Block A', areaSqYds: 259, dimensions: "50'-1\" x 46'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'available', quad: [-47, -36, -42, -32.5] },
  { plotNumber: 26, block: 'Block A', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, -32.5, -23.0] },
  { plotNumber: 27, block: 'Block A', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, -23.0, -13.5] },
  { plotNumber: 28, block: 'Block A', areaSqYds: 306, dimensions: "50' x 55'", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-47, -36, -13.5, -3] },

  // ==========================================
  // BOTTOM SECTION: SOUTH BLOCKS (Z: 4 to bottom cuts)
  // ==========================================

  // BLOCK F-WEST (West Strip: Plots 33 to 36)
  // X: -78 to -65 (Width 13m). Single column facing Road V0.
  { plotNumber: 33, block: 'Block F', areaSqYds: 362, dimensions: "58'-9\" x 55'", facing: 'North-East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-78, -65, 4, 14.5] },
  { plotNumber: 34, block: 'Block F', areaSqYds: 220, dimensions: "59'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-78, -65, 14.5, 25.0] },
  { plotNumber: 35, block: 'Block F', areaSqYds: 222, dimensions: "60'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-78, -65, 25.0, 35.5] },
  {
    plotNumber: 36,
    block: 'Block F',
    areaSqYds: 393,
    dimensions: "60'-9\" x 99'-6\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'blocked',
    quad: [-78, -65, 35.5, 50.0],
    polygon: [
      [-78, 35.5],
      [-65, 35.5],
      [-65, 50.0],
      [-78, 43.0]
    ]
  },

  // BLOCK G-MID (Plots 37 to 46)
  // Between Road V0 (X: -58) and Road V1 (X: -36). Center X: -47.
  // Z range: 4 to 61.5
  // West Row (facing Road V0): Plots 41, 40, 39, 38, 37
  { plotNumber: 41, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 4, 14] },
  { plotNumber: 40, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 14, 24] },
  { plotNumber: 39, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 24, 34] },
  { plotNumber: 38, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-58, -47, 34, 44] },
  {
    plotNumber: 37,
    block: 'Block G',
    areaSqYds: 309,
    dimensions: "42'-9\" x 58'-3\"",
    facing: 'South-West',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [-58, -47, 44, 55.5],
    polygon: [
      [-58, 44],
      [-47, 44],
      [-47, 55.5],
      [-58, 50]
    ]
  },
  // East Row (facing Road V1): Plots 42, 43, 44, 45, 46
  { plotNumber: 42, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved', quad: [-47, -36, 4, 14] },
  { plotNumber: 43, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, 14, 24] },
  { plotNumber: 44, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, 24, 34] },
  { plotNumber: 45, block: 'Block G', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-47, -36, 34, 44] },
  {
    plotNumber: 46,
    block: 'Block G',
    areaSqYds: 403,
    dimensions: "58'-3\" x 73'-9\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'sold',
    quad: [-47, -36, 44, 61.5],
    polygon: [
      [-47, 44],
      [-36, 44],
      [-36, 61.5],
      [-47, 55.5]
    ]
  },

  // BLOCK H-MID (Plots 47 to 58)
  // Between Road V1 (X: -29) and Road V2 (X: -7). Center X: -18.
  // Z range: 4 to 62
  // West Row (facing Road V1): Plots 52, 51, 50, 49, 48, 47
  { plotNumber: 52, block: 'Block H', areaSqYds: 306, dimensions: "50' x 55'", facing: 'West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-29, -18, 4, 13.6] },
  { plotNumber: 51, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 13.6, 23.2] },
  { plotNumber: 50, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 23.2, 32.8] },
  { plotNumber: 49, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 32.8, 42.4] },
  { plotNumber: 48, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-29, -18, 42.4, 52.0] },
  {
    plotNumber: 47,
    block: 'Block H',
    areaSqYds: 306,
    dimensions: "50' x 56'-9\"",
    facing: 'South-West',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [-29, -18, 52, 62],
    polygon: [
      [-29, 52],
      [-18, 52],
      [-18, 62],
      [-25, 62],
      [-29, 60]
    ]
  },
  // East Row (facing Road V2): Plots 53, 54, 55, 56, 57, 58
  { plotNumber: 53, block: 'Block H', areaSqYds: 306, dimensions: "50' x 55'", facing: 'East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [-18, -7, 4, 13.6] },
  { plotNumber: 54, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 13.6, 23.2] },
  { plotNumber: 55, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 23.2, 32.8] },
  { plotNumber: 56, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 32.8, 42.4] },
  { plotNumber: 57, block: 'Block H', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [-18, -7, 42.4, 52.0] },
  {
    plotNumber: 58,
    block: 'Block H',
    areaSqYds: 314,
    dimensions: "56'-9\" x 56'-6\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [-18, -7, 52, 62],
    polygon: [
      [-18, 52],
      [-7, 52],
      [-7, 61.9],
      [-18, 62]
    ]
  },

  // BLOCK I-MID (Plots 59 to 70)
  // Between Road V2 (X: 0) and Road V3 (X: 22). Center X: 11.
  // Z range: 4 to 61.9
  // West Row (facing Road V2): Plots 64, 63, 62, 61, 60, 59
  { plotNumber: 64, block: 'Block I', areaSqYds: 306, dimensions: "50' x 55'", facing: 'West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [0, 11, 4, 13.6] },
  { plotNumber: 63, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 13.6, 23.2] },
  { plotNumber: 62, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 23.2, 32.8] },
  { plotNumber: 61, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 32.8, 42.4] },
  { plotNumber: 60, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [0, 11, 42.4, 52.0] },
  {
    plotNumber: 59,
    block: 'Block I',
    areaSqYds: 313,
    dimensions: "50' x 56'-3\"",
    facing: 'South-West',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [0, 11, 52, 61.8],
    polygon: [
      [0, 52],
      [11, 52],
      [11, 61.8],
      [0, 61.8]
    ]
  },
  // East Row (facing Road V3): Plots 65, 66, 67, 68, 69, 70
  { plotNumber: 65, block: 'Block I', areaSqYds: 306, dimensions: "50' x 55'", facing: 'East', isCorner: true, roadWidth: '33ft', status: 'reserved', quad: [11, 22, 4, 13.6] },
  { plotNumber: 66, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 13.6, 23.2] },
  { plotNumber: 67, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 23.2, 32.8] },
  { plotNumber: 68, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 32.8, 42.4] },
  { plotNumber: 69, block: 'Block I', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [11, 22, 42.4, 52.0] },
  {
    plotNumber: 70,
    block: 'Block I',
    areaSqYds: 314,
    dimensions: "50' x 56'-6\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'sold',
    quad: [11, 22, 52, 61.9],
    polygon: [
      [11, 52],
      [22, 52],
      [22, 61.9],
      [11, 61.8]
    ]
  },

  // BLOCK J-MID (Plots 71 to 82)
  // Between Road V3 (X: 29) and Road V4 (X: 50). Center X: 39.5.
  // Z range: 4 to 65.7
  // West Row (facing Road V3): Plots 76, 75, 74, 73, 72, 71
  { plotNumber: 76, block: 'Block J', areaSqYds: 336, dimensions: "55' x 55'", facing: 'West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 4, 13.6] },
  { plotNumber: 75, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 13.6, 23.2] },
  { plotNumber: 74, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 23.2, 32.8] },
  { plotNumber: 73, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 32.8, 42.4] },
  { plotNumber: 72, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [29, 39.5, 42.4, 52.0] },
  {
    plotNumber: 71,
    block: 'Block J',
    areaSqYds: 364,
    dimensions: "55' x 56'-9\"",
    facing: 'South-West',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [29, 39.5, 52, 63.7],
    polygon: [
      [29, 52],
      [39.5, 52],
      [39.5, 63.7],
      [29, 61.8]
    ]
  },
  // East Row (facing Road V4): Plots 77, 78, 79, 80, 81, 82
  { plotNumber: 77, block: 'Block J', areaSqYds: 336, dimensions: "55' x 55'", facing: 'East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 4, 13.6] },
  { plotNumber: 78, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 13.6, 23.2] },
  { plotNumber: 79, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 23.2, 32.8] },
  { plotNumber: 80, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 32.8, 42.4] },
  { plotNumber: 81, block: 'Block J', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [39.5, 50, 42.4, 52.0] },
  {
    plotNumber: 82,
    block: 'Block J',
    areaSqYds: 405,
    dimensions: "55' x 69'-6\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [39.5, 50, 52, 65.7],
    polygon: [
      [39.5, 52],
      [50, 52],
      [50, 65.7],
      [39.5, 63.7]
    ]
  },

  // BLOCK K-EAST (Plots 83 to 96)
  // Between Road V4 (X: 57) and Highway Service Road (X: 70). Center X: 63.5.
  // Z range: 4 to 67.5
  // West Row (facing Road V4): Plots 89, 88, 87, 86, 85, 84, 83
  { plotNumber: 89, block: 'Block K', areaSqYds: 336, dimensions: "55' x 55'", facing: 'West', isCorner: true, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 4, 12.5] },
  { plotNumber: 88, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 12.5, 21.0] },
  { plotNumber: 87, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 21.0, 29.5] },
  { plotNumber: 86, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 29.5, 38.0] },
  { plotNumber: 85, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 38.0, 46.5] },
  { plotNumber: 84, block: 'Block K', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available', quad: [57, 63.5, 46.5, 55.0] },
  {
    plotNumber: 83,
    block: 'Block K',
    areaSqYds: 295,
    dimensions: "40'-6\" x 60'-6\"",
    facing: 'South-West',
    isCorner: true,
    roadWidth: '33ft',
    status: 'available',
    quad: [57, 63.5, 55.0, 65.5],
    polygon: [
      [57, 55],
      [63.5, 55],
      [63.5, 65.5],
      [57, 63.5]
    ]
  },
  // East Row (facing Highway Service Road): Plots 90, 91, 92, 93, 94, 95, 96
  { plotNumber: 90, block: 'Block K', areaSqYds: 395, dimensions: "64' x 55'", facing: 'East', isCorner: true, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 4, 12.5] },
  { plotNumber: 91, block: 'Block K', areaSqYds: 241, dimensions: "53'-1\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 12.5, 21.0] },
  { plotNumber: 92, block: 'Block K', areaSqYds: 245, dimensions: "53'-10\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 21.0, 29.5] },
  { plotNumber: 93, block: 'Block K', areaSqYds: 248, dimensions: "54'-6\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 29.5, 38.0] },
  { plotNumber: 94, block: 'Block K', areaSqYds: 251, dimensions: "55'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 38.0, 46.5] },
  { plotNumber: 95, block: 'Block K', areaSqYds: 254, dimensions: "55'-10\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available', quad: [63.5, 70, 46.5, 55.0] },
  {
    plotNumber: 96,
    block: 'Block K',
    areaSqYds: 372,
    dimensions: "51'-9\" x 65'-3\"",
    facing: 'South-East',
    isCorner: true,
    roadWidth: '33ft',
    status: 'sold',
    quad: [63.5, 70, 55.0, 67.5],
    polygon: [
      [63.5, 55],
      [70, 55],
      [70, 67.5],
      [63.5, 65.5]
    ]
  }
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
    let centerX = (x0 + x1) / 2;
    let centerZ = (z0 + z1) / 2;
    if (def.polygon && def.polygon.length > 0) {
      centerX = def.polygon.reduce((sum, p) => sum + p[0], 0) / def.polygon.length;
      centerZ = def.polygon.reduce((sum, p) => sum + p[1], 0) / def.polygon.length;
    }

    const baseStatus = live?.status || def.status;
    const price = live?.price !== undefined ? live.price : (def.price || 12500);

    return {
      ...def,
      ...live,
      status: baseStatus,
      price,
      hasCustomPolygon: !!def.polygon,
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

/**
 * Authoritative Curated Regional Landmarks & Connectivity around Kadthal
 * Srisailam National Highway (NH-765) Corridor
 */
export const REGIONAL_LANDMARKS = [
  {
    id: 'LM-SITE',
    name: "Skandha Venture (Layout Site)",
    shortName: "Skandha Venture",
    category: 'SITE',
    categoryLabel: 'Project Site',
    distance: '0 km',
    time: '0 min',
    direction: 'At Site (Kadthal)',
    coordinates: [16.9555, 78.5125],
    threePos: [0, 0, 0],
    icon: '🏡',
    color: '#16A34A',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: "DTCP & TS RERA Sanctioned Gated Layout (96 Plots, Ac. 0.758 Park, Srisailam Highway).",
    mapsUrl: 'https://www.google.com/maps?q=16.9555,78.5125'
  },
  {
    id: 'LM-MAISIGANDI',
    name: 'Sri Maisigandi Maha Maisamma Temple',
    shortName: 'Maisigandi Temple',
    category: 'SPIRITUAL',
    categoryLabel: 'Spiritual Landmark',
    distance: '0.8 km',
    time: '1 min',
    direction: 'West (via 60ft Road)',
    coordinates: [16.9602, 78.5085],
    threePos: [-120, 0, -45],
    icon: '🛕',
    color: '#F59E0B',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Famous revered temple directly adjoining the proposed 60-ft layout approach road.',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=16.9602,78.5085'
  },
  {
    id: 'LM-KADTHAL',
    name: 'Kadthal Town Center & RTC Bus Station',
    shortName: 'Kadthal Town Center',
    category: 'TOWN',
    categoryLabel: 'Township & Transit',
    distance: '1.8 km',
    time: '3 mins',
    direction: 'North (via NH-765)',
    coordinates: [16.9715, 78.5135],
    threePos: [-5, 0, -110],
    icon: '🏪',
    color: '#3B82F6',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    desc: 'Bustling commercial hub with markets, banking, clinics, schools, and frequent TSRTC bus connectivity.',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=16.9715,78.5135'
  },
  {
    id: 'LM-PYRAMID',
    name: 'Maheshwara Maha Pyramid (Kadthal)',
    shortName: 'Maha Pyramid',
    category: 'SPIRITUAL',
    categoryLabel: 'Spiritual Wonder',
    distance: '3.5 km',
    time: '5 mins',
    direction: 'North-West',
    coordinates: [16.9750, 78.4950],
    threePos: [-95, 0, -125],
    icon: '🧘',
    color: '#8B5CF6',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    desc: "World's largest meditational pyramid attracting thousands of visitors and tourists globally.",
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=16.9750,78.4950'
  },
  {
    id: 'LM-RRR',
    name: 'Regional Ring Road (RRR) Kadthal Junction',
    shortName: 'Regional Ring Road (RRR)',
    category: 'HIGHWAY',
    categoryLabel: 'Mega Expressway',
    distance: '4.5 km',
    time: '6 mins',
    direction: 'North (NH-765 Interchange)',
    coordinates: [16.9950, 78.5140],
    threePos: [0, 0, -170],
    icon: '🌐',
    color: '#10B981',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'Transformative 330km mega expressway project encircling Hyderabad, boosting capital value exponentially.',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=16.9950,78.5140'
  },
  {
    id: 'LM-PHARMACITY',
    name: 'Mucherla Hyderabad Pharma City & Future City',
    shortName: 'Pharma City & Future City',
    category: 'ECONOMIC',
    categoryLabel: 'Economic & AI Hub',
    distance: '14.2 km',
    time: '14 mins',
    direction: 'North-East',
    coordinates: [17.0650, 78.5600],
    threePos: [110, 0, -210],
    icon: '🏭',
    color: '#EC4899',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    desc: 'Government flagship 19,000-acre industrial and AI megaproject generating lakhs of high-value employment.',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=17.0650,78.5600'
  },
  {
    id: 'LM-WONDERLA',
    name: 'Wonderla Amusement Park (Raviryala)',
    shortName: 'Wonderla Amusement Park',
    category: 'AMUSEMENT',
    categoryLabel: 'Entertainment',
    distance: '22 km',
    time: '20 mins',
    direction: 'North along Srisailam Hwy',
    coordinates: [17.1890, 78.6010],
    threePos: [140, 0, -260],
    icon: '🎢',
    color: '#EAB308',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    desc: "Hyderabad's premier world-class theme and water amusement park destination.",
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=17.1890,78.6010'
  },
  {
    id: 'LM-ORR',
    name: 'Outer Ring Road (ORR) Exit 14 Tukkuguda',
    shortName: 'ORR Exit 14 (Tukkuguda)',
    category: 'HIGHWAY',
    categoryLabel: 'City Expressway Junction',
    distance: '24.5 km',
    time: '22 mins',
    direction: 'North direct via NH-765',
    coordinates: [17.1850, 78.5200],
    threePos: [20, 0, -280],
    icon: '🛣️',
    color: '#06B6D4',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    desc: 'High-speed signal-free interchange linking Srisailam Highway directly to Gachibowli, Financial District, and Hitec City.',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=17.1850,78.5200'
  },
  {
    id: 'LM-RGIA',
    name: 'Rajiv Gandhi International Airport (RGIA)',
    shortName: 'Hyderabad Airport (RGIA)',
    category: 'TRANSIT',
    categoryLabel: 'International Airport',
    distance: '28.5 km',
    time: '26 mins',
    direction: 'North-West (Shamshabad)',
    coordinates: [17.2403, 78.4294],
    threePos: [-110, 0, -310],
    icon: '✈️',
    color: '#0EA5E9',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    desc: 'Rapid seamless commute to Shamshabad International Airport via ORR & 4-lane Highway.',
    mapsUrl: 'https://www.google.com/maps/dir/?api=1&origin=16.9555,78.5125&destination=17.2403,78.4294'
  }
];

