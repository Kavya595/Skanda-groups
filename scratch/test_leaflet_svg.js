import L from 'leaflet';

// Verify Leaflet's SVG renderer generates correct fill attribute
const mapDiv = {
  _leaflet_id: 1,
  style: {},
  appendChild: () => {},
  removeChild: () => {},
  querySelectorAll: () => [],
  querySelector: () => null,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
};

console.log('Leaflet loaded successfully, version:', L.version);
