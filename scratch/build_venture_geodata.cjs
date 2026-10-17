const fs = require('fs');
const path = require('path');

const ORIGIN_LAT = 16.975650;
const ORIGIN_LNG = 78.510750;
const LAT_PER_FOOT = 0.000002743;
const LNG_PER_FOOT = 0.000002871;

function toGeo(xFeet, yFeet) {
  return {
    lat: Number((ORIGIN_LAT - yFeet * LAT_PER_FOOT).toFixed(7)),
    lng: Number((ORIGIN_LNG + xFeet * LNG_PER_FOOT).toFixed(7))
  };
}

function makeBox(x, y, w, h) {
  return [
    toGeo(x, y),
    toGeo(x + w, y),
    toGeo(x + w, y + h),
    toGeo(x, y + h)
  ];
}

function getCenter(polygon) {
  let sumLat = 0, sumLng = 0;
  polygon.forEach(pt => {
    sumLat += pt.lat;
    sumLng += pt.lng;
  });
  return {
    lat: Number((sumLat / polygon.length).toFixed(7)),
    lng: Number((sumLng / polygon.length).toFixed(7))
  };
}

const plotPolygons = {};

// --- NORTH TIER (Y = 0 to 174 ft) ---
// Park: X = 0 to 250, Y = 0 to 174
const parkPolygon = makeBox(0, 0, 250, 174);

// Road 1: X = 250 to 283 (33 ft)

// Block 1 (X = 283 to 383, 100 ft)
// West Col (50 ft wide): Plots 29, 30, 31, 32
plotPolygons[29] = makeBox(283, 0, 50, 48);
plotPolygons[30] = makeBox(283, 48, 50, 33);
plotPolygons[31] = makeBox(283, 81, 50, 33);
plotPolygons[32] = makeBox(283, 114, 50, 55);
// East Col (50 ft wide): Plots 25, 26, 27, 28
plotPolygons[25] = makeBox(333, 0, 50, 48);
plotPolygons[26] = makeBox(333, 48, 50, 33);
plotPolygons[27] = makeBox(333, 81, 50, 33);
plotPolygons[28] = makeBox(333, 114, 50, 55);

// Road 2: X = 383 to 416 (33 ft)

// Block 2 (X = 416 to 516, 100 ft)
// West Col: Plots 24, 23, 22, 21
plotPolygons[24] = makeBox(416, 0, 50, 48);
plotPolygons[23] = makeBox(416, 48, 50, 33);
plotPolygons[22] = makeBox(416, 81, 50, 33);
plotPolygons[21] = makeBox(416, 114, 50, 55);
// East Col: Plots 17, 18, 19, 20
plotPolygons[17] = makeBox(466, 0, 50, 48);
plotPolygons[18] = makeBox(466, 48, 50, 33);
plotPolygons[19] = makeBox(466, 81, 50, 33);
plotPolygons[20] = makeBox(466, 114, 50, 55);

// Road 3: X = 516 to 549 (33 ft)

// Block 3 (X = 549 to 659, 110 ft)
// West Col (55 ft wide): Plots 16, 15, 14, 13
plotPolygons[16] = makeBox(549, 0, 55, 48);
plotPolygons[15] = makeBox(549, 48, 55, 33);
plotPolygons[14] = makeBox(549, 81, 55, 33);
plotPolygons[13] = makeBox(549, 114, 55, 55);
// East Col (55 ft wide): Plots 9, 10, 11, 12
plotPolygons[9] = makeBox(604, 0, 55, 48);
plotPolygons[10] = makeBox(604, 48, 55, 33);
plotPolygons[11] = makeBox(604, 81, 55, 33);
plotPolygons[12] = makeBox(604, 114, 55, 55);

// Road 4: X = 659 to 692 (33 ft)

