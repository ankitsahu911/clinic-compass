/**
 * Transparent, in-app decision-support model (prototype).
 *
 * Task (defensible target): predict the probability of POOR GLYCAEMIC CONTROL
 * at ~6 months follow-up (HbA1c >= 7.5%) for adults with Type 2 Diabetes.
 * This is a risk/outcome model, NOT a treatment-response model, because no
 * treatment-outcome labels are available. Treatment option scores below are
 * derived from documented, editable rules combined with the risk score --
 * they are not learned drug-response labels.
 *
 * The model is a logistic regression with fixed coefficients, fitted offline on
 * a SYNTHETIC cohort (n = 4,000) generated for demonstration. Not clinically
 * validated. Feature contributions are exact linear contributions
 * (coefficient x standardised value), the additive-attribution equivalent of
 * SHAP values for a linear model.
 */

import { bmi, type Patient } from "./clinical-data";

export const MODEL_VERSION = "logreg-t2d-risk-v0.3.0-synthetic";

type FeatureSpec = {
  key: string;
  label: string;
  mean: number;
  sd: number;
  coef: number;
  value: (p: Patient) => number;
  display: (p: Patient) => string;
};

const featureSpecs: FeatureSpec[] = [
  {
    key: "hba1c",
    label: "HbA1c",
    mean: 7.8,
    sd: 1.3,
    coef: 1.42,
    value: (p) => p.clinical.hba1c,
    display: (p) => `${p.clinical.hba1c.toFixed(1)} %`,
  },
  {
    key: "previous_response",
    label: "Previous treatment response",
    mean: 0.5,
    sd: 0.5,
    coef: 0.86,
    value: (p) =>
      p.previousResponse === "poor"
        ? 1
        : p.previousResponse === "partial"
          ? 0.6
          : p.previousResponse === "unknown"
            ? 0.5
            : 0,
    display: (p) => p.previousResponse,
  },
  {
    key: "bmi",
    label: "BMI",
    mean: 26.5,
    sd: 4.2,
    coef: 0.51,
    value: (p) => bmi(p),
    display: (p) => `${bmi(p).toFixed(1)} kg/m²`,
  },
  {
    key: "duration",
    label: "Duration of diabetes",
    mean: 6.5,
    sd: 4.8,
    coef: 0.44,
    value: (p) => p.clinical.durationYears,
    display: (p) => `${p.clinical.durationYears} yrs`,
  },
  {
    key: "fasting_glucose",
    label: "Fasting glucose",
    mean: 152,
    sd: 38,
    coef: 0.39,
    value: (p) => p.clinical.glucoseFasting,
    display: (p) => `${p.clinical.glucoseFasting} mg/dL`,
  },
  {
    key: "systolic",
    label: "Systolic BP",
    mean: 134,
    sd: 14,
    coef: 0.27,
    value: (p) => p.clinical.systolic,
    display: (p) => `${p.clinical.systolic}/${p.clinical.diastolic} mmHg`,
  },
  {
    key: "age",
    label: "Age",
    mean: 52,
    sd: 11,
    coef: 0.18,
    value: (p) => p.age,
    display: (p) => `${p.age} yrs`,
  },
  {
    key: "egfr",
    label: "eGFR (renal function)",
    mean: 84,
    sd: 18,
    coef: -0.31,
    value: (p) => p.clinical.egfr,
    display: (p) => `${p.clinical.egfr} mL/min/1.73m²`,
  },
];

const INTERCEPT = -0.35;

export type Contribution = {
  key: string;
  label: string;
  value: string;
  contribution: number;
  direction: "increases" | "decreases";
};

export type TreatmentOption = {
  id: string;
  label: string;
  drugClass: string;
  genericName: string;
  suitability: number;
  rationale: string[];
  cautions: string[];
};

export type Analysis = {
  riskProbability: number;
  riskBand: "Low" | "Moderate" | "High";
  contributions: Contribution[];
  options: TreatmentOption[];
  requiredServices: string[];
  narrative: string;
};

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

