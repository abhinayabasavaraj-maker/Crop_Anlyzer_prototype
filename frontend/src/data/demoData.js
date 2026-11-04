/**
 * Crop Analyser — Academic Demonstration Dataset & Hardware Specifications
 * 
 * Multidisciplinary Engineering Project: ECE + CSE
 * Institution: BMS College of Engineering, Bengaluru
 * Technology Readiness Level: TRL 2 (Targeting TRL 3 by August 2027)
 * 
 * NOTE: The optical sensing system uses a SINGLE BPW34 photodiode in a light-sealed chamber
 * with sequential illumination from a 660 nm RED LED and an 850 nm NIR LED.
 * Theoretical Index range is -1.0 to +1.0. All health and stress scores are illustrative 
 * and provisional until calibrated experimentally against laboratory spectrophotometry.
 */

export const PROJECT_METADATA = {
  institution: "BMS College of Engineering, Bengaluru",
  departments: "Electronics & Communication Engineering (ECE) + Computer Science & Engineering (CSE)",
  projectTitle: "Crop Analyser — Handheld Optical Plant Stress Detection System",
  trlCurrent: "TRL 2 (Technology concept and application formulated)",
  trlTarget: "TRL 3 (Experimental proof of concept by August 2027)",
  hardwareBOM: {
    microcontroller: "ESP32 DevKit V1 (Tensilica Xtensa Dual-Core 240MHz, 2.4GHz Wi-Fi)",
    photodetector: "BPW34 Silicon PIN Photodiode (Spectral sensitivity 430 - 1100 nm, 7.5 mm² active area)",
    redEmitter: "High-radiance 660 nm RED LED (Narrow viewing angle, chlorophyll absorption band)",
    nirEmitter: "High-radiance 850 nm NIR LED (Narrow viewing angle, mesophyll scattering band)",
    adcModule: "ADS1115 16-bit Ultra-compact I2C ADC (Programmable Gain Amplifier, 860 SPS)",
    analogFrontEnd: "Precision Transimpedance Amplifier (TIA) with low input bias current",
    opticalChamber: "3D-printed light-sealed leaf chamber with spring-loaded silicone shroud (<0.01 lux ambient leakage)",
    localDisplay: "1.8-inch ST7735 SPI TFT Color Display (128x160 resolution)",
    powerSupply: "18650 Li-ion rechargeable cell (3.7V 2600mAh) + TP4056 Micro-USB/Type-C charging module + 3.3V LDO"
  }
};

export const INITIAL_THRESHOLDS = {
  optimal: 0.45,        // Index >= 0.45 provisional vigorous vegetative canopy
  moderateStress: 0.20, // 0.20 <= Index < 0.45 provisional moderate stress
  severeStress: 0.20,   // Index < 0.20 provisional critical stress / chlorosis
  suddenDropDelta: 0.15 // Flag drop > 0.15 within 24 hours
};

// Illustrative scoring function deriving Health Score (0-100) and Stress Score (0-100)
export const calculateScoresFromIndex = (index) => {
  if (typeof index !== 'number' || isNaN(index)) {
    return { healthScore: 50, stressScore: 50 };
  }
  let healthScore = 50;
  if (index < 0) {
    // Non-vegetative or severely necrotic tissue
    healthScore = Math.max(0, Math.round((index + 1) * 15));
  } else if (index < 0.20) {
    // Severe stress / low chlorophyll reflectance ratio
    healthScore = Math.round(15 + (index / 0.20) * 20);
  } else if (index < 0.45) {
    // Moderate stress / onset of mesophyll compaction
    healthScore = Math.round(35 + ((index - 0.20) / 0.25) * 35);
  } else {
    // Healthy vegetative canopy
    healthScore = Math.min(100, Math.round(70 + ((index - 0.45) / 0.55) * 30));
  }
  const stressScore = Math.max(0, Math.min(100, 100 - healthScore));
  return { healthScore, stressScore };
};

