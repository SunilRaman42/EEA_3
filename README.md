# Sub-Saharan Africa EdTech Landscape Review — Interactive Dashboard & Pipeline

Interactive visualization and triangulation engine for the **Sub-Saharan Africa EdTech Landscape Review**, carried out under the **Global EdTech Alliance of Alliances** (incubated within UNESCO's Global Education Coalition).

---

## 🎯 Architecture Overview

The system is organized into three decoupled layers:

```
EEA_3/
├── data/
│   ├── raw/
│   │   └── SSA_Survey_Responses_Mock.xlsx   <- Raw Excel survey responses (Teachers, Providers, Experts)
│   └── processed/
│       └── survey_data.json                  <- Standardized, cleaned JSON data payload
├── scripts/
│   ├── generate_synthetic_data.py            <- Generates realistic mock responses across 48 SSA countries
│   └── process_survey_data.py               <- Reusable ingestion & aggregation pipeline (.xlsx -> .json)
├── dashboard/                                <- Embeddable React + Vite + Tailwind CSS web dashboard
│   ├── public/data/survey_data.json
│   ├── src/
│   │   ├── components/Tabs/                 <- Overview, Triangulation Radar, Teachers, Providers, Experts, Explorer
│   │   ├── components/EmbedModal.jsx        <- Responsive <iframe> code generator with live preview
│   │   └── App.jsx                          <- Filter state & embed parameter handler (?embed=true)
│   └── vite.config.js                       <- Configured with relative base ('./') for GitHub Pages
└── .github/workflows/deploy.yml             <- Automated GitHub Pages CI/CD workflow
```

---

## 🔬 The Triangulation Engine

Unlike single-audience dashboards, this tool surfaces the systemic gaps between three distinct vantage points:
1. **Teacher Voice (600 responses)**: Realities of classroom power cuts, connectivity costs, student device access, workload impact, and child safeguarding protocols.
2. **EdTech Providers (120 ventures)**: Product types, offline capabilities, monetization (B2C/B2B/B2G), and public procurement breakdown points.
3. **Expert Consultation (80 specialists)**: System governance, donor project survival ("pilotitis" fallout), realistic evidence thresholds, and equity blind spots.

---

## 🚀 Quick Start & Local Preview

### 1. Install & Run the Dashboard Locally
```bash
# From the workspace root:
npm install --prefix dashboard
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Ingest New Survey Responses (`.xlsx`)
When new survey data arrives from KoboToolbox, Qualtrics, or Google Forms:
1. Place the spreadsheet in `data/raw/` (e.g. `data/raw/SSA_Survey_Responses_Mock.xlsx` with sheets `Teachers`, `Providers`, `Experts`).
2. Run the processing pipeline:
```bash
python3 scripts/process_survey_data.py --input data/raw/SSA_Survey_Responses_Mock.xlsx
```
3. Re-build or run `npm run dev` to see the updated figures immediately.

### 3. Generate Fresh Synthetic / Mock Data
To regenerate mock responses with missing data quirks and realistic geographic distribution:
```bash
python3 scripts/generate_synthetic_data.py
python3 scripts/process_survey_data.py
```

---

## 🌐 Deploying to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. In your GitHub repository settings, go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push your changes to `main` (or run **Actions > Deploy Dashboard to GitHub Pages > Run workflow**).
4. Your dashboard will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 🧩 Embedding into External Websites

The dashboard is engineered to be embedded seamlessly into external portals (e.g., UNESCO hubs, ministerial sites, Notion, Webflow, WordPress).

### Basic Responsive Embed Snippet:
```html
<iframe 
  src="https://<your-username>.github.io/<repo-name>/?embed=true&hideHeader=true" 
  width="100%" 
  height="800px" 
  frameborder="0" 
  style="border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; min-height: 800px;"
  title="Sub-Saharan Africa EdTech Landscape Review Dashboard"
  loading="lazy"
></iframe>
```

### URL Parameter Customization:
* `embed=true`: Activates compact embed layout.
* `hideHeader=true`: Strips top navigation banner for seamless host-page integration.
* `tab=triangulation`: Directly opens a specific tab (`overview`, `triangulation`, `teachers`, `providers`, `experts`, `explorer`).
* `bloc=Francophone`: Pre-filters data to a specific linguistic bloc (`Anglophone`, `Francophone`, `Lusophone`).

---

## 📄 License & Attribution
Carried out under the **Global EdTech Alliance of Alliances**, incubated within UNESCO's Global Education Coalition.
Licensed under the [MIT License](LICENSE).
