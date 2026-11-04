# Crop Analyser — Intelligent Plant Stress Detection and Monitoring System
### IoT-Assisted Agricultural Sensing Platform (ESP32 • 660 nm RED • 850 nm NIR)

---

## 🌿 Project Overview
**Crop Analyser** is a full-stack IoT plant phenotyping prototype designed to detect early indicators of vegetative stress before irreversible leaf wilting occurs. 

The system models an enclosed, light-sealed optical chamber alternating between **RED LED (660 nm)** and **Near-Infrared (NIR) LED (850 nm)** illumination, capturing reflected radiant flux via a calibrated silicon photodetector node.

### 📐 Optical Reflectance Formulation
$$\text{Provisional Optical Index} = \frac{\text{NIR Reflectance} - \text{RED Reflectance}}{\text{NIR Reflectance} + \text{RED Reflectance}}$$

- **RED Band (~660 nm)**: Corresponds to strong chlorophyll $a$ & $b$ photosynthetic absorption. Healthy leaves exhibit low reflectance ($0.12 - 0.25$).
- **NIR Band (~850 nm)**: Corresponds to light scattering within spongy mesophyll intercellular air spaces. Healthy turgid leaves exhibit high reflectance ($0.65 - 0.85$).
- **Stress Response**: As water deficit or chlorosis sets in, mesophyll cells collapse and chlorophyll degrades, driving RED reflectance higher and NIR reflectance lower.

---

## 🔬 Scientific & Calibration Constraints
1. **Provisional Indexing**: All plant-health classifications (Optimal, Moderate Stress, Severe Stress) are provisional indicators until calibrated against laboratory spectrophotometry and destructive biomass sampling.
2. **Normalized Reflectance**: Calibrated values are bounded strictly in $[0.00, 1.00]$. Raw 12-bit ESP32 ADC counts are normalized against dark current ($0\%$ light) and barium sulfate ($99\%$ white standard) reference counts.
3. **Division by Zero Protection**: If both reflectance readings are zero ($\text{NIR} + \text{RED} = 0$), index calculation is prevented and rejected by the API.
4. **Data Origin Provenance**: The system explicitly marks and tracks the data origin (`simulated` vs. `esp32`).

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide React, Axios
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), REST APIs
- **Hardware Integration**: ESP32 Microcontroller, Dual-wavelength optical emitters, Photodetector

---

## 🚀 Running the Platform

### 1. Backend Server (Express.js)
```powershell
cd server
npm install
node server.js
```
- **Port**: `http://localhost:5000`
- **Health Check**: `GET http://localhost:5000/api/health`
- **Readings Endpoint**: `POST http://localhost:5000/api/readings`
- **Query Readings**: `GET http://localhost:5000/api/readings`

### 2. Frontend Dashboard (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```
- **Port**: `http://localhost:5173`

---

## 📡 REST API Contract

### Submit Optical Sensor Reading
`POST /api/readings`
```json
{
  "plantId": "PLANT001",
  "experimentId": "EXP001",
  "deviceId": "ESP32001",
  "redReflectance": 0.22,
  "nirReflectance": 0.74,
  "source": "simulated"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sensor reading saved successfully",
  "data": {
    "_id": "...",
    "plantId": "PLANT001",
    "experimentId": "EXP001",
    "deviceId": "ESP32001",
    "redReflectance": 0.22,
    "nirReflectance": 0.74,
    "index": 0.5417,
    "source": "simulated",
    "createdAt": "2026-11-03T18:00:00.000Z"
  }
}
```

---

## 🖥️ Platform Navigation Modules
1. **Overview Dashboard**: KPI cards, provisional health distribution, plant trajectory timeline, dual-spectral trends, ESP32 device status, and live activity stream.
2. **Live Monitoring**: Enclosed optical sensing chamber animation (alternating RED 660nm & NIR 850nm pulses), live packet counter, real-time Recharts stream, and Manual Sensor Reading Trigger modal.
3. **Plant Management**: Full inventory CRUD (add, edit, delete, inspect drawer) with species, variety, facility location, and historical mini-chart.
4. **Experiment Management**: Research trial CRUD, treatment condition tracking (drought, nitrogen gradient, salinity), cross-experiment comparative treatment bar charts.
5. **Sensor Analytics**: Multi-plant overlay charts, RED vs NIR dynamic scatter trends, date range filters, statistical summaries (mean, min, max).
6. **Stress Alerts**: Critical, Warning, and Advisory notifications triggered by threshold breaches and sudden index decreases ($>15\%$ drop), with resolution tracking.
7. **Device Management**: ESP32 hardware chamber cards, 12-bit ADC calibration offset diagnostics (dark current, white reference, LED drive mA, supply voltage, WiFi RSSI).
8. **Reports & Export**: Dynamic CSV file generator (instant browser download via Blob) and printable formal assessment reports with scientific disclosures.
9. **System Settings**: Configurable provisional threshold sliders, researcher profile management, and live backend ping diagnostics.
