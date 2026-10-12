# Skandha Groups — Premium Corporate React Website

Corporate web application for **Skandha Groups** (Hyderabad, Telangana), developed using React 19, Vite, Tailwind CSS v4, Lucide Icons, and React Router.

## Brand Identity & Design System

- **Primary Orange:** `#F58220`
- **White Background:** `#FFFFFF`
- **Secondary Grey:** `#6B7280`
- **Charcoal Text & Dark Accents:** `#202124`
- **Off-white Sections:** `#F7F7F7`
- **Light Borders:** `#E5E7EB`
- **WhatsApp Green:** `#25D366`

## Architectural Structure

- **Corporate Entity:** **Skandha Groups** (corporate presentation, vision, core values, development capabilities, and Hastinapuram office).
- **Sole Active Project:** **Alekya** (Alekya's Brundavan, Kadthal, Srisailam Highway) — statutory approvals (TS RERA PO2400009081 & DTCP TLP No. 87/2024/H), 60ft, 40ft & 33ft BT roads, landscaped open park, and orientation tariff structure are strictly isolated to the project section.

## Pages & Routes

1. **Home (`/`)**: Corporate hero section with high-definition modern villa architecture, floating animations, 4 animated metrics counters, corporate background, 6 development standards, strategic advantages, active venture preview card, and distinct gallery preview.
2. **About (`/about`)**: Corporate story, foundation in Hastinapuram, mission, vision, 4 core values, and executive leadership placeholders.
3. **Projects (`/projects`)**: Dedicated single project card for **Alekya** featuring **Two Primary Action Buttons**:
   - **View Project**: Opens dedicated project page (`/projects/alekya`) showcasing comprehensive project highlights, location highlights, and specifications.
   - **View Plots**: Opens interactive layout and orientation extra charges / tariff modal.
4. **Project Detail (`/projects/alekya`)**: Dedicated project showcase for Alekya with full statutory clearances, 13 project highlights, 8 location highlights, 5 plot tariff tiers, downloadable brochure PDF, and plot inquiry form.
5. **Gallery (`/gallery`)**: 12 distinct, crystal-clear, high-definition architectural, community park, and infrastructure images with full-screen Lightbox (keyboard arrow navigation, escape key, and category filters).
6. **Contact (`/contact`)**: Registered corporate office in Hastinapuram, phone and email consultation cards, interactive form with validation, and Google Maps locator.

## Project Structure

```
├── public/
│   ├── brochures/
│   │   └── Skandha_Alekya_Brundavan_Brochure.pdf
│   ├── images/
│   │   ├── hero-hand-villa.jpg
│   │   └── hero-family.jpg
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CallToAction.jsx
│   │   ├── ContactForm.jsx
│   │   ├── Footer.jsx
│   │   ├── GalleryGrid.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Lightbox.jsx
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── PageMeta.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── WhatsAppButton.jsx
│   ├── config/
│   │   └── company.js
│   ├── data/
│   │   ├── gallery.js
│   │   └── projects.js
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Gallery.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProjectDetail.jsx
│   │   └── Projects.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

### 4. Run Lint & Automated QA Tests
```bash
npm run lint
npm test
```

## Configuration Guide

### Configuring the WhatsApp Business Number
Open `src/config/company.js`:
```javascript
whatsApp: {
  businessNumber: "919949501513", // Country code + 10-digit number
  inquiryMessage: "Hello Skandha Groups, I would like to know more about your company and developments.",
}
```
*Note: If left as `REPLACE_WITH_BUSINESS_NUMBER`, the WhatsApp button safely presents a consultation dialogue with direct phone and email alternatives.*

### Configuring Contact Form Backend
Open `src/config/company.js`:
```javascript
backendApi: {
  contactEndpoint: "https://formspree.io/f/your_form_id", // Or custom REST API endpoint
  isLiveConfigured: true,
}
```
