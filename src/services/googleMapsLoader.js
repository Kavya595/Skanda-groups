import { Loader } from '@googlemaps/js-api-loader';

/**
 * Singleton Google Maps API loader
 * Ensures only one script tag is injected and handles status/errors
 */
let loaderInstance = null;
let loadPromise = null;
let dynamicApiKey = null;

export function setGoogleMapsApiKey(key) {
  dynamicApiKey = key;
  loaderInstance = null;
  loadPromise = null;
}

export function getGoogleMapsApiKey() {
  if (dynamicApiKey) return dynamicApiKey;
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env.VITE_GOOGLE_MAPS_API_KEY) {
      return process.env.VITE_GOOGLE_MAPS_API_KEY;
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Loads the official Google Maps JavaScript API
 * @returns {Promise<typeof google>}
 */
export async function loadGoogleMapsApi() {
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    return window.google;
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    throw new Error(
      'MISSING_API_KEY: Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file or enter an API key.'
    );
  }

  if (loadPromise) {
    return loadPromise;
  }

  loaderInstance = new Loader({
    apiKey: apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry'],
    language: 'en'
  });

  loadPromise = loaderInstance.load().then(() => {
    return window.google;
  }).catch((err) => {
    loadPromise = null;
    throw err;
  });

  return loadPromise;
}
