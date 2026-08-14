# AIShield Frontend

AIShield Frontend is a cyber-security themed web application built with React, Vite, Tailwind CSS, and PxlKit UI components.

The application consists of two main AI-powered modules:

1. **AIShield** – Network Anomaly & Cyber Threat Detection Dashboard powered by Isolation Forest.
2. **BlurAI** – Privacy Protection Scanner powered by YOLO Computer Vision for detecting and blurring sensitive information.

---

# Main Theme

AIShield follows a futuristic cyber-security and retro pixel aesthetic.

### Design Characteristics

- Cyberpunk-inspired UI
- Pixel-art dashboard elements
- Terminal-style interface
- Neon cyan, green, purple, and red accents
- Security Operations Center (SOC) style monitoring experience
- Real-time threat visualization
- Gamified security monitoring

---

# Technology Stack

## Frontend Framework

- React 19
- Vite

## Routing

- React Router DOM

## Styling

- Tailwind CSS v4
- Custom CSS Modules
- PxlKit Design System

## UI Libraries

- @pxlkit/ui-kit
- @pxlkit/core
- @pxlkit/ui
- @pxlkit/effects
- @pxlkit/feedback
- @pxlkit/gamification
- @pxlkit/parallax
- @pxlkit/social
- @pxlkit/weather

## Icons

- Lucide React

## Charts

- Recharts

## Utilities

- clsx
- tailwind-merge

---

# Project Structure

```text
src/
│
├── api/
│   └── privacyApi.js
│
├── assets/
│   ├── img/
│   │   ├── icon.png
│   │   ├── module-aishield.png
│   │   └── module-blurai.png
│   │
│   └── styles/
│       ├── LandingPage.css
│       └── BlurAiPage.css
│
├── components/
│   │
│   ├── alerts/
│   │   ├── AlertBanner.jsx
│   │   └── AlertToast.jsx
│   │
│   ├── dashboard/
│   │   ├── AnomalyChart.jsx
│   │   ├── LogStream.jsx
│   │   ├── RiskGauge.jsx
│   │   ├── SimulationPanel.jsx
│   │   ├── StatCards.jsx
│   │   └── ThreatTimeline.jsx
│   │
│   ├── layout/
│   │   └── Header.jsx
│   │
│   └── LoadingScreen.jsx
│
├── pages/
│   ├── LandingPage.jsx
│   ├── AiShieldPage.jsx
│   ├── BlurAiPage.jsx
│   └── NotFoundPage.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# Application Pages

## Landing Page

Route:

```text
/
```

Purpose:

Central hub for selecting AI modules.

Features:

- Pixel-themed hero section
- Animated cyber background
- AIShield module card
- BlurAI module card
- Module navigation

Available Modules:

### AIShield

Network anomaly and cyber threat detection.

### BlurAI

Privacy-sensitive image detection and protection.

---

## AIShield Dashboard

Route:

```text
/aishield
```

Purpose:

Cyber Security Operations Center dashboard.

Features:

### Risk Gauge

Displays current system risk level.

### Statistics Cards

Shows:

- Total logs
- Normal activities
- Threat count
- Response time

### Threat Timeline

Displays security events chronologically.

### Anomaly Chart

Visualizes anomaly detection activity.

### Log Stream

Live security activity feed.

### Simulation Panel

Allows demonstration of:

- Normal activity
- Threat activity
- Anomaly scenarios

### Alert System

Includes:

- Alert Banner
- Toast Notifications

---

## BlurAI Privacy Scanner

Route:

```text
/blurai
```

Purpose:

Detect and protect sensitive information in images.

Powered by:

- YOLO Object Detection
- Privacy Detection API

Features:

### Upload Image

Supported:

- PNG
- JPG
- JPEG

### Detect Sensitive Data

Supported Classes:

- KTP
- QR Code
- Vehicle License Plate
- Receipt

### Privacy Analysis HUD

Displays:

- Detection count
- Average confidence
- Processing progress
- Detection classes

### Blur Protection

Automatically blurs detected sensitive regions.

### Download Protected Image

Export processed image after privacy protection.

### Visual Components

Uses:

- PixelButton
- PixelBadge
- PixelAlert
- PixelDivider
- PixelSkeleton
- PixelToast

---

## Not Found Page

Route:

```text
*
```

Purpose:

Handles unknown routes and invalid URLs.

---

# API Integration

## Privacy Detection API

Location:

```text
src/api/privacyApi.js
```

Endpoints:

### Scan Image

```http
POST /scan
```

Response:

```json
{
  "success": true,
  "message": "Privacy detection completed",
  "detections": [],
  "image": "base64..."
}
```

### Blur Image

```http
POST /blur
```

Response:

```json
{
  "success": true,
  "message": "Privacy blur completed",
  "image": "base64..."
}
```

---

# Environment Variables

Create:

```text
.env
```

Example:

```env
VITE_BACKEND_BASE_URL=http://localhost:8000
```

---

# Installation

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

# AI Modules

## Module 01 — AIShield

Machine Learning based anomaly detection dashboard.

Core Concept:

- Isolation Forest
- Network Monitoring
- Threat Detection
- Security Analytics

---

## Module 02 — BlurAI

Computer Vision privacy protection engine.

Core Concept:

- YOLO Detection
- PII Detection
- Image Redaction
- Privacy Protection

---

# Authors

AIShield Team

Built for Cyber Security & Artificial Intelligence Demonstration Platform.