/**
 * Sample Data for 3 Adjacent Plots (Demonstration Layout)
 * 
 * Demonstrates the required Leaflet geographic polygon structure:
 * Coordinate order: [latitude, longitude] (Standard Leaflet format)
 * 
 * IMPORTANT:
 * - This is an illustrative sample layout of three adjacent plots sharing boundaries.
 * - Plot 101 and Plot 102 share the western boundary of Plot 102 (longitude: 78.51130).
 * - Plot 102 and Plot 103 share the western boundary of Plot 103 (longitude: 78.51160).
 * - There are zero gaps and zero overlaps between shared boundaries.
 * - This data is clearly separated from production venture inventory and can be replaced
 *   with real georeferenced venture data from your backend.
 */

export const SAMPLE_PROJECT_INFO = {
  id: "sample-demo-venture",
  name: "Green Valley Phase 1 (Demonstration Layout)",
  location: "Sample Corridor, Telangana",
  center: [16.97535, 78.51145],
  defaultZoom: 19
};

export const SAMPLE_THREE_ADJACENT_PLOTS = [
  {
    id: "sample-plot-101",
    plotNumber: 101,
    projectId: "sample-demo-venture",
    areaSqYards: 200,
    price: 2500000, // ₹25,00,000 (Sample price)
    status: "available",
    facing: "East",
    dimensions: "33' × 54.5'",
    roadWidth: "33' B.T. Road",
    isCorner: false,
    description: "Sample Plot 101: East facing, prime rectangular residential plot.",
    coordinates: [
      [16.97550, 78.51100], // Top-Left (NW)
      [16.97550, 78.51130], // Top-Right (NE) - Shared with Plot 102
      [16.97520, 78.51130], // Bottom-Right (SE) - Shared with Plot 102
      [16.97520, 78.51100]  // Bottom-Left (SW)
    ]
  },
  {
    id: "sample-plot-102",
    plotNumber: 102,
    projectId: "sample-demo-venture",
    areaSqYards: 200,
    price: 2500000, // ₹25,00,000 (Sample price)
    status: "reserved",
    facing: "East",
    dimensions: "33' × 54.5'",
    roadWidth: "33' B.T. Road",
    isCorner: false,
    description: "Sample Plot 102: East facing, middle plot sharing borders with Plot 101 and Plot 103.",
    coordinates: [
      [16.97550, 78.51130], // Top-Left (NW) - Shared with Plot 101
      [16.97550, 78.51160], // Top-Right (NE) - Shared with Plot 103
      [16.97520, 78.51160], // Bottom-Right (SE) - Shared with Plot 103
      [16.97520, 78.51130]  // Bottom-Left (SW) - Shared with Plot 101
    ]
  },
  {
    id: "sample-plot-103",
    plotNumber: 103,
    projectId: "sample-demo-venture",
    areaSqYards: 220,
    price: 2750000, // ₹27,50,000 (Sample price)
    status: "sold",
    facing: "North-East",
    dimensions: "36.3' × 54.5'",
    roadWidth: "33' B.T. Road",
    isCorner: true,
    description: "Sample Plot 103: North-East corner plot sharing western border with Plot 102.",
    coordinates: [
      [16.97550, 78.51160], // Top-Left (NW) - Shared with Plot 102
      [16.97550, 78.51190], // Top-Right (NE)
      [16.97520, 78.51190], // Bottom-Right (SE)
      [16.97520, 78.51160]  // Bottom-Left (SW) - Shared with Plot 102
    ]
  }
];

/**
 * Helper function to convert backend plot inventory and geojson/coordinates
 * into the standard Leaflet plot data structure.
 * 
 * @param {Array} apiPlots - Array of plot records from backend API
 * @param {Object} geoPolygonMap - Map of plotNumber -> polygon coordinates [[lat, lng], ...]
 * @returns {Array} Array of standard Leaflet-ready plot objects
 */
export function formatPlotsForLeaflet(apiPlots = [], geoPolygonMap = {}) {
  return apiPlots.map((plot) => {
    const plotNo = plot.number || plot.plotNumber;
    const coords = geoPolygonMap[plotNo] || plot.coordinates || [];
    
    return {
      id: plot.id || `plot-${plotNo}`,
      plotNumber: plotNo,
      projectId: plot.projectId || 'alekya-brundavan',
      areaSqYards: Number(plot.sqYards) || Number(plot.areaSqYards) || 200,
      price: Number(plot.price) || (Number(plot.sqYards || 200) * 12500),
      status: (plot.status || 'available').toLowerCase(),
      facing: plot.facing || 'East',
      dimensions: plot.dimensions || "33' × 55'",
      roadWidth: plot.roadWidth || "33' B.T. Road",
      isCorner: !!plot.isCorner,
      coordinates: coords
    };
  });
}