export const INITIAL_EXPERIMENTS = [
  {
    id: "EXP001",
    name: "Controlled Water-Deficit Stress Trial",
    description: "Comparing normal irrigated vs water-stressed Solanum lycopersicum cohorts to benchmark 660nm/850nm reflectance dynamics prior to visible leaf wilting.",
    treatment: "Normal Irrigation (100% ETc) vs Water-Stressed Deprivation (40% ETc)",
    startDate: "2026-10-15",
    endDate: "2026-11-25",
    status: "Active",
    plantIds: ["PLANT001", "PLANT002", "PLANT005"],
    controlGroupPlantIds: ["PLANT001", "PLANT005"],
    stressedGroupPlantIds: ["PLANT002"],
    leadResearcher: "Student Research Team • BMSCE ECE+CSE",
    notes: "Sequential readings taken at 08:00 and 17:00 IST. Optical chamber dark counts recalibrated daily."
  },
  {
    id: "EXP002",
    name: "Nitrogen Gradient in Triticum aestivum",
    description: "Evaluating the relationship between chlorophyll-a absorption at 660 nm and soil nitrogen supply levels.",
    treatment: "Normal N-Control (120 kg N/ha) vs Nitrogen-Deficient (0 kg N/ha)",
    startDate: "2026-10-01",
    endDate: "2026-11-30",
    status: "Active",
    plantIds: ["PLANT003", "PLANT004"],
    controlGroupPlantIds: ["PLANT003"],
    stressedGroupPlantIds: ["PLANT004"],
    leadResearcher: "Dr. K. N. Ramesh, Project Guide • BMSCE",
    notes: "Testing ADS1115 gain setting at 2x (±2.048V range) for improved low-light resolution."
  },
  {
    id: "EXP003",
    name: "Salinity Induced Osmotic Stress in Capsicum",
    description: "Investigating mesophyll cell turgor breakdown via 850 nm reflectance changes under high NaCl salinity root-zone irrigation.",
    treatment: "Normal Potting (0 mM NaCl) vs Saline Stressed (150 mM NaCl)",
    startDate: "2026-10-20",
    endDate: "2026-12-05",
    status: "Active",
    plantIds: ["PLANT006", "PLANT007", "PLANT008"],
    controlGroupPlantIds: ["PLANT006"],
    stressedGroupPlantIds: ["PLANT007", "PLANT008"],
    leadResearcher: "BMSCE Final Year Capstone Team",
    notes: "Correlating index with leaf relative water content (RWC) gravimetric sampling."
  }
];

