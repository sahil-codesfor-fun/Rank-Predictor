# Standalone Indian College & Rank Predictor Platform (2027)

A modern, high-performance, responsive web application for forecasting Ranks and College Admissions across major Indian national competitive examinations:
- **JEE Main** (JoSAA & CSAB — NITs, IIITs, GFTIs)
- **JEE Advanced** (JoSAA — 23 IITs)
- **NEET UG** (MCC & State Quota — AIIMS, GMCs, Deemed Medical)
- **CUET UG** (DU CSAS, BHU Portal, Central & State Universities)
- **CLAT UG** (Consortium of NLUs — 26+ National Law Universities)

Designed to be deployed independently on any custom domain (e.g., Vercel, Netlify, Cloudflare Pages, AWS Amplify, Docker).

---

## 🚀 Key Features

1. **Standalone Mathematical Engine (`lib/predictor/engine.ts`)**:
   - **Piecewise Linear Interpolation** across empirical calibration curves from 2023–2025 counseling datasets.
   - Dual-mode rank buffer: **±8%** for NEET UG & JEE Main, **±12%** for JEE Advanced, CUET UG & CLAT UG.
   - **Mouse-Wheel Scroll Protection**: Disabled on all numeric inputs to avoid accidental adjustments (`onWheel`).
   - **Instantaneous Stale Card Reset**: Any modification in scores, mode, reservation, or domicile immediately invalidates stale predictions.

2. **Indian Domicile & Quota Filtering (`lib/predictor/states.ts`)**:
   - Full normalization of all **36 Indian States & Union Territories** (handles common abbreviations like "UP", "MH", "TN", "NCT of Delhi").
   - **Home State (HS)** seats are strictly restricted to candidates whose selected domicile matches the institute's state.
   - **Other State (OS)** seats are strictly provided to out-of-state candidates.
   - **All India (AI)** seats are universally open.

3. **Official Category & Gender Multipliers**:
   - `OPEN`: 1.00x
   - `GEN-EWS`: 1.22x
   - `OBC-NCL`: 1.35x
   - `SC`: 2.10x
   - `ST`: 2.85x
   - `Female-only` Supernumerary Pool: 1.20x
   - `Home State` Relaxation Multiplier: 1.30x

4. **Admission Chance Formula**:
   - $\text{Ratio} = \frac{\text{Candidate Rank}}{\text{Effective Closing Rank } CR_{\text{eff}}}$
   - $\text{Ratio} \le 0.70 \implies$ **Safe Tier** (`HIGH`, 92–99% admission probability)
   - $0.70 < \text{Ratio} \le 1.00 \implies$ **Target Tier** (`MODERATE`, 60–89% admission probability)
   - $1.00 < \text{Ratio} \le 1.20 \implies$ **Dream Tier** (`AMBITIOUS`, 25–59% admission probability)
   - $\text{Ratio} > 1.20 \implies$ **Low Tier** (`LOW`, 2–24% admission probability)

5. **Interactive Counselling & Decision Tools**:
   - **Side-by-Side Comparison Drawer**: Select up to 4 colleges to compare NIRF rankings, tuition fees, average & highest packages, and closing ranks.
   - **Counselling Preference List Builder**: Reorder choices (Up/Down), copy formatted list to clipboard, and export directly as a `.txt` file formatted for JoSAA/MCC choice filling.
   - **Social Sharing**: One-click generation of WhatsApp/Telegram text summaries and direct shareable deep links.
   - **Admin CSV Cutoff Importer (`/admin/import-cutoffs`)**: Bulk upload CSV files to inject or update custom round cutoffs with browser `localStorage` persistence.

6. **SEO & Structured Data**:
   - Pre-rendered dedicated routes:
     - `/` -> Main multi-exam portal
     - `/jee-main-college-predictor` -> Pre-selected JEE Main
     - `/jee-advanced-college-predictor` -> Pre-selected JEE Advanced
     - `/neet-college-predictor` -> Pre-selected NEET UG
     - `/cuet-college-predictor` -> Pre-selected CUET UG
     - `/clat-college-predictor` -> Pre-selected CLAT UG
   - JSON-LD Schema.org structured data (`WebApplication` and `FAQPage`) on every page.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Animations**: Framer Motion

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Production Build
```bash
npm run build
npm start
```

### 4. Run Mathematical Engine Tests
```bash
npx tsc scripts/test-engine.ts --outDir ./dist --module commonjs --target es2020 --moduleResolution node --esModuleInterop
node ./dist/scripts/test-engine.js
```

---

## 🌐 Deploying to a Different Domain

This repository is completely decoupled and self-contained. You can deploy it to any hosting platform under your own domain:

- **Vercel**: Import the repository and click Deploy.
- **Netlify**: Connect repository, build command: `npm run build`, publish directory: `.next`.
- **Cloudflare Pages / AWS / Docker**: Standard Next.js Node.js server deployment.