// Block 4 (X = 692 to 802, 110 ft)
// West Col (55 ft wide): Plots 8, 7, 6, 5
plotPolygons[8] = makeBox(692, 0, 55, 48);
plotPolygons[7] = makeBox(692, 48, 55, 33);
plotPolygons[6] = makeBox(692, 81, 55, 33);
plotPolygons[5] = makeBox(692, 114, 55, 55);
// East Col (55 ft wide): Plots 1, 2, 3, 4
plotPolygons[1] = makeBox(747, 0, 55, 48);
plotPolygons[2] = makeBox(747, 48, 55, 33);
plotPolygons[3] = makeBox(747, 81, 55, 33);
plotPolygons[4] = makeBox(747, 114, 55, 55);

// --- CENTRAL EAST-WEST ROAD (33 FT WIDE, Y = 174 to 207) ---
const centralRoadPolygon = makeBox(0, 174, 835, 33);

// --- SOUTH TIER (Y = 207 to 420 ft) ---
// Road Frontage Strip (West Highway Avenue): X = 0 to 60 ft
plotPolygons[33] = makeBox(0, 207, 60, 55);
plotPolygons[34] = makeBox(0, 262, 60, 33);
plotPolygons[35] = makeBox(0, 295, 60, 33);
plotPolygons[36] = makeBox(0, 328, 60, 60);

// Road 6: X = 60 to 93 (33 ft)

// Block 5 (X = 93 to 203, 110 ft)
// West Col (55 ft wide): Plots 41, 40, 39, 38, 37
plotPolygons[41] = makeBox(93, 207, 55, 45);
plotPolygons[40] = makeBox(93, 252, 55, 33);
plotPolygons[39] = makeBox(93, 285, 55, 33);
plotPolygons[38] = makeBox(93, 318, 55, 33);
plotPolygons[37] = makeBox(93, 351, 55, 50);
// East Col (55 ft wide): Plots 42, 43, 44, 45, 46
plotPolygons[42] = makeBox(148, 207, 55, 45);
plotPolygons[43] = makeBox(148, 252, 55, 33);
plotPolygons[44] = makeBox(148, 285, 55, 33);
plotPolygons[45] = makeBox(148, 318, 55, 33);
plotPolygons[46] = makeBox(148, 351, 55, 50);

// Road 7: X = 203 to 236 (33 ft)

// Block 6 (X = 236 to 336, 100 ft)
// West Col (50 ft wide): Plots 52, 51, 50, 49, 48, 47
plotPolygons[52] = makeBox(236, 207, 50, 42);
plotPolygons[51] = makeBox(236, 249, 50, 30);
plotPolygons[50] = makeBox(236, 279, 50, 30);
plotPolygons[49] = makeBox(236, 309, 50, 30);
plotPolygons[48] = makeBox(236, 339, 50, 30);
plotPolygons[47] = makeBox(236, 369, 50, 45);
// East Col (50 ft wide): Plots 53, 54, 55, 56, 57, 58
plotPolygons[53] = makeBox(286, 207, 50, 42);
plotPolygons[54] = makeBox(286, 249, 50, 30);
plotPolygons[55] = makeBox(286, 279, 50, 30);
plotPolygons[56] = makeBox(286, 309, 50, 30);
plotPolygons[57] = makeBox(286, 339, 50, 30);
plotPolygons[58] = makeBox(286, 369, 50, 45);

// Road 8: X = 336 to 369 (33 ft)

// Block 7 (X = 369 to 469, 100 ft)
// West Col (50 ft wide): Plots 64, 63, 62, 61, 60, 59
plotPolygons[64] = makeBox(369, 207, 50, 42);
plotPolygons[63] = makeBox(369, 249, 50, 30);
plotPolygons[62] = makeBox(369, 279, 50, 30);
plotPolygons[61] = makeBox(369, 309, 50, 30);
plotPolygons[60] = makeBox(369, 339, 50, 30);
plotPolygons[59] = makeBox(369, 369, 50, 45);
// East Col (50 ft wide): Plots 65, 66, 67, 68, 69, 70
plotPolygons[65] = makeBox(419, 207, 50, 42);
plotPolygons[66] = makeBox(419, 249, 50, 30);
plotPolygons[67] = makeBox(419, 279, 50, 30);
plotPolygons[68] = makeBox(419, 309, 50, 30);
plotPolygons[69] = makeBox(419, 339, 50, 30);
plotPolygons[70] = makeBox(419, 369, 50, 45);