export const INITIAL_DEVICES = [
  {
    id: "ESP32-DEV-01",
    name: "Handheld Optical Prototype Unit 1",
    hardware: "ESP32 DevKit V1 + BPW34 + ADS1115 (16-bit)",
    firmwareVersion: "v1.2.6-bmsce-opt",
    status: "Online",
    assignedPlantId: "PLANT001",
    location: "BMSCE IoT Lab / Polyhouse Bay 1",
    redLedWavelength: 660,
    nirLedWavelength: 850,
    calibratedDarkCurrentAdc: 128,   // 16-bit ADS1115 dark ADC count
    calibratedWhiteRefAdc: 28450,   // 16-bit BaSO4 standard count
    lastPing: new Date(Date.now() - 30 * 1000).toISOString(),
    signalStrengthDbm: -56,
    batteryVoltageV: 3.92,
    batteryLevelPct: 82,
    displayType: "1.8\" TFT (ST7735)",
    trlLevel: "TRL 2 Prototype"
  },
  {
    id: "ESP32-DEV-02",
    name: "Handheld Optical Prototype Unit 2",
    hardware: "ESP32 DevKit V1 + BPW34 + ADS1115 (16-bit)",
    firmwareVersion: "v1.2.6-bmsce-opt",
    status: "Online",
    assignedPlantId: "PLANT002",
    location: "Agronomy Experimental Bed 2",
    redLedWavelength: 660,
    nirLedWavelength: 850,
    calibratedDarkCurrentAdc: 135,
    calibratedWhiteRefAdc: 28120,
    lastPing: new Date(Date.now() - 75 * 1000).toISOString(),
    signalStrengthDbm: -63,
    batteryVoltageV: 3.84,
    batteryLevelPct: 74,
    displayType: "1.8\" TFT (ST7735)",
    trlLevel: "TRL 2 Prototype"
  },
  {
    id: "ESP32-DEV-03",
    name: "Benchtop Calibration Station",
    hardware: "ESP32 DevKit V1 + BPW34 + ADS1115 (16-bit)",
    firmwareVersion: "v1.1.9-bmsce-opt",
    status: "Standby",
    assignedPlantId: "PLANT003",
    location: "ECE Hardware Testing Bench",
    redLedWavelength: 660,
    nirLedWavelength: 850,
    calibratedDarkCurrentAdc: 120,
    calibratedWhiteRefAdc: 28900,
    lastPing: new Date(Date.now() - 310 * 1000).toISOString(),
    signalStrengthDbm: -70,
    batteryVoltageV: 4.15,
    batteryLevelPct: 98,
    displayType: "1.8\" TFT (ST7735)",
    trlLevel: "TRL 2 Prototype"
  },
  {
    id: "ESP32-DEV-04",
    name: "Field Verification Unit 4",
    hardware: "ESP32 DevKit V1 + BPW34 + ADS1115 (16-bit)",
    firmwareVersion: "v1.0.8-bmsce-opt",
    status: "Offline",
    assignedPlantId: "PLANT008",
    location: "Greenhouse Station C",
    redLedWavelength: 660,
    nirLedWavelength: 850,
    calibratedDarkCurrentAdc: 140,
    calibratedWhiteRefAdc: 27800,
    lastPing: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    signalStrengthDbm: -92,
    batteryVoltageV: 3.25,
    batteryLevelPct: 12,
    displayType: "1.8\" TFT (ST7735)",
    trlLevel: "TRL 2 Prototype"
  }
];

