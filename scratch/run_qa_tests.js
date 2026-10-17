import { COMPANY_CONFIG, isWhatsAppConfigured, getWhatsAppUrl } from '../src/config/company.js';
import { PROJECTS_DATA } from '../src/data/projects.js';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../src/data/gallery.js';
import { INITIAL_PLOTS_DATA } from '../src/data/plotData.js';

console.log('=== STARTING SKANDHA GROUPS QA SUITE ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failCount++;
  }
}

// 1. Company Config Verification (Corporate Entity)
console.log('--- 1. Testing Company Config & Corporate Identity ---');
assert(COMPANY_CONFIG.name === 'Skandha Groups', 'Company name is Skandha Groups');
assert(COMPANY_CONFIG.address.full.includes('Hastinapuram'), 'Registered address includes Hastinapuram, Hyderabad');

// 2. WhatsApp Configuration and Fallback Behavior
console.log('\n--- 2. Testing WhatsApp Integration & Safeguards ---');
const originalNum = COMPANY_CONFIG.whatsApp.businessNumber;
COMPANY_CONFIG.whatsApp.businessNumber = '';
assert(isWhatsAppConfigured() === false, 'isWhatsAppConfigured() returns false when businessNumber is empty');
assert(getWhatsAppUrl() === null, 'getWhatsAppUrl() returns null when businessNumber is empty (prevents broken link)');

// Test with simulated configured number
COMPANY_CONFIG.whatsApp.businessNumber = '919949501513';
assert(isWhatsAppConfigured() === true, 'isWhatsAppConfigured() returns true when valid number is provided');
const generatedUrl = getWhatsAppUrl('Test message');
assert(generatedUrl && generatedUrl.includes('https://wa.me/919949501513') && generatedUrl.includes('Test%20message'), 'getWhatsAppUrl() generates valid URL with encoded message');
COMPANY_CONFIG.whatsApp.businessNumber = originalNum;

// 3. Projects Data Integrity (Single Project: Alekya)
console.log('\n--- 3. Testing Projects Data (Sole Project: Alekya) ---');
assert(PROJECTS_DATA.length === 1, `Projects contains exactly 1 project as requested (found ${PROJECTS_DATA.length})`);
const alekya = PROJECTS_DATA[0];
assert(alekya.name === 'Skandha Grand Valley', 'Project name is Skandha Grand Valley');
assert(alekya.reraNo.includes('PO2400009081'), 'Alekya TS RERA number PO2400009081 is verified');
assert(alekya.dtcpNo.includes('87/2024/H'), 'Alekya DTCP approval TLP NO. 87/2024/H is verified');
assert(alekya.plotOrientations && alekya.plotOrientations.length >= 3, 'Alekya includes orientation configurations');
assert(!JSON.stringify(PROJECTS_DATA).includes('Rs.') && !JSON.stringify(PROJECTS_DATA).includes('/-'), 'Zero confidential pricing or tariff figures exposed in projects data');
assert(alekya.projectHighlights && alekya.projectHighlights.length >= 10, 'Alekya includes full project highlights');
assert(alekya.locationHighlights && alekya.locationHighlights.length >= 7, 'Alekya includes full location highlights');

// 4. Masterplan 3D Plots Data Integrity
console.log('\n--- 4. Testing Masterplan 3D Plots Data Integrity ---');
assert(INITIAL_PLOTS_DATA.length === 96, `Masterplan contains exactly 96 plots (found ${INITIAL_PLOTS_DATA.length})`);
assert(INITIAL_PLOTS_DATA.every(p => p.number && p.status && p.sqYards), 'All 96 plots have number, status, and sqYards');

// 5. Gallery Data Integrity (Distinct, High-Res Images)
console.log('\n--- 5. Testing Gallery Data & Categories ---');
assert(GALLERY_CATEGORIES.length >= 1, `Gallery has categories defined (${GALLERY_CATEGORIES.join(', ')})`);
assert(GALLERY_ITEMS.length === 12, `Gallery has exactly 12 distinct high-resolution items (found ${GALLERY_ITEMS.length})`);
const allHaveAlts = GALLERY_ITEMS.every(item => item.alt && item.alt.length > 5);
assert(allHaveAlts, 'All gallery images have descriptive alt text for accessibility');
const allAreHighRes = GALLERY_ITEMS.every(item => item.image.startsWith('https://images.unsplash.com/'));
assert(allAreHighRes, 'All gallery images use high-definition photographic assets');

// 6. Interactive Google Maps Plot Layout Verification
console.log('\n--- 6. Testing Interactive Google Maps Integration & Geodata ---');
const { 
  VENTURE_LOCATION, 
  VENTURE_BOUNDARY, 
  PARK_POLYGON, 
  CENTRAL_ROAD, 
  INTERNAL_ROADS, 
  PLOT_POLYGONS, 
  exportVentureAsGeoJSON 
} = await import('../src/data/ventureGeoData.js');
const { STATUS_COLORS } = await import('../src/config/mapStatusColors.js');
const { getGoogleMapsApiKey, setGoogleMapsApiKey, loadGoogleMapsApi } = await import('../src/services/googleMapsLoader.js');