// Road 9: X = 469 to 502 (33 ft)

// Block 8 (X = 502 to 622, 120 ft)
// West Col (60 ft wide): Plots 76, 75, 74, 73, 72, 71
plotPolygons[76] = makeBox(502, 207, 60, 42);
plotPolygons[75] = makeBox(502, 249, 60, 30);
plotPolygons[74] = makeBox(502, 279, 60, 30);
plotPolygons[73] = makeBox(502, 309, 60, 30);
plotPolygons[72] = makeBox(502, 339, 60, 30);
plotPolygons[71] = makeBox(502, 369, 60, 45);
// East Col (60 ft wide): Plots 77, 78, 79, 80, 81, 82
plotPolygons[77] = makeBox(562, 207, 60, 42);
plotPolygons[78] = makeBox(562, 249, 60, 30);
plotPolygons[79] = makeBox(562, 279, 60, 30);
plotPolygons[80] = makeBox(562, 309, 60, 30);
plotPolygons[81] = makeBox(562, 339, 60, 30);
plotPolygons[82] = makeBox(562, 369, 60, 45);

// Road 10: X = 622 to 655 (33 ft)

// Block 9 (X = 655 to 795, 140 ft)
// West Col (60 ft wide): Plots 89, 88, 87, 86, 85, 84, 83
plotPolygons[89] = makeBox(655, 207, 60, 36);
plotPolygons[88] = makeBox(655, 243, 60, 26);
plotPolygons[87] = makeBox(655, 269, 60, 26);
plotPolygons[86] = makeBox(655, 295, 60, 26);
plotPolygons[85] = makeBox(655, 321, 60, 26);
plotPolygons[84] = makeBox(655, 347, 60, 26);
plotPolygons[83] = makeBox(655, 373, 60, 41);
// East Col (80 ft wide): Plots 90, 91, 92, 93, 94, 95, 96
plotPolygons[90] = makeBox(715, 207, 80, 36);
plotPolygons[91] = makeBox(715, 243, 80, 26);
plotPolygons[92] = makeBox(715, 269, 80, 26);
plotPolygons[93] = makeBox(715, 295, 80, 26);
plotPolygons[94] = makeBox(715, 321, 80, 26);
plotPolygons[95] = makeBox(715, 347, 80, 26);
plotPolygons[96] = makeBox(715, 373, 80, 41);

// Far East Road: X = 795 to 835 (40 ft wide)

// Internal Vertical Roads list
const internalRoads = [
  // North Roads
  makeBox(250, 0, 33, 174),
  makeBox(383, 0, 33, 174),
  makeBox(516, 0, 33, 174),
  makeBox(659, 0, 33, 174),
  makeBox(802, 0, 33, 174),
  // South Roads
  makeBox(60, 207, 33, 207),
  makeBox(203, 207, 33, 207),
  makeBox(336, 207, 33, 207),
  makeBox(469, 207, 33, 207),
  makeBox(622, 207, 33, 207),
  makeBox(795, 207, 40, 207),
];

// Venture boundary encompassing all features with a 20ft setback
const boundaryPolygon = [
  toGeo(-15, -15),
  toGeo(845, -15),
  toGeo(845, 425),
  toGeo(-15, 425)
];

// Verify count
const count = Object.keys(plotPolygons).length;
console.log('Total plot polygons mapped:', count);

// Check all numbers 1 to 96
let missing = [];
for (let i = 1; i <= 96; i++) {
  if (!plotPolygons[i]) missing.push(i);
}
console.log('Missing plots:', missing);

