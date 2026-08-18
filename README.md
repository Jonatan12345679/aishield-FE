# Aegis AI — Frontend

Frontend untuk Aegis AI, platform AI yang punya 2 modul:
- AIShield — dashboard deteksi anomali jaringan pakai Isolation Forest
- BlurAI — scanner privasi gambar pakai YOLO

Ini repo frontend-nya aja. Backend ada di repo terpisah (`aishield-backend`).

---

## 🖥️ Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4 (native v4, bukan legacy config)
- React Router DOM v7
- PxlKit — design system pixel-art (@pxlkit/ui-kit, @pxlkit/effects, dll)
- Recharts — chart (AnomalyChart, RiskGauge)
- Lucide React — icon set
- clsx + tailwind-merge — utility class helper

---

## 📦 Struktur Project
```
aishield-frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ icon.png
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ img
│  │  │  ├─ icon.png
│  │  │  ├─ module-aishield.png
│  │  │  └─ module-blurai.png
│  │  ├─ react.svg
│  │  ├─ styles
│  │  │  ├─ AiShieldPage.css
│  │  │  ├─ AlertBanner.css
│  │  │  ├─ AlertToast.css
│  │  │  ├─ AnomalyChart.css
│  │  │  ├─ BlurAiPage.css
│  │  │  ├─ ExplainPanel.css
│  │  │  ├─ Header.css
│  │  │  ├─ LandingPage.css
│  │  │  ├─ LogStream.css
│  │  │  ├─ ModelCard.css
│  │  │  ├─ NotFoundPage.css
│  │  │  ├─ RealtimeDetectionPage.css
│  │  │  ├─ RiskGauge.css
│  │  │  ├─ SimulationPanel.css
│  │  │  ├─ StatCard.css
│  │  │  ├─ ThreatTimeline.css
│  │  │  └─ TopAttackers.css
│  │  └─ vite.svg
│  ├─ components
│  │  ├─ alerts
│  │  │  ├─ AlertBanner.jsx
│  │  │  └─ AlertToast.jsx
│  │  ├─ dashboard
│  │  │  ├─ AnomalyChart.jsx
│  │  │  ├─ ExplainPanel.jsx
│  │  │  ├─ LogStream.jsx
│  │  │  ├─ ModelCard.jsx
│  │  │  ├─ RiskGauge.jsx
│  │  │  ├─ SimulationPanel.jsx
│  │  │  ├─ StatCards.jsx
│  │  │  ├─ ThreatTimeline.jsx
│  │  │  └─ TopAttackers.jsx
│  │  ├─ layout
│  │  │  ├─ Header.jsx
│  │  │  └─ soundToggle.jsx
│  │  └─ LoadingScreen.jsx
│  ├─ hooks
│  │  └─ useWebSocket.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ AiShieldPage.jsx
│  │  ├─ BlurAiPage.jsx
│  │  ├─ LandingPage.jsx
│  │  ├─ NotFoundPage.jsx
│  │  └─ RealtimeDetectionPage.jsx
│  └─ services
│     ├─ aiShieldApi.js
│     ├─ apiClient.js
│     ├─ blurAiApi.js
│     └─ retroSound.js
└─ vite.config.js

```

---

## ✨ Fitur AIShield (yang kita fokuskan di sini)

- Live Risk Gauge — skor risiko sistem realtime (safe / watch / elevated / critical)
- StatCards — angka ringkasan (total events, anomaly rate, risk distribution, attack types)
- AnomalyChart — breakdown serangan per tipe (port scan, brute force, DDoS, exfiltration)
- LogStream — live feed event dengan WebSocket streaming, klik row untuk penjelasan AI
- Explainable AI — z-score per fitur vs baseline traffic normal
- Top Attackers + IP Blocklist — leaderboard attacker & button block/unblock
- ThreatTimeline — historis anomali, auto-refresh via polling + WS
- SimulationPanel — trigger simulasi 5 jenis traffic (normal + 4 attack types)
- Alert System — banner + toast, juga real-time lintas-tab via WebSocket
- Model Card — transparansi model (F1, recall per attack type, confusion matrix)
- Export Report — download CSV laporan insiden
- Retro Sound Alerts — beep 8-bit ala game jadul (toggle mute di header)

---

## ✨ Fitur BlurAI (dikerjakan di modul terpisah)

- Upload gambar (PNG / JPG / JPEG)
- Deteksi data sensitif: KTP, QR Code, Plat Nomor, Struk
- Auto-blur region yang terdeteksi
- Download gambar yang sudah di-blur
- RealTime Detection dengan live camera

---

## 🚀 Cara Jalankan

### 1. Install dependencies

```bash
npm install

### 2. Setup environment
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/api/v1

### 3. Run dev server
```bash
npm run dev

### 4. Build production
```bash
npm run build
npm run preview

🤝 Tim
Aegis AI Team