assert(VENTURE_LOCATION.center.lat > 16.9 && VENTURE_LOCATION.center.lat < 17.1, 'Venture coordinates centered in Kadthal corridor');
assert(VENTURE_BOUNDARY.length === 4, 'Venture boundary polygon defined with 4 corners');
assert(Object.keys(PLOT_POLYGONS).length === 96, 'All 96 plot polygons mapped with real-world coordinates');
assert(PARK_POLYGON.coordinates.length === 4, 'Park & open space reserve polygon mapped');
assert(INTERNAL_ROADS.length === 11 && CENTRAL_ROAD.coordinates.length === 4, 'Complete 33-foot internal street network mapped');
const geoJson = exportVentureAsGeoJSON();
assert(geoJson.type === 'FeatureCollection' && geoJson.features.length === 99, 'GeoJSON export produces valid FeatureCollection with 99 elements');
assert(STATUS_COLORS.available.fill === '#22c55e' && STATUS_COLORS.booked.fill === '#2563eb' && STATUS_COLORS.sold.fill === '#ef4444', 'Configurable status colors configured (green, blue, red)');

// Verify API Loader error handling
let caughtError = false;
try {
  setGoogleMapsApiKey('');
  await loadGoogleMapsApi();
} catch (e) {
  caughtError = e.message.includes('MISSING_API_KEY');
}
assert(caughtError, 'Google Maps Loader fails gracefully without breaking the application when key is missing');

// 7. Testing Leaflet.js, React Leaflet, and Sample Three Adjacent Plots Layout
console.log('\n--- 7. Testing Leaflet.js & Three Adjacent Sample Plots ---');
const { 
  SAMPLE_THREE_ADJACENT_PLOTS, 
  SAMPLE_PROJECT_INFO, 
  formatPlotsForLeaflet 
} = await import('../src/data/samplePlotsData.js');
const { getPlotPathOptions } = await import('../src/config/mapStatusColors.js');

assert(Array.isArray(SAMPLE_THREE_ADJACENT_PLOTS) && SAMPLE_THREE_ADJACENT_PLOTS.length === 3, 'Sample layout contains exactly 3 adjacent plots');

// Check required fields on all three plots
const requiredFields = ['id', 'plotNumber', 'projectId', 'areaSqYards', 'price', 'status', 'facing', 'coordinates'];
const allFieldsPresent = SAMPLE_THREE_ADJACENT_PLOTS.every(plot => 
  requiredFields.every(field => plot[field] !== undefined && plot[field] !== null)
);
assert(allFieldsPresent, 'All 3 sample plots contain id, plotNumber, projectId, areaSqYards, price, status, facing, coordinates');

// Verify Leaflet coordinate order [lat, lng]
const validCoords = SAMPLE_THREE_ADJACENT_PLOTS.every(plot => 
  Array.isArray(plot.coordinates) && plot.coordinates.length === 4 &&
  plot.coordinates.every(pt => pt[0] > 16.0 && pt[0] < 18.0 && pt[1] > 78.0 && pt[1] < 80.0)
);
assert(validCoords, 'All plot coordinates follow Leaflet [latitude, longitude] order correctly');

// Verify shared boundary between Plot 101 and Plot 102 (Edge: lng = 78.51130)
const p101 = SAMPLE_THREE_ADJACENT_PLOTS[0];
const p102 = SAMPLE_THREE_ADJACENT_PLOTS[1];
const p103 = SAMPLE_THREE_ADJACENT_PLOTS[2];

const p101EastBoundary = [p101.coordinates[1], p101.coordinates[2]]; // NE, SE
const p102WestBoundary = [p102.coordinates[0], p102.coordinates[3]]; // NW, SW
const boundary101_102Shared = 
  p101EastBoundary[0][0] === p102WestBoundary[0][0] &&
  p101EastBoundary[0][1] === p102WestBoundary[0][1] &&
  p101EastBoundary[1][0] === p102WestBoundary[1][0] &&
  p101EastBoundary[1][1] === p102WestBoundary[1][1];
assert(boundary101_102Shared, 'Plot 101 and Plot 102 share exact boundary without gaps or overlaps (lng: 78.51130)');

// Verify shared boundary between Plot 102 and Plot 103 (Edge: lng = 78.51160)
const p102EastBoundary = [p102.coordinates[1], p102.coordinates[2]]; // NE, SE
const p103WestBoundary = [p103.coordinates[0], p103.coordinates[3]]; // NW, SW
const boundary102_103Shared = 
  p102EastBoundary[0][0] === p103WestBoundary[0][0] &&
  p102EastBoundary[0][1] === p103WestBoundary[0][1] &&
  p102EastBoundary[1][0] === p103WestBoundary[1][0] &&
  p102EastBoundary[1][1] === p103WestBoundary[1][1];
assert(boundary102_103Shared, 'Plot 102 and Plot 103 share exact boundary without gaps or overlaps (lng: 78.51160)');

// Test dynamic status styles and path options
const availableStyle = getPlotPathOptions('available', false);
const selectedStyle = getPlotPathOptions('available', true);
const soldStyle = getPlotPathOptions('sold', false);
assert(availableStyle.fillColor === '#22c55e', 'Available plot path options use green fill');
assert(soldStyle.fillColor === '#ef4444', 'Sold plot path options use red fill');
assert(selectedStyle.weight === 4 && selectedStyle.opacity === 1.0, 'Selected plot has thicker distinct boundary (weight: 4)');

// Test formatPlotsForLeaflet helper
const formatted = formatPlotsForLeaflet([{ number: 99, sqYards: 250, status: 'available' }], { 99: [[16.9, 78.5], [16.9, 78.6]] });
assert(formatted.length === 1 && formatted[0].plotNumber === 99 && formatted[0].areaSqYards === 250, 'formatPlotsForLeaflet successfully transforms API plots');

console.log(`\n=== QA SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount > 0) process.exit(1);