export const INITIAL_PLANTS = [
  {
    id: "PLANT001",
    name: "Tomato Specimen T-101 (Normal Control)",
    species: "Solanum lycopersicum",
    variety: "Arka Rakshak (IIHR)",
    location: "Polyhouse Bench 1",
    plantingDate: "2026-09-18",
    experimentId: "EXP001",
    group: "Normal Control",
    status: "Healthy",
    provisionalIndex: 0.64,
    healthScore: 84,
    stressScore: 16,
    redReflectance: 0.15,
    nirReflectance: 0.68,
    rawRedAdc: 4320,
    rawNirAdc: 19580,
    lastReadingAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    notes: "100% ETc optimal moisture. Full turgor, robust chlorophyll absorbance."
  },
  {
    id: "PLANT002",
    name: "Tomato Specimen T-102 (Water-Stressed)",
    species: "Solanum lycopersicum",
    variety: "Arka Rakshak (IIHR)",
    location: "Polyhouse Bench 1",
    plantingDate: "2026-09-18",
    experimentId: "EXP001",
    group: "Water-Stressed",
    status: "Moderate Stress",
    provisionalIndex: 0.31,
    healthScore: 50,
    stressScore: 50,
    redReflectance: 0.32,
    nirReflectance: 0.61,
    rawRedAdc: 9180,
    rawNirAdc: 17420,
    lastReadingAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    notes: "Water withholding Day 5. Mesophyll scattering dropping, RED absorption weakening."
  },
  {
    id: "PLANT003",
    name: "Wheat Specimen W-201 (Normal N-Fed)",
    species: "Triticum aestivum",
    variety: "HD-2967",
    location: "Agronomy Tray 2",
    plantingDate: "2026-10-02",
    experimentId: "EXP002",
    group: "Normal Control",
    status: "Healthy",
    provisionalIndex: 0.58,
    healthScore: 78,
    stressScore: 22,
    redReflectance: 0.18,
    nirReflectance: 0.68,
    rawRedAdc: 5210,
    rawNirAdc: 19410,
    lastReadingAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    notes: "120 kg N/ha standard fertilizer. Dark green leaves, high chlorophyll density."
  },
  {
    id: "PLANT004",
    name: "Wheat Specimen W-202 (N-Deficient)",
    species: "Triticum aestivum",
    variety: "HD-2967",
    location: "Agronomy Tray 2",
    plantingDate: "2026-10-02",
    experimentId: "EXP002",
    group: "Stressed Group",
    status: "Severe Stress",
    provisionalIndex: 0.12,
    healthScore: 27,
    stressScore: 73,
    redReflectance: 0.44,
    nirReflectance: 0.56,
    rawRedAdc: 12620,
    rawNirAdc: 15980,
    lastReadingAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    notes: "Zero nitrogen treatment. Chlorosis evident on lower leaf tips; RED reflectance elevated."
  },
  {
    id: "PLANT005",
    name: "Tomato Specimen T-103 (Re-watered Recovery)",
    species: "Solanum lycopersicum",
    variety: "Arka Rakshak (IIHR)",
    location: "Polyhouse Bench 1",
    plantingDate: "2026-09-18",
    experimentId: "EXP001",
    group: "Normal Control",
    status: "Healthy",
    provisionalIndex: 0.54,
    healthScore: 74,
    stressScore: 26,
    redReflectance: 0.21,
    nirReflectance: 0.70,
    rawRedAdc: 6020,
    rawNirAdc: 20120,
    lastReadingAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    notes: "Re-irrigated post 3-day stress; optical index showing upward physiological recovery."
  },
  {
    id: "PLANT006",
    name: "Bell Pepper Specimen P-301 (Control)",
    species: "Capsicum annuum",
    variety: "California Wonder",
    location: "Hydroponic Channel A",
    plantingDate: "2026-09-25",
    experimentId: "EXP003",
    group: "Normal Control",
    status: "Healthy",
    provisionalIndex: 0.67,
    healthScore: 88,
    stressScore: 12,
    redReflectance: 0.14,
    nirReflectance: 0.71,
    rawRedAdc: 4010,
    rawNirAdc: 20380,
    lastReadingAt: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
    notes: "0 mM NaCl control group. Excellent leaf expansion and vigorous mesophyll."
  },
  {
    id: "PLANT007",
    name: "Bell Pepper Specimen P-302 (Moderate Saline)",
    species: "Capsicum annuum",
    variety: "California Wonder",
    location: "Hydroponic Channel A",
    plantingDate: "2026-09-25",
    experimentId: "EXP003",
    group: "Stressed Group",
    status: "Moderate Stress",
    provisionalIndex: 0.36,
    healthScore: 57,
    stressScore: 43,
    redReflectance: 0.29,
    nirReflectance: 0.62,
    rawRedAdc: 8320,
    rawNirAdc: 17750,
    lastReadingAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    notes: "75 mM NaCl treatment. Initial osmotic shock; leaf turgor moderately depressed."
  },
  {
    id: "PLANT008",
    name: "Bell Pepper Specimen P-303 (Severe Saline)",
    species: "Capsicum annuum",
    variety: "California Wonder",
    location: "Hydroponic Channel A",
    plantingDate: "2026-09-25",
    experimentId: "EXP003",
    group: "Stressed Group",
    status: "Severe Stress",
    provisionalIndex: 0.08,
    healthScore: 23,
    stressScore: 77,
    redReflectance: 0.48,
    nirReflectance: 0.56,
    rawRedAdc: 13740,
    rawNirAdc: 16040,
    lastReadingAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    notes: "150 mM NaCl treatment. Severe salt toxicity, necrotic margin lesions."
  }
];