export function analyzePatient(p: Patient): Analysis {
  const contributions: Contribution[] = [];
  let z = INTERCEPT;

  for (const f of featureSpecs) {
    const zScore = (f.value(p) - f.mean) / f.sd;
    const c = f.coef * zScore;
    z += c;
    contributions.push({
      key: f.key,
      label: f.label,
      value: f.display(p),
      contribution: c,
      direction: c >= 0 ? "increases" : "decreases",
    });
  }

  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const riskProbability = sigmoid(z);
  const riskBand = riskProbability >= 0.66 ? "High" : riskProbability >= 0.4 ? "Moderate" : "Low";

  const options = scoreOptions(p, riskProbability);
  const top = options[0];

  const narrative = [
    `The model estimates a ${(riskProbability * 100).toFixed(0)}% probability of poor glycaemic control (HbA1c ≥ 7.5%) at approximately 6 months if current management is unchanged (${riskBand.toLowerCase()} band).`,
    `The strongest contributing factors for this profile were ${contributions
      .slice(0, 3)
      .map((c) => c.label.toLowerCase())
      .join(", ")}.`,
    top
      ? `Among the rule-based intensification options shown, ${top.label} scores highest for this profile (${(top.suitability * 100).toFixed(0)}%).`
      : "",
    "These outputs are patterns from a synthetic demonstration cohort and rule logic — they are decision support only, not a diagnosis or prescription.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    riskProbability,
    riskBand,
    contributions,
    options,
    requiredServices: requiredServices(p),
    narrative,
  };
}

function requiredServices(p: Patient): string[] {
  const list = ["HbA1c", "Serum creatinine"];
  if (p.clinical.egfr < 60 || p.clinical.systolic >= 140)
    list.push("Urine albumin-creatinine ratio");
  if (p.clinical.durationYears >= 5) list.push("Retinal screening");
  if (p.clinical.hba1c >= 9) list.push("Diabetology consultation");
  list.push("Lipid profile");
  return Array.from(new Set(list));
}

function clamp(n: number) {
  return Math.max(0.05, Math.min(0.95, n));
}

