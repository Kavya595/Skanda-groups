# Skandha Group — Alekhya's Brundavan, Kadthal

A full-stack, responsive real-estate platform and GIS-style plot layout visualization system for **Alekhya's Brundavan**, Kadthal by **Skandha Group**.

Built from scratch with **React 18 + Vite**, **Tailwind CSS**, **Three.js / React Three Fiber**, **Node.js + Express**, and **MongoDB + Mongoose**.

---

## 1. Brand & Project Authentication

- **Developer:** [Skandha Group](file:///d:/Skandha%20Group)
- **Project Name:** Alekhya's Brundavan (Challampally / Alekhya Brundavanam, Kadthal)
- **Official Approvals:**
  - **DTCP Approved Layout:** `TLP NO. 87/2024/H`
  - **TS RERA Registration:** `PO2400009081 @ KADTHAL`
- **Headquarters Address:**
  - `# 8-7-91/17/1, 4th Floor Bata Building, Beside Naveena Hospital, Main Road, Hastinapuram, Hyderabad, Telangana -500079`
- **Official Brand Mark:**
  - Official vector logo extracted directly from source vector PDF: warm orange (`#F15A24`), charcoal slate (`#334155`), and clean white.
- **Privacy & Telephone Policy:**
  - No visible phone numbers as plain text on marketing pages. The configured WhatsApp phone number is securely stored in private backend admin settings and used exclusively to generate pre-formatted `wa.me` dialogue links upon lead validation.

---

## 2. Architecture & Repository Structure

```
d:\Skandha Group\
├── server\                     # Node.js + Express + MongoDB Backend
│   ├── src\
│   │   ├── config\db.js        # MongoDB Connection with Mongoose
│   │   ├── models\             # Mongoose Schemas (AdminUser, Plot, Lead, ActivityEvent, SiteSettings, GalleryItem, AuditLog)
│   │   ├── controllers\        # REST Controllers (Auth, Plot, Lead, Analytics, Settings, Gallery, Audit)
│   │   ├── middleware\         # Security (Auth JWT, Rate Limiter, Honeypot/Input Validator, Error Handler)
│   │   ├── data\               # Digitized 96 Plots dataset from Brochure Page 2
│   │   ├── routes\api.js       # API Router with Public and Admin segregation
│   │   ├── scripts\            # Seeder (seedPlots.js), Asset organizer (organizeAssets.js)
│   │   ├── app.js              # Express app with Helmet, CORS, and SPA fallback
│   │   └── server.js           # Server entry point
│   ├── tests\api.test.js       # Automated integration test suite (21 tests)
│   └── .env.example            # Environment template
├── client\                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── public\assets\          # Official SVGs, brochure PDFs, stamps, site photos
│   ├── src\
│   │   ├── api\client.js       # Complete REST API client layer
│   │   ├── context\AuthContext.jsx # Admin session context
│   │   ├── visualizer\         # Dual 2D SVG & 3D Three.js Plot visualizers
│   │   │   ├── Layout2DView.jsx # 2D SVG Master Plan with pan, zoom, park, roads, compass
│   │   │   ├── Layout3DView.jsx # 3D Three.js / R3F scene with raised plots, trees, roads, cars
│   │   │   └── layoutData.js   # Geometry constants & status colors
│   │   ├── components\         # Navbar, Footer, EnquiryModal, Lightbox, PlotDrawer
│   │   └── pages\              # Public pages (Home, Project, Plots, Gallery, About, Contact)
│   │       └── admin\          # Admin Portal (Dashboard, Plots, Leads, Analytics, Settings, Gallery, Audit)
└── README.md                   # Full system documentation
```

---

## 3. Verified Layout Dataset (Digitized from Brochure Page 2)

All **96 numbered plots** from Brochure Page 2 have been digitized with survey dimensions and square-yard areas:

1. **North-West Park:** `SITE RESERVED FOR OPEN SPACE (PARK) Ac. 0.758 cents` (Dimensions: `209'-9" x 169'-3" x 201'-6"`).
2. **Road Hierarchy:**
   - **Proposed 60'-0" Wide Road:** North arterial road leading eastward towards **Masigandi Temple**.
   - **Srisailam Highway (NH 765):** Adjoining eastern border with parallel `Proposed 33'-0" Wide Road` service corridor.
   - **Proposed 33'-0" Wide Internal Grid:** Central divider boulevard and North-South connecting avenues.
   - **4th Phase Development:** Southern boundary.
3. **Numbered Plot Blocks:**
   - **Plots 1 to 6:** Eastern strip along Srisailam Highway (241 to 385 sq.yds).
   - **Plots 7 to 12:** Top column 4 (202 to 243 sq.yds).
   - **Plots 13 to 16:** Top column 3 (202 to 260 sq.yds).
   - **Plots 17 to 24:** Top column 2 (183 to 251 sq.yds).
   - **Plots 25 to 30:** Top column 1 adjacent to park (183 to 264 sq.yds).
   - **Plots 31 to 36:** West boundary avenue strip (219 to 672 sq.yds).
   - **Plots 37 to 46:** Bottom column 1 (202 to 403 sq.yds).
   - **Plots 47 to 58:** Bottom column 2 (183 to 315 sq.yds).
   - **Plots 59 to 70:** Bottom column 3 (183 to 314 sq.yds).
   - **Plots 71 to 82:** Bottom column 4 (202 to 347 sq.yds).
   - **Plots 83 to 96:** Bottom column 5 along Highway (194 to 435 sq.yds).
4. **Brochure Extra Charges per Sq. Yd Table:**
   - `N/E & N/W Corner`: **Rs. 800/-** per Sq.Yd
   - `S/E & S/W Corner`: **Rs. 600/-** per Sq.Yd
   - `East Face`: **Rs. 500/-** per Sq.Yd
   - `North Face`: **Rs. 500/-** per Sq.Yd
   - `40 feet road frontage`: **Rs. 500/-** per Sq.Yd

---

## 4. Setup & Installation

### Prerequisites
- **Node.js** >= 18.0.0 (Tested on Node.js v24)
- **MongoDB** >= 5.0 (Running locally on `127.0.0.1:27017` or MongoDB Atlas URI)

### Step 1: Install Dependencies
```bash
# In project root
npm run install:all
```

### Step 2: Environment Configuration
Copy `.env.example` in `server/`:
```bash
cd server
cp .env.example .env
```
Ensure the variables are set:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skandha_brundavan
JWT_SECRET=skandha_super_secure_jwt_token_secret_kadthal_2026
ADMIN_BOOTSTRAP_SECRET=skandha_kadthal_master_setup_key_2026
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
DEFAULT_WHATSAPP_NUMBER=919876543210
```

### Step 3: Seed Database & Initialize Admin
Run the automated seeder to populate all 96 brochure plots, default site metadata, verified gallery items, and seed administrator:
```bash
npm run seed
```

Default Seed Admin Credentials:
- **Username:** `admin` (or `admin@skandhagroup.com`)
- **Initial Password:** `SkandhaAdmin2026!` *(Flagged to prompt change on first login)*

---

## 5. Running the Application

### Option A: Production Unified Server (Single Port 5000)
Build the frontend and run Express:
```bash
npm run build
npm start
```
- **Public Website & Master Plan:** [http://localhost:5000/](http://localhost:5000/)
- **Interactive Plot Visualizer:** [http://localhost:5000/plots](http://localhost:5000/plots)
- **Admin Portal:** [http://localhost:5000/admin](http://localhost:5000/admin)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

### Option B: Development Mode (Vite HMR + Express)
Run in two terminal windows:
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Vite Dev Server
npm run client
```
- Vite Client runs at `http://localhost:5173` with automatic API proxy to port 5000.

---

## 6. Automated Test Suite

Run the backend integration test suite using Node's native test runner and Supertest:
```bash
npm test
```

### Test Coverage (21 Automated Tests Passed):
1. **Health Check & Public Endpoints:**
   - `GET /health` returns 200 and healthy status.
   - `GET /api/settings` returns public settings without leaking private WhatsApp number.
   - `GET /api/plots` returns all 96 layout plots.
   - `GET /api/plots/stats` returns inventory counts (available, reserved, sold, blocked).
   - `GET /api/plots/1` returns single plot details.
2. **Lead Submission & Anti-Spam Protection:**
   - `POST /api/leads` succeeds with valid details and generates `wa.me` handoff link.
   - `POST /api/leads` blocks bot submissions when honeypot field `hp_website` is filled.
   - `POST /api/leads` rejects invalid email formats and missing consent.
3. **Authentication & RBAC:**
   - Rejects unauthenticated requests to `/api/admin/*` (401 Unauthorized).
   - Rejects invalid login passwords.
   - Succeeds with valid credentials and issues signed JWT.
   - Allows protected route access with valid Bearer token.
4. **Plot Status & Inventory Management:**
   - Updates plot status (`available`, `reserved`, `sold`, `blocked`) with automatic audit log entry.
   - Rejects invalid status enumerations.
5. **Privacy-Conscious Analytics:**
   - Ingests allowlisted events (`layout_opened`, `view_mode_toggled`, `plot_viewed`, `enquiry_submitted`).
   - Rejects unauthorized tracking events.

---

## 7. Security & Compliance Measures

1. **Anti-Spam Lead Capture:**
   - Hidden honeypot field (`hp_website`) drops automated spam bots without executing database writes.
   - Rate limiting on lead submissions (max 20 per hour per IP) and admin login attempts (max 10 per 15 minutes).
   - Duplicate submission protection prevents multiple accidental submissions for the same email and plot within 3 minutes.
2. **Authentication & Session Security:**
   - Passwords hashed using `bcrypt` with cost factor 12.
   - JWT tokens stored in `httpOnly`, `SameSite: Lax` secure cookies (or Bearer Authorization header).
   - Superadmin bootstrap route protected by one-time `ADMIN_BOOTSTRAP_SECRET` and permanently locked once the initial user is created.
   - Role-based access control (`superadmin` / `editor`).
3. **Audit Logging:**
   - Every administrative action (plot modification, status override, lead note, deletion, setting update) is permanently recorded with user ID, email, action type, before/after change diffs, and IP address.
4. **Data Retention & Privacy Compliance:**
   - Analytics events strip any personal identification information (PII) and only log allowlisted user interactions (view mode toggle, plot click, filter applied).
   - Administrative lead deletion endpoint complies with data deletion requests.

---

## 8. Database Backup & Restore

### Backup
```bash
mongodump --uri="mongodb://127.0.0.1:27017/skandha_brundavan" --out="./backup_$(date +%Y%m%d)"
```

### Restore
```bash
mongorestore --uri="mongodb://127.0.0.1:27017/skandha_brundavan" --dir="./backup_20261013/skandha_brundavan"
```

---

## 9. Source-Dependent Gaps Requiring Human Confirmation

In strict compliance with instructions to avoid fabricating approvals, pricing, or surveyor claims:

| Item | Current Implementation Status | Source-Dependent Requirement for Admin Confirmation |
| :--- | :--- | :--- |
| **Legal Layout Boundaries** | Digitized faithfully from Brochure Page 2 layout plan (`TLP NO. 87/2024/H`). | Human surveyor / CAD boundary coordinates must be confirmed against final revenue survey records before municipal title registration. |
| **Current Plot Inventory Availability** | Seeded with realistic sample distribution (70 available, 12 reserved, 12 sold, 2 blocked). | Real-time booking book must be confirmed with the Skandha Group sales register. |
| **Base Pricing per Sq. Yard** | Implemented as configurable preview/indicative pricing (default: Rs. 12,500/sq.yd) with transparency disclaimer. Extra charges (Corner Rs. 800/600, East/North Rs. 500) match brochure table. | Current base rate per sq. yard must be reviewed and confirmed by management in the Admin Settings panel. |
| **RERA Registration Claims** | Displays `TS RERA: PO2400009081 @ KADTHAL` as printed on brochure. | Final Telangana RERA online certificate download copy should be verified for extension dates. |
| **WhatsApp Sales Destination** | Default placeholder number `919876543210` configured in server environment. | Admin must configure the designated official sales WhatsApp number in Admin Settings (`/admin/settings`). |
| **Video Hero Background** | High-resolution villa poster fallback (`/assets/hero_cover.jpg`) loaded with smooth overlay. | Admin can add an approved muted video drone fly-through MP4 link in Admin Settings. |

---

&copy; Skandha Group. All official trademarks, layout graphics, and brand marks are property of Skandha Group.
