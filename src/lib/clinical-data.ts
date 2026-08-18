// SYNTHETIC demonstration data only. No real patient information.

export type Sex = "male" | "female";

export type Patient = {
  id: string;
  code: string;
  displayName: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  condition: string;
  knownConditions: string[];
  allergies: string[];
  currentMedications: string[];
  previousTreatment: string;
  previousResponse: "good" | "partial" | "poor" | "unknown";
  facilityId: string;
  location: string;
  createdAt: string;
  clinical: ClinicalRecord;
  history: ClinicalRecord[];
};

export type ClinicalRecord = {
  recordDate: string;
  glucoseFasting: number;
  hba1c: number;
  systolic: number;
  diastolic: number;
  durationYears: number;
  egfr: number;
};

export const bmi = (p: { heightCm: number; weightKg: number }) =>
  p.weightKg / Math.pow(p.heightCm / 100, 2);

export const patients: Patient[] = [
  {
    id: "P001",
    code: "P001",
    displayName: "Demo Patient P001",
    age: 52,
    sex: "male",
    heightCm: 170,
    weightKg: 79.2,
    condition: "Type 2 Diabetes",
    knownConditions: ["Type 2 Diabetes", "Dyslipidaemia"],
    allergies: ["None recorded"],
    currentMedications: ["Metformin 500 mg BD"],
    previousTreatment: "Metformin monotherapy",
    previousResponse: "partial",
    facilityId: "F-PHC-01",
    location: "Balasore, Odisha",
    createdAt: "2026-05-02",
    clinical: {
      recordDate: "2026-08-12",
      glucoseFasting: 168,
      hba1c: 8.2,
      systolic: 138,
      diastolic: 86,
      durationYears: 6,
      egfr: 84,
    },
    history: [
      {
        recordDate: "2026-02-10",
        glucoseFasting: 152,
        hba1c: 7.6,
        systolic: 132,
        diastolic: 84,
        durationYears: 5.5,
        egfr: 88,
      },
      {
        recordDate: "2025-09-18",
        glucoseFasting: 144,
        hba1c: 7.3,
        systolic: 130,
        diastolic: 82,
        durationYears: 5,
        egfr: 90,
      },
    ],
  },
  {
    id: "P002",
    code: "P002",
    displayName: "Demo Patient P002",
    age: 41,
    sex: "female",
    heightCm: 158,
    weightKg: 68,
    condition: "Type 2 Diabetes",
    knownConditions: ["Type 2 Diabetes"],
    allergies: ["Sulfa drugs"],
    currentMedications: ["Metformin 500 mg OD"],
    previousTreatment: "Lifestyle + Metformin",
    previousResponse: "good",
    facilityId: "F-CHC-01",
    location: "Cuttack, Odisha",
    createdAt: "2026-06-11",
    clinical: {
      recordDate: "2026-08-14",
      glucoseFasting: 126,
      hba1c: 6.8,
      systolic: 124,
      diastolic: 78,
      durationYears: 2,
      egfr: 96,
    },
    history: [
      {
        recordDate: "2026-03-04",
        glucoseFasting: 140,
        hba1c: 7.2,
        systolic: 126,
        diastolic: 80,
        durationYears: 1.5,
        egfr: 95,
      },
    ],
  },
  {
    id: "P003",
    code: "P003",
    displayName: "Demo Patient P003",
    age: 63,
    sex: "male",
    heightCm: 165,
    weightKg: 88,
    condition: "Type 2 Diabetes",
    knownConditions: ["Type 2 Diabetes", "Hypertension", "CKD stage 3a"],
    allergies: ["None recorded"],
    currentMedications: ["Metformin 1000 mg BD", "Amlodipine 5 mg OD"],
    previousTreatment: "Metformin + Glimepiride",
    previousResponse: "poor",
    facilityId: "F-DH-01",
    location: "Khordha, Odisha",
    createdAt: "2026-04-21",
    clinical: {
      recordDate: "2026-08-16",
      glucoseFasting: 204,
      hba1c: 9.6,
      systolic: 152,
      diastolic: 94,
      durationYears: 12,
      egfr: 52,
    },
    history: [
      {
        recordDate: "2026-01-22",
        glucoseFasting: 188,
        hba1c: 9.1,
        systolic: 148,
        diastolic: 92,
        durationYears: 11.5,
        egfr: 57,
      },
    ],
  },
];