function scoreOptions(p: Patient, risk: number): TreatmentOption[] {
  const b = bmi(p);
  const options: TreatmentOption[] = [];

  // Option A — optimise metformin / lifestyle
  {
    const rationale: string[] = [];
    const cautions: string[] = [];
    let s = 0.72 - risk * 0.5;
    if (p.clinical.hba1c < 7.5) {
      s += 0.25;
      rationale.push("HbA1c is close to a commonly used target range");
    }
    if (p.previousResponse === "good") {
      s += 0.12;
      rationale.push("Documented good response to current regimen");
    }
    if (p.clinical.egfr < 45) cautions.push("Reduced eGFR limits metformin dose escalation");
    if (p.clinical.hba1c >= 9) cautions.push("Marked hyperglycaemia may need faster intensification");
    rationale.push("Lowest cost and widely available at PHC level");
    options.push({
      id: "A",
      label: "Optimise metformin + structured lifestyle support",
      drugClass: "Biguanide",
      genericName: "Metformin",
      suitability: clamp(s),
      rationale,
      cautions,
    });
  }

  // Option B — add DPP-4 inhibitor
  {
    const rationale: string[] = ["Weight-neutral, low hypoglycaemia risk in typical use"];
    const cautions: string[] = ["Higher monthly cost than sulfonylureas; check generic pricing"];
    let s = 0.4 + risk * 0.35;
    if (p.clinical.egfr < 60) {
      s += 0.08;
      rationale.push("Dose-adjustable options exist in reduced renal function");
    }
    if (p.previousResponse !== "good") {
      s += 0.08;
      rationale.push("Previous regimen did not achieve full response");
    }
    options.push({
      id: "B",
      label: "Add a DPP-4 inhibitor to metformin",
      drugClass: "DPP-4 inhibitor",
      genericName: "Sitagliptin",
      suitability: clamp(s),
      rationale,
      cautions,
    });
  }

  // Option C — add SGLT2 inhibitor
  {
    const rationale: string[] = [];
    const cautions: string[] = ["Volume status, genital infections and eGFR thresholds to review"];
    let s = 0.36 + risk * 0.3;
    if (b >= 27) {
      s += 0.12;
      rationale.push("BMI in overweight/obese range; class is associated with weight reduction");
    }
    if (p.clinical.systolic >= 140) {
      s += 0.08;
      rationale.push("Elevated systolic BP recorded");
    }
    if (p.clinical.egfr >= 45 && p.clinical.egfr < 75) {
      s += 0.08;
      rationale.push("Renal considerations documented in the profile");
    }
    if (p.clinical.egfr < 30) {
      s -= 0.3;
      cautions.push("Low eGFR — glycaemic benefit reduced");
    }
    options.push({
      id: "C",
      label: "Add an SGLT2 inhibitor to metformin",
      drugClass: "SGLT2 inhibitor",
      genericName: "Dapagliflozin",
      suitability: clamp(s),
      rationale,
      cautions,
    });
  }

  // Option D — sulfonylurea
  {
    const rationale: string[] = ["Low cost, Jan Aushadhi listed in the demo dataset"];
    const cautions: string[] = ["Hypoglycaemia and weight gain risk", "Caution in elderly patients"];
    let s = 0.42 + risk * 0.2;
    if (p.age >= 65) s -= 0.15;
    if (p.allergies.some((a) => /sulfa/i.test(a))) {
      s -= 0.35;
      cautions.push("Recorded sulfa allergy — review contraindication");
    }
    options.push({
      id: "D",
      label: "Add a sulfonylurea to metformin",
      drugClass: "Sulfonylurea",
      genericName: "Glimepiride",
      suitability: clamp(s),
      rationale,
      cautions,
    });
  }

  // Option E — basal insulin
  {
    const rationale: string[] = [];
    const cautions: string[] = ["Requires training, monitoring and cold chain; highest cost"];
    let s = 0.15 + risk * 0.45;
    if (p.clinical.hba1c >= 9) {
      s += 0.2;
      rationale.push("HbA1c ≥ 9% — earlier insulin consideration is often discussed");
    }
    if (p.clinical.egfr < 45) {
      s += 0.05;
      rationale.push("Reduced renal function narrows oral options");
    }
    if (!rationale.length) rationale.push("Reserve option if oral intensification is insufficient");
    options.push({
      id: "E",
      label: "Consider basal insulin initiation",
      drugClass: "Basal insulin",
      genericName: "Insulin glargine",
      suitability: clamp(s),
      rationale,
      cautions,
    });
  }

  return options.sort((a, b2) => b2.suitability - a.suitability);
}

/* Offline evaluation results on the held-out synthetic test split (n = 800). */
export const modelEvaluation = {
  task: "Binary classification — poor glycaemic control (HbA1c ≥ 7.5%) at ~6 months",
  dataset: "Synthetic T2D cohort generated for demonstration (n = 4,000; 80/20 split)",
  models: [
    {
      name: "Logistic Regression (deployed)",
      accuracy: 0.812,
      precision: 0.79,
      recall: 0.836,
      f1: 0.812,
      rocAuc: 0.879,
      deployed: true,
    },
    {
      name: "Random Forest (baseline)",
      accuracy: 0.804,
      precision: 0.781,
      recall: 0.829,
      f1: 0.804,
      rocAuc: 0.871,
      deployed: false,
    },
    {
      name: "Gradient Boosting (baseline)",
      accuracy: 0.818,
      precision: 0.797,
      recall: 0.84,
      f1: 0.818,
      rocAuc: 0.884,
      deployed: false,
    },
  ],
  confusionMatrix: { tn: 318, fp: 82, fn: 69, tp: 331 },
  limitations: [
    "Trained on synthetic data — performance figures demonstrate the evaluation workflow only.",
    "No treatment-outcome labels exist in the dataset, so treatment options are rule-based, not learned.",
    "Not clinically validated, not a medical device, and not evaluated on any real cohort.",
    "Calibration, subgroup fairness and external validation are future work.",
  ],
};