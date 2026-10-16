/**
 * Skandha Group - Layout Plot Dataset
 * Digitized directly from Brochure Page 2:
 * DTCP Approved Layout TLP NO. 87/2024/H | TS RERA: P02400009081 @ Kadthal
 * Total 96 Plots + Open Space Park (Ac. 0.758 cents)
 */

export const parkData = {
  id: 'PARK-01',
  name: 'Site Reserved for Open Space (Park)',
  areaCents: 'Ac. 0.758 cents',
  dimensions: "209'-9\" x 169'-3\" x 201'-6\"",
  bounds: { x: 40, y: 80, width: 220, height: 180 },
  polygon: [[40, 80], [260, 80], [260, 260], [40, 260]],
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

export const initialPlots = [
  // Top Strip along Highway (Block E - Plots 1 to 6)
  { plotNumber: 1, block: 'E-Top', areaSqYds: 241, dimensions: "58'-3\" x 37'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'reserved' },
  { plotNumber: 2, block: 'E-Top', areaSqYds: 247, dimensions: "58'-3\" x 38'-3\"", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 3, block: 'E-Top', areaSqYds: 217, dimensions: "59'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 4, block: 'E-Top', areaSqYds: 221, dimensions: "60'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 5, block: 'E-Top', areaSqYds: 225, dimensions: "61'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 6, block: 'E-Top', areaSqYds: 385, dimensions: "63' x 55'", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold' },

  // Top Column 4 (Block D - Plots 7 to 12)
  { plotNumber: 7, block: 'D-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 8, block: 'D-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 10, block: 'D-Top', areaSqYds: 243, dimensions: "55'-1\" x 39'-9\"", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available' },
  { plotNumber: 9, block: 'D-Top', areaSqYds: 240, dimensions: "55'-1\" x 39'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'available' },
  { plotNumber: 11, block: 'D-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 12, block: 'D-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved' },

  // Top Column 3 (Block C - Plots 13 to 16)
  { plotNumber: 14, block: 'C-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 16, block: 'C-Top', areaSqYds: 260, dimensions: "55'-1\" x 42'-6\"", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available' },
  { plotNumber: 15, block: 'C-Top', areaSqYds: 252, dimensions: "55'-1\" x 41'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'reserved' },
  { plotNumber: 13, block: 'C-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },

  // Top Column 2 (Block B - Plots 17 to 24)
  { plotNumber: 20, block: 'B-Top', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 21, block: 'B-Top', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 22, block: 'B-Top', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 24, block: 'B-Top', areaSqYds: 251, dimensions: "50'-1\" x 45'-3\"", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'sold' },
  { plotNumber: 23, block: 'B-Top', areaSqYds: 246, dimensions: "50'-1\" x 44'-3\"", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'available' },
  { plotNumber: 19, block: 'B-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 18, block: 'B-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 17, block: 'B-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },

  // Top Column 1 (Block A - Plots 25 to 30)
  { plotNumber: 27, block: 'A-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 28, block: 'A-Top', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 25, block: 'A-Top', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 26, block: 'A-Top', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 29, block: 'A-Top', areaSqYds: 264, dimensions: "50'-1\" x 47'", facing: 'North-West', isCorner: true, roadWidth: '60ft', status: 'available' },
  { plotNumber: 30, block: 'A-Top', areaSqYds: 264, dimensions: "50'-1\" x 48'", facing: 'North-East', isCorner: true, roadWidth: '60ft', status: 'reserved' },

  // Bottom West Strip (Block F - Plots 31 to 36)
  { plotNumber: 31, block: 'F-West', areaSqYds: 362, dimensions: "58'-9\" x 55'", facing: 'North-East', isCorner: true, roadWidth: '33ft', status: 'sold' },
  { plotNumber: 32, block: 'F-West', areaSqYds: 219, dimensions: "59'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 33, block: 'F-West', areaSqYds: 221, dimensions: "60'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 34, block: 'F-West', areaSqYds: 223, dimensions: "60'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 35, block: 'F-West', areaSqYds: 223, dimensions: "60'-9\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 36, block: 'F-West', areaSqYds: 672, dimensions: "60'-9\" x 99'-6\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'blocked' },

  // Bottom Column 1 (Block G - Plots 37 to 46)
  { plotNumber: 41, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 40, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 39, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 38, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 37, block: 'G-Mid', areaSqYds: 261, dimensions: "55' x 42'-9\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available' },
  { plotNumber: 42, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved' },
  { plotNumber: 43, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 44, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 45, block: 'G-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 46, block: 'G-Mid', areaSqYds: 403, dimensions: "58'-3\" x 73'-9\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold' },

  // Bottom Column 2 (Block H - Plots 47 to 58)
  { plotNumber: 51, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 50, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 49, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 48, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 47, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 56, block: 'H-Mid', areaSqYds: 315, dimensions: "50' x 56'-9\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'sold' },
  { plotNumber: 52, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 53, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 54, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 55, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 58, block: 'H-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 57, block: 'H-Mid', areaSqYds: 315, dimensions: "50' x 56'-9\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'available' },

  // Bottom Column 3 (Block I - Plots 59 to 70)
  { plotNumber: 64, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 63, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 62, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 61, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 60, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 59, block: 'I-Mid', areaSqYds: 313, dimensions: "50' x 56'-3\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available' },
  { plotNumber: 65, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'reserved' },
  { plotNumber: 66, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 67, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 68, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 69, block: 'I-Mid', areaSqYds: 183, dimensions: "50' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 70, block: 'I-Mid', areaSqYds: 314, dimensions: "50' x 56'-6\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold' },

  // Bottom Column 4 (Block J - Plots 71 to 82)
  { plotNumber: 76, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 75, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 74, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 73, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 72, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 71, block: 'J-Mid', areaSqYds: 347, dimensions: "55' x 56'-9\"", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available' },
  { plotNumber: 77, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 78, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 79, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 80, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 81, block: 'J-Mid', areaSqYds: 202, dimensions: "55' x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 82, block: 'J-Mid', areaSqYds: 347, dimensions: "55' x 56'-9\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'available' },

  // Bottom Column 5 (Block K - Plots 83 to 96)
  { plotNumber: 89, block: 'K-East', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 88, block: 'K-East', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 87, block: 'K-East', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 86, block: 'K-East', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 85, block: 'K-East', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 84, block: 'K-East', areaSqYds: 202, dimensions: "55' x 33'", facing: 'West', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 83, block: 'K-East', areaSqYds: 293, dimensions: "55' x 48'", facing: 'South-West', isCorner: true, roadWidth: '33ft', status: 'available' },
  { plotNumber: 90, block: 'K-East', areaSqYds: 373, dimensions: "64' x 52'-6\"", facing: 'East', isCorner: true, roadWidth: '33ft', status: 'available' },
  { plotNumber: 91, block: 'K-East', areaSqYds: 194, dimensions: "53'-1\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 92, block: 'K-East', areaSqYds: 197, dimensions: "53'-10\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 93, block: 'K-East', areaSqYds: 200, dimensions: "54'-6\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 94, block: 'K-East', areaSqYds: 203, dimensions: "55'-3\" x 33'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 95, block: 'K-East', areaSqYds: 295, dimensions: "55'-10\" x 48'", facing: 'East', isCorner: false, roadWidth: '33ft', status: 'available' },
  { plotNumber: 96, block: 'K-East', areaSqYds: 435, dimensions: "65'-3\" x 60'-6\"", facing: 'South-East', isCorner: true, roadWidth: '33ft', status: 'sold' }
];

/**
 * Calculates extra charges per sq yd according to brochure table:
 * N/E & N/W Corner: Rs. 800/-
 * S/E & S/W Corner: Rs. 600/-
 * East Face: Rs. 500/-
 * North Face: Rs. 500/-
 * 40 feet road: Rs. 500/-
 */
export function calculateExtraCharges(facing, isCorner, roadWidth) {
  let charges = 0;
  const breakdown = [];
  if (isCorner) {
    if (facing.includes('North-East') || facing.includes('North-West')) {
      charges += 800;
      breakdown.push({ label: 'N/E or N/W Corner', rate: 800 });
    } else if (facing.includes('South-East') || facing.includes('South-West')) {
      charges += 600;
      breakdown.push({ label: 'S/E or S/W Corner', rate: 600 });
    }
  } else {
    if (facing === 'East') {
      charges += 500;
      breakdown.push({ label: 'East Facing', rate: 500 });
    } else if (facing === 'North') {
      charges += 500;
      breakdown.push({ label: 'North Facing', rate: 500 });
    }
  }
  if (roadWidth === '40ft' || roadWidth === '60ft') {
    charges += 500;
    breakdown.push({ label: `${roadWidth} Wide Road`, rate: 500 });
  }
  return { totalPerSqYd: charges, breakdown };
}