// Generate formatted output for src/data/ventureGeoData.js
const outputCode = `/**
 * Alekya Brundavan (Challampally, Kadthal) Venture GeoData
 * Real-world geographic polygon boundaries for Google Maps JavaScript API
 * Centered at Kadthal venture corridor: 16.975000° N, 78.512000° E
 */

export const VENTURE_LOCATION = {
  name: "Alekya Brundavan",
  ventureFullName: "Alekya Brundavanam (Skandha Groups)",
  dtcpNo: "TLP NO. 87/2024/H",
  tsReraNo: "PO2400009081",
  village: "Challampally",
  mandal: "Kadthal",
  district: "Ranga Reddy",
  state: "Telangana",
  highway: "Srisailam Highway (NH 765)",
  center: { lat: 16.975070, lng: 78.511970 },
  defaultZoom: 18,
  minZoom: 14,
  maxZoom: 21
};

export const VENTURE_BOUNDARY = ${JSON.stringify(boundaryPolygon, null, 2)};

export const PARK_POLYGON = {
  name: "Site Reserved for Open Space (Park)",
  areaDescription: "Ac. 0.758 cents",
  coordinates: ${JSON.stringify(parkPolygon, null, 2)},
  center: ${JSON.stringify(getCenter(parkPolygon), null, 2)}
};

export const CENTRAL_ROAD = {
  name: "Proposed 33'-0\\\" Wide East-West Main Road",
  coordinates: ${JSON.stringify(centralRoadPolygon, null, 2)}
};

export const INTERNAL_ROADS = ${JSON.stringify(internalRoads.map((pts, idx) => ({
  id: 'road-' + (idx + 1),
  name: "Prop. 33'-0\\\" Wide Road",
  coordinates: pts
})), null, 2)};

export const PLOT_POLYGONS = ${JSON.stringify(
  Object.fromEntries(
    Object.entries(plotPolygons).map(([num, poly]) => [
      num,
      {
        coordinates: poly,
        center: getCenter(poly)
      }
    ])
  ),
  null,
  2
)};

/**
 * Exports complete venture as standard GeoJSON FeatureCollection
 */
export function exportVentureAsGeoJSON() {
  const features = [];

  // 1. Boundary
  features.push({
    type: "Feature",
    properties: {
      type: "venture_boundary",
      name: VENTURE_LOCATION.name,
      dtcpNo: VENTURE_LOCATION.dtcpNo
    },
    geometry: {
      type: "Polygon",
      coordinates: [VENTURE_BOUNDARY.map(pt => [pt.lng, pt.lat])]
    }
  });

  // 2. Park
  features.push({
    type: "Feature",
    properties: {
      type: "park",
      name: PARK_POLYGON.name,
      area: PARK_POLYGON.areaDescription
    },
    geometry: {
      type: "Polygon",
      coordinates: [PARK_POLYGON.coordinates.map(pt => [pt.lng, pt.lat])]
    }
  });

  // 3. Central Road
  features.push({
    type: "Feature",
    properties: {
      type: "road",
      name: CENTRAL_ROAD.name
    },
    geometry: {
      type: "Polygon",
      coordinates: [CENTRAL_ROAD.coordinates.map(pt => [pt.lng, pt.lat])]
    }
  });

  // 4. Plots 1 to 96
  Object.entries(PLOT_POLYGONS).forEach(([plotNum, data]) => {
    features.push({
      type: "Feature",
      properties: {
        type: "plot",
        plotNumber: Number(plotNum)
      },
      geometry: {
        type: "Polygon",
        coordinates: [data.coordinates.map(pt => [pt.lng, pt.lat])]
      }
    });
  });

  return {
    type: "FeatureCollection",
    properties: {
      venture: VENTURE_LOCATION.name,
      generatedAt: new Date().toISOString()
    },
    features
  };
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/ventureGeoData.js'), outputCode, 'utf-8');
console.log('Successfully wrote src/data/ventureGeoData.js!');