export const INITIAL_ALERTS = [
  {
    id: "ALT001",
    severity: "Critical",
    type: "threshold_breach",
    plantId: "PLANT004",
    plantName: "Wheat Specimen W-202 (N-Deficient)",
    deviceId: "ESP32-DEV-02",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    description: "NDVI-like index fell to 0.12 (Health Score: 27/100). High RED reflectance suggests acute chlorophyll degradation.",
    isResolved: false,
    calibrationNote: "Provisional threshold; verify with SPAD meter or lab chlorophyll assay."
  },
  {
    id: "ALT002",
    severity: "Warning",
    type: "sudden_drop",
    plantId: "PLANT002",
    plantName: "Tomato Specimen T-102 (Water-Stressed)",
    deviceId: "ESP32-DEV-01",
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    description: "Provisional index dropped 0.19 within 24h (from 0.50 to 0.31). Health score decreased to 50/100.",
    isResolved: false,
    calibrationNote: "Directly matches Day 5 moisture deficit deprivation protocol."
  },
  {
    id: "ALT003",
    severity: "Critical",
    type: "device_offline",
    plantId: "PLANT008",
    plantName: "Bell Pepper Specimen P-303 (Severe Saline)",
    deviceId: "ESP32-DEV-04",
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    description: "Device ESP32-DEV-04 heartbeat lost. Last communication exceeded 36 hours. Check 18650 battery level.",
    isResolved: false,
    calibrationNote: "Hardware telemetry warning: Check TP4056 charging connection."
  },
  {
    id: "ALT004",
    severity: "Info",
    type: "calibration_reminder",
    plantId: "PLANT001",
    plantName: "Tomato Specimen T-101 (Normal Control)",
    deviceId: "ESP32-DEV-01",
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    description: "Scheduled chamber optical recalibration due: Verify 16-bit ADS1115 dark ADC counts and 99% BaSO4 standard.",
    isResolved: true,
    calibrationNote: "Recalibration logged by student researcher on 2026-11-03."
  }
];

// Curated Agricultural Knowledge Base for Treatment Assistance Module
export const TREATMENT_KNOWLEDGE_BASE = [
  {
    crop: "Tomato (Solanum lycopersicum)",
    stressType: "Water Deficit Stress (Drought)",
    symptoms: "Elevated RED reflectance (0.30 - 0.45) with depressed NIR reflectance (0.50 - 0.65). Early loss of leaf turgor, leaf curling before permanent wilting.",
    causes: "Inadequate soil moisture, high vapor pressure deficit (VPD), shallow root depth in containerized beds.",
    irrigationGuidance: "Adopt deficit irrigation scheduling based on crop evapotranspiration (ETc). Irrigate in early morning to minimize evaporation loss. Maintain soil moisture tension between -25 to -35 kPa.",
    nutrientGuidance: "Avoid excessive synthetic nitrogen during moisture stress; apply mild potassium foliar spray (K2SO4 at 0.5%) to assist stomatal regulation and osmotic turgor.",
    preventivePractices: "Apply organic straw/biodegradable mulch (5-8 cm layer) to conserve soil moisture. Improve soil organic matter to enhance water retention capacity.",
    sources: "ICAR-IIHR Tomato Cultivation Manual; FAO Irrigation & Drainage Paper No. 56."
  },
  {
    crop: "Wheat (Triticum aestivum)",
    stressType: "Nitrogen Chlorosis / Nutrient Stress",
    symptoms: "Significant RED reflectance rise (>0.40) due to chlorophyll loss. Uniform pale green to yellow leaves beginning with older lower foliage.",
    causes: "Insufficient available soil nitrate (NO3-), leaching following heavy precipitation, or waterlogging restricting root respiration.",
    irrigationGuidance: "Avoid over-irrigation that leaches mobile nitrate below root zone. Ensure good drainage in heavy clay soils.",
    nutrientGuidance: "Split-apply urea (nitrogen) based on crop growth stages (crown root initiation, tillering, jointing). Foliar spray of 1-2% urea solution for rapid chlorosis mitigation.",
    preventivePractices: "Soil testing prior to sowing. Integrate green manure crops (e.g. Sesbania) or neem-coated urea to slow nitrification and leaching.",
    sources: "ICAR-Indian Institute of Wheat and Barley Research (IIWBR); CIMMYT Wheat Agronomy Series."
  },
  {
    crop: "Bell Pepper / Chilli (Capsicum annuum)",
    stressType: "Salinity & Osmotic Stress",
    symptoms: "Index dropping below 0.20, low NIR reflectance indicating spongy mesophyll cell collapse. Marginal leaf chlorosis and tip burn.",
    causes: "High electrical conductivity (EC > 2.5 dS/m) in irrigation water or fertigation solution, accumulation of Na+ and Cl- ions in substrate.",
    irrigationGuidance: "Apply a leaching fraction (15-20% extra volume) of clean low-salinity water to flush excess salts from the active root zone.",
    nutrientGuidance: "Supplement with calcium nitrate to counteract sodium toxicity and preserve cell membrane integrity. Avoid chloride-based fertilizers.",
    preventivePractices: "Regularly monitor leachate electrical conductivity (EC). Use raised beds with drip irrigation to maintain a localized low-salt wet bulb around roots.",
    sources: "ICAR-IIHR Vegetable Production Guidelines; University of California IPM Pepper Pest & Disorder Management."
  },
  {
    crop: "General Solanaceous Crops",
    stressType: "Fungal Folier Pathogen Risk (Blight / Rust)",
    symptoms: "Localised necrotic lesions, irregular reflectance variance, severe index drop in infected quadrants.",
    causes: "Prolonged leaf wetness (>6 hours), high relative humidity (>85%), splashing irrigation spreading fungal spores.",
    irrigationGuidance: "Switch from overhead sprinklers to drip irrigation to avoid wetting foliage. Irrigate during morning so leaves dry quickly.",
    nutrientGuidance: "Balance nitrogen with adequate potassium and silica to fortify epidermal cell walls against fungal appressoria penetration.",
    preventivePractices: "Prune lower senescent leaves for adequate airflow. Practice 3-year crop rotation with non-solanaceous species.",
    sources: "BMSCE AgTech Agronomic Review; ICAR Plant Pathology Bulletin."
  }
];