export const getPatient = (id: string) => patients.find((p) => p.id === id);

/* ---------------- Facilities & services (configurable data) ---------------- */

export type FacilityType = "Sub-Centre" | "PHC" | "CHC" | "District Hospital" | "Medical College";

export const facilityLadder: FacilityType[] = [
  "Sub-Centre",
  "PHC",
  "CHC",
  "District Hospital",
  "Medical College",
];

export type Facility = {
  id: string;
  name: string;
  type: FacilityType;
  district: string;
  state: string;
  services: string[];
};

export const facilities: Facility[] = [
  {
    id: "F-SC-01",
    name: "Remuna Sub-Centre",
    type: "Sub-Centre",
    district: "Balasore",
    state: "Odisha",
    services: ["Basic examination", "Blood pressure measurement"],
  },
  {
    id: "F-PHC-01",
    name: "Sahadevkhunta PHC",
    type: "PHC",
    district: "Balasore",
    state: "Odisha",
    services: [
      "Basic examination",
      "Blood pressure measurement",
      "Random blood glucose",
      "Fasting blood glucose",
      "Urine routine",
    ],
  },
  {
    id: "F-CHC-01",
    name: "Salipur CHC",
    type: "CHC",
    district: "Cuttack",
    state: "Odisha",
    services: [
      "Basic examination",
      "Blood pressure measurement",
      "Fasting blood glucose",
      "HbA1c",
      "Lipid profile",
      "Serum creatinine",
      "X-ray",
      "Ultrasound",
    ],
  },
  {
    id: "F-DH-01",
    name: "Khordha District Hospital",
    type: "District Hospital",
    district: "Khordha",
    state: "Odisha",
    services: [
      "Basic examination",
      "Blood pressure measurement",
      "Fasting blood glucose",
      "HbA1c",
      "Lipid profile",
      "Serum creatinine",
      "Urine albumin-creatinine ratio",
      "Retinal screening",
      "X-ray",
      "Ultrasound",
      "Diabetology consultation",
    ],
  },
  {
    id: "F-MC-01",
    name: "SCB Medical College",
    type: "Medical College",
    district: "Cuttack",
    state: "Odisha",
    services: [
      "Basic examination",
      "Fasting blood glucose",
      "HbA1c",
      "Lipid profile",
      "Serum creatinine",
      "Urine albumin-creatinine ratio",
      "Retinal screening",
      "Nephrology consultation",
      "Endocrinology consultation",
      "Diabetology consultation",
    ],
  },
];

export const services = [
  "HbA1c",
  "Fasting blood glucose",
  "Lipid profile",
  "Serum creatinine",
  "Urine albumin-creatinine ratio",
  "Retinal screening",
  "Diabetology consultation",
];

export const getFacility = (id: string) => facilities.find((f) => f.id === id);

export type ReferralResult = {
  availableLocally: boolean;
  currentFacility: Facility;
  suggested?: Facility;
  message: string;
};

export function checkReferral(facilityId: string, service: string): ReferralResult {
  const current: Facility = getFacility(facilityId) ?? (facilities[1] as Facility);
  if (current.services.includes(service)) {
    return {
      availableLocally: true,
      currentFacility: current,
      message: `${service} is configured as available at ${current.name} (${current.type}). Investigation can likely be done locally.`,
    };
  }
  const currentRank = facilityLadder.indexOf(current.type);
  const suggested = facilities
    .filter((f) => facilityLadder.indexOf(f.type) > currentRank && f.services.includes(service))
    .sort((a, b) => facilityLadder.indexOf(a.type) - facilityLadder.indexOf(b.type))[0];
  return {
    availableLocally: false,
    currentFacility: current,
    suggested,
    message: suggested
      ? `${service} is not listed as available at ${current.name} (${current.type}). Consider referral to ${suggested.type} (${suggested.name}) for the required investigation, subject to local facility availability.`
      : `${service} is not listed as available at ${current.name}, and no higher configured facility in this dataset lists it. Verify locally.`,
  };
}

