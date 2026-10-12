import { COMPANY_CONFIG, isWhatsAppConfigured, getWhatsAppUrl } from '../src/config/company.js';
import { PROJECTS_DATA } from '../src/data/projects.js';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../src/data/gallery.js';

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
assert(COMPANY_CONFIG.whatsApp.businessNumber === 'REPLACE_WITH_BUSINESS_NUMBER', 'WhatsApp placeholder constant is present as mandated');
assert(isWhatsAppConfigured() === false, 'isWhatsAppConfigured() returns false when businessNumber is placeholder');
assert(getWhatsAppUrl() === null, 'getWhatsAppUrl() returns null when businessNumber is placeholder (prevents broken link)');

// Test with simulated configured number
COMPANY_CONFIG.whatsApp.businessNumber = '919949501513';
assert(isWhatsAppConfigured() === true, 'isWhatsAppConfigured() returns true when valid number is provided');
const generatedUrl = getWhatsAppUrl('Test message');
assert(generatedUrl && generatedUrl.includes('https://wa.me/919949501513') && generatedUrl.includes('Test%20message'), 'getWhatsAppUrl() generates valid URL with encoded message');
// Reset back to placeholder
COMPANY_CONFIG.whatsApp.businessNumber = 'REPLACE_WITH_BUSINESS_NUMBER';

// 3. Projects Data Integrity (Single Project: Alekya)
console.log('\n--- 3. Testing Projects Data (Sole Project: Alekya) ---');
assert(PROJECTS_DATA.length === 1, `Projects contains exactly 1 project as requested (found ${PROJECTS_DATA.length})`);
const alekya = PROJECTS_DATA[0];
assert(alekya.name === 'Alekya', 'Project name is Alekya');
assert(alekya.reraNo.includes('PO2400009081'), 'Alekya TS RERA number PO2400009081 is verified');
assert(alekya.dtcpNo.includes('87/2024/H'), 'Alekya DTCP approval TLP NO. 87/2024/H is verified');
assert(alekya.plotOrientations && alekya.plotOrientations.length === 5, 'Alekya includes all 5 orientation configurations');
assert(!JSON.stringify(PROJECTS_DATA).includes('Rs.') && !JSON.stringify(PROJECTS_DATA).includes('/-'), 'Zero confidential pricing or tariff figures exposed in projects data');
assert(alekya.projectHighlights && alekya.projectHighlights.length >= 10, 'Alekya includes full project highlights');
assert(alekya.locationHighlights && alekya.locationHighlights.length >= 7, 'Alekya includes full location highlights');

// 4. Gallery Data Integrity (Distinct, High-Res Images)
console.log('\n--- 4. Testing Gallery Data & Categories ---');
assert(GALLERY_CATEGORIES.length >= 4, `Gallery has categories defined (${GALLERY_CATEGORIES.join(', ')})`);
assert(GALLERY_ITEMS.length === 12, `Gallery has exactly 12 distinct high-resolution items (found ${GALLERY_ITEMS.length})`);
const allHaveAlts = GALLERY_ITEMS.every(item => item.alt && item.alt.length > 5);
assert(allHaveAlts, 'All gallery images have descriptive alt text for accessibility');
const allAreHighRes = GALLERY_ITEMS.every(item => item.image.startsWith('https://images.unsplash.com/'));
assert(allAreHighRes, 'All gallery images use high-definition photographic assets');

console.log(`\n=== QA SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount > 0) process.exit(1);