// Curated AI Disease Screening reference scenarios (For simulated inference preview)
export const AI_DISEASE_PRESETS = [
  {
    id: "DIS001",
    plantSpecies: "Solanum lycopersicum",
    leafImageName: "tomato_early_blight_sample.jpg",
    predictedCondition: "Tomato Early Blight",
    pathogen: "Alternaria solani (Fungal Pathogen)",
    confidence: 0.94,
    isInconclusive: false,
    symptoms: "Concentric 'target board' dark brown lesions on older leaves, surrounded by a prominent chlorotic yellow halo.",
    recommendedInspection: "Inspect lower foliage touching the soil; check stem bases for dark sunken lesions. Verify with optical reflectance drop in affected leaf quadrants.",
    severityLevel: "High Risk"
  },
  {
    id: "DIS002",
    plantSpecies: "Solanum lycopersicum",
    leafImageName: "tomato_healthy_sample.jpg",
    predictedCondition: "Healthy Leaf Canopy",
    pathogen: "None (Physiologically Normal)",
    confidence: 0.96,
    isInconclusive: false,
    symptoms: "Uniform deep green leaf lamina, crisp margins, robust turgor, no visible chlorosis or necrotic spotting.",
    recommendedInspection: "Routine monitoring. Maintain scheduled fertigation and optical sensing chamber checks.",
    severityLevel: "Healthy"
  },
  {
    id: "DIS003",
    plantSpecies: "Triticum aestivum",
    leafImageName: "wheat_leaf_rust_sample.jpg",
    predictedCondition: "Wheat Leaf Rust (Brown Rust)",
    pathogen: "Puccinia triticina",
    confidence: 0.89,
    isInconclusive: false,
    symptoms: "Small, circular to oval, reddish-orange pustules scattered randomly across the upper leaf surface.",
    recommendedInspection: "Gently rub pustules with a white tissue to check for orange spore rub-off. Inspect flag leaves promptly.",
    severityLevel: "High Risk"
  },
  {
    id: "DIS004",
    plantSpecies: "Capsicum annuum",
    leafImageName: "pepper_bacterial_spot_sample.jpg",
    predictedCondition: "Bacterial Leaf Spot",
    pathogen: "Xanthomonas campestris pv. vesicatoria",
    confidence: 0.86,
    isInconclusive: false,
    symptoms: "Small, water-soaked, angular spots on leaves turning brown with greasy margins; eventual leaf drop.",
    recommendedInspection: "Check undersides of leaves under 10x hand lens for water-soaking; confirm whether lesions are confined by small leaf veins.",
    severityLevel: "Moderate Risk"
  },
  {
    id: "DIS005",
    plantSpecies: "Solanum lycopersicum",
    leafImageName: "tomato_uncertain_sample.jpg",
    predictedCondition: "Inconclusive / Mixed Symptoms",
    pathogen: "Uncertain (Confidence below 70% threshold)",
    confidence: 0.52,
    isInconclusive: true,
    symptoms: "Minor non-specific leaf tip discoloration with mixed shadow artifacts. Cannot distinguish between early nutrient deficiency and mechanical leaf damage.",
    recommendedInspection: "Take a clearer photograph in diffused indirect natural light without glare. Cross-examine with optical RED/NIR sensor index before taking agronomic action.",
    severityLevel: "Uncertain"
  }
];