/* ---------------- Medicines (small, source-tagged dataset) ---------------- */

export type Medicine = {
  id: string;
  genericName: string;
  brandName: string;
  dosage: string;
  form: string;
  brandPrice: number;
  genericPrice: number;
  packSize: string;
  janAushadhi: "Listed" | "Not verified" | "Unknown";
  source: string;
  lastVerified: string;
  notes: string;
  drugClass: string;
};

export const medicines: Medicine[] = [
  {
    id: "M01",
    genericName: "Metformin",
    brandName: "Brand A (illustrative)",
    dosage: "500 mg",
    form: "Tablet",
    brandPrice: 62,
    genericPrice: 22,
    packSize: "strip of 10",
    janAushadhi: "Listed",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Prices are placeholders for demonstration; verify against current published price lists.",
    drugClass: "Biguanide",
  },
  {
    id: "M02",
    genericName: "Glimepiride",
    brandName: "Brand B (illustrative)",
    dosage: "1 mg",
    form: "Tablet",
    brandPrice: 88,
    genericPrice: 31,
    packSize: "strip of 10",
    janAushadhi: "Listed",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Hypoglycaemia risk; verify current prices before counselling.",
    drugClass: "Sulfonylurea",
  },
  {
    id: "M03",
    genericName: "Sitagliptin",
    brandName: "Brand C (illustrative)",
    dosage: "50 mg",
    form: "Tablet",
    brandPrice: 180,
    genericPrice: 65,
    packSize: "strip of 10",
    janAushadhi: "Not verified",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Availability at Jan Aushadhi outlets not verified in this dataset.",
    drugClass: "DPP-4 inhibitor",
  },
  {
    id: "M04",
    genericName: "Dapagliflozin",
    brandName: "Brand D (illustrative)",
    dosage: "10 mg",
    form: "Tablet",
    brandPrice: 240,
    genericPrice: 96,
    packSize: "strip of 10",
    janAushadhi: "Not verified",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Renal/cardiac considerations apply; clinician review required.",
    drugClass: "SGLT2 inhibitor",
  },
  {
    id: "M05",
    genericName: "Insulin glargine",
    brandName: "Brand E (illustrative)",
    dosage: "100 IU/mL",
    form: "Pen / vial",
    brandPrice: 780,
    genericPrice: 430,
    packSize: "3 mL",
    janAushadhi: "Unknown",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Cold chain and training needs; cost impact is significant.",
    drugClass: "Basal insulin",
  },
  {
    id: "M06",
    genericName: "Amlodipine",
    brandName: "Brand F (illustrative)",
    dosage: "5 mg",
    form: "Tablet",
    brandPrice: 45,
    genericPrice: 14,
    packSize: "strip of 10",
    janAushadhi: "Listed",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Antihypertensive commonly co-prescribed.",
    drugClass: "Calcium channel blocker",
  },
  {
    id: "M07",
    genericName: "Telmisartan",
    brandName: "Brand G (illustrative)",
    dosage: "40 mg",
    form: "Tablet",
    brandPrice: 96,
    genericPrice: 34,
    packSize: "strip of 10",
    janAushadhi: "Listed",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Often preferred with albuminuria; clinician review required.",
    drugClass: "ARB",
  },
  {
    id: "M08",
    genericName: "Atorvastatin",
    brandName: "Brand H (illustrative)",
    dosage: "10 mg",
    form: "Tablet",
    brandPrice: 74,
    genericPrice: 26,
    packSize: "strip of 10",
    janAushadhi: "Listed",
    source: "Illustrative demo dataset (not a live price feed)",
    lastVerified: "2026-08-01",
    notes: "Lipid management adjunct.",
    drugClass: "Statin",
  },
];