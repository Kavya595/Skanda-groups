import assert from 'node:assert';
import { 
  VENTURE_LOCATION, 
  VENTURE_BOUNDARY, 
  PARK_POLYGON, 
  CENTRAL_ROAD, 
  INTERNAL_ROADS, 
  PLOT_POLYGONS, 
  exportVentureAsGeoJSON 
} from '../src/data/ventureGeoData.js';
import { STATUS_COLORS } from '../src/config/mapStatusColors.js';
import { getGoogleMapsApiKey, setGoogleMapsApiKey, loadGoogleMapsApi } from '../src/services/googleMapsLoader.js';

console.log('=== STARTING GOOGLE MAPS INTEGRATION TEST SUITE ===\n');

// 1. Geographic Venture Coordinates Verification
console.log('--- 1. Testing Geographical Venture Data ---');
assert.strictEqual(VENTURE_LOCATION.name, 'Alekya Brundavan');
assert.strictEqual(VENTURE_LOCATION.dtcpNo, 'TLP NO. 87/2024/H');
assert(VENTURE_LOCATION.center.lat > 16.9 && VENTURE_LOCATION.center.lat < 17.1, 'Lat should be in Kadthal');
assert(VENTURE_LOCATION.center.lng > 78.4 && VENTURE_LOCATION.center.lng < 78.6, 'Lng should be in Kadthal');
console.log('✅ PASS: Venture center coordinates are in Kadthal corridor');

assert(Array.isArray(VENTURE_BOUNDARY) && VENTURE_BOUNDARY.length >= 4, 'Boundary should have at least 4 vertices');
console.log('✅ PASS: Venture boundary polygon is defined with 4 corner vertices');

// 2. All 96 Plots Polygons Verification
console.log('\n--- 2. Testing Plot Polygons (1 to 96) ---');
const plotNumbers = Object.keys(PLOT_POLYGONS).map(Number);
assert.strictEqual(plotNumbers.length, 96, `Expected exactly 96 plot polygons, found ${plotNumbers.length}`);
for (let i = 1; i <= 96; i++) {
  const p = PLOT_POLYGONS[i];
  assert(p, `Plot #${i} polygon must exist`);
  assert.strictEqual(p.coordinates.length, 4, `Plot #${i} must be a 4-point polygon`);
  assert(p.center && p.center.lat && p.center.lng, `Plot #${i} must have valid center coordinates`);
}
console.log('✅ PASS: All 96 plot polygons exist with valid coordinates & centers');

// 3. Roads and Park Verification
console.log('\n--- 3. Testing Roads and Park Features ---');
assert(PARK_POLYGON.coordinates.length >= 4, 'Park must have polygon coordinates');
assert.strictEqual(CENTRAL_ROAD.coordinates.length, 4, 'Central 33ft road must have 4 vertices');
assert.strictEqual(INTERNAL_ROADS.length, 11, 'Internal vertical roads count matches blueprint');
console.log('✅ PASS: Park and all 12 road segments (1 central + 11 internal) verified');

// 4. GeoJSON Export Verification
console.log('\n--- 4. Testing GeoJSON Export ---');
const geojson = exportVentureAsGeoJSON();
assert.strictEqual(geojson.type, 'FeatureCollection');
assert.strictEqual(geojson.features.length, 99, '1 boundary + 1 park + 1 central road + 96 plots = 99 features');
console.log('✅ PASS: GeoJSON FeatureCollection generated with 99 features');

// 5. Configurable Status Colors Verification
console.log('\n--- 5. Testing Plot Status Colors & Palette ---');
assert(STATUS_COLORS.available && STATUS_COLORS.available.fill === '#22c55e', 'Available must be green');
assert(STATUS_COLORS.booked && STATUS_COLORS.booked.fill === '#2563eb', 'Booked must be blue');
assert(STATUS_COLORS.sold && STATUS_COLORS.sold.fill === '#ef4444', 'Sold must be red');
assert(STATUS_COLORS.reserved && STATUS_COLORS.reserved.fill === '#f59e0b', 'Reserved must be orange');
assert(STATUS_COLORS.blocked && STATUS_COLORS.blocked.fill === '#64748b', 'Blocked must be gray');
console.log('✅ PASS: All 5 status colors (green, blue, red, orange, gray) verified');

// 6. Google Maps Loader Verification
console.log('\n--- 6. Testing Google Maps API Loader ---');
setGoogleMapsApiKey('TEST_KEY_AIzaSyFakeKey123');
assert.strictEqual(getGoogleMapsApiKey(), 'TEST_KEY_AIzaSyFakeKey123');
setGoogleMapsApiKey('');
assert.strictEqual(getGoogleMapsApiKey(), '');
console.log('✅ PASS: Dynamic API key setting & retrieval works');

let caughtMissingKeyError = false;
try {
  await loadGoogleMapsApi();
} catch (err) {
  caughtMissingKeyError = err.message.includes('MISSING_API_KEY');
}
assert(caughtMissingKeyError, 'Loader should fail gracefully with MISSING_API_KEY error');
console.log('✅ PASS: Missing API key throws descriptive error without crashing application');

console.log('\n=== ALL GOOGLE MAPS INTEGRATION TESTS PASSED (6/6) ===');