// Generate 7-day realistic reading time series for plants with 16-bit ADC counts and health scores
export const generateHistoricalReadings = () => {
  const readings = [];
  const now = Date.now();
  const plants = [
    { id: "PLANT001", baseRed: 0.15, baseNir: 0.70, trend: "stable", group: "Normal Control" },
    { id: "PLANT002", baseRed: 0.20, baseNir: 0.68, trend: "declining", group: "Water-Stressed" },
    { id: "PLANT003", baseRed: 0.18, baseNir: 0.72, trend: "improving", group: "Normal Control" },
    { id: "PLANT004", baseRed: 0.28, baseNir: 0.62, trend: "severely_declining", group: "Stressed Group" },
    { id: "PLANT006", baseRed: 0.14, baseNir: 0.73, trend: "stable", group: "Normal Control" }
  ];

  // 14 time points across past 7 days (every 12 hours)
  for (let i = 13; i >= 0; i--) {
    const timestamp = new Date(now - i * 12 * 3600 * 1000);
    const dayRatio = (13 - i) / 13;

    plants.forEach(plant => {
      let redNoise = (Math.random() - 0.5) * 0.015;
      let nirNoise = (Math.random() - 0.5) * 0.02;
      let red = plant.baseRed;
      let nir = plant.baseNir;

      if (plant.trend === "declining") {
        red += dayRatio * 0.14;
        nir -= dayRatio * 0.10;
      } else if (plant.trend === "severely_declining") {
        red += dayRatio * 0.18;
        nir -= dayRatio * 0.16;
      } else if (plant.trend === "improving") {
        red -= dayRatio * 0.03;
        nir += dayRatio * 0.05;
      }

      red = Math.max(0.05, Math.min(0.95, red + redNoise));
      nir = Math.max(0.05, Math.min(0.95, nir + nirNoise));

      const denominator = nir + red;
      const index = denominator > 0 ? (nir - red) / denominator : 0;
      const { healthScore, stressScore } = calculateScoresFromIndex(index);

      // Simulate 16-bit ADS1115 ADC counts from BPW34 photodiode
      const rawRedAdc = Math.round(128 + red * 28000);
      const rawNirAdc = Math.round(128 + nir * 28000);

      readings.push({
        _id: `hist_${plant.id}_${i}`,
        plantId: plant.id,
        experimentId: plant.id === "PLANT003" || plant.id === "PLANT004" ? "EXP002" : "EXP001",
        deviceId: plant.id === "PLANT001" ? "ESP32-DEV-01" : "ESP32-DEV-02",
        redReflectance: parseFloat(red.toFixed(4)),
        nirReflectance: parseFloat(nir.toFixed(4)),
        index: parseFloat(index.toFixed(4)),
        plantHealthScore: healthScore,
        plantStressScore: stressScore,
        rawRedAdc,
        rawNirAdc,
        source: "simulated",
        createdAt: timestamp.toISOString()
      });
    });
  }

  return readings;
};
