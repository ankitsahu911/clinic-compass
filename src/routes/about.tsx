import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Methodology, Scope & Limitations — CareAssist" },
      {
        name: "description",
        content:
          "Architecture, ML methodology, data provenance, safety scope and future work for the PS61 AI-assisted personalised treatment planning prototype.",
      },
      { property: "og:title", content: "Methodology & Limitations — CareAssist" },
      {
        property: "og:description",
        content: "How the prototype works, what it deliberately does not claim, and what comes next.",
      },
    ],
  }),
  component: AboutPage,
});

const sections: { title: string; items: string[] }[] = [
  {
    title: "Scope and safety position",
    items: [
      "Clinical decision support for Type 2 Diabetes care planning — not autonomous diagnosis or prescribing.",
      "The platform never states that a patient has a disease or that a drug must be given.",
      "All patients, prices and facility service lists shown are synthetic or illustrative configurable data.",
      "No real patient data, no identifiable data sent to any external model.",
    ],
  },
  {
    title: "ML methodology",
    items: [
      "Target: probability of poor glycaemic control (HbA1c ≥ 7.5%) at ~6 months — a defensible outcome-risk task.",
      "Features: HbA1c, previous treatment response, BMI, diabetes duration, fasting glucose, systolic BP, age, eGFR.",
      "Preprocessing: de-duplication, missing-value handling, ordinal encoding of previous response, standardisation.",
      "Deployed model: logistic regression (interpretable, exact additive attribution); random forest and gradient boosting evaluated as baselines.",
      "Explainability: contribution = coefficient × standardised feature value, the additive-attribution equivalent of SHAP for a linear model.",
    ],
  },
  {
    title: "Why treatment options are rule-based",
    items: [
      "No available dataset pairs treatments with outcomes for this cohort, so learned treatment-response labels would be fabricated.",
      "Instead, the risk score feeds a documented, editable rule layer that scores intensification options and lists supporting factors and cautions.",
      "Each option shows its reasoning so a clinician can accept, adjust or discard it.",
    ],
  },
  {
    title: "India-specific decision context",
    items: [
      "Generic vs branded cost comparison with drug class, source attribution and last-verified date.",
      "Jan Aushadhi status recorded honestly as Listed / Not verified / Unknown rather than assumed.",
      "Facility ladder Sub-Centre → PHC → CHC → District Hospital → Medical College with per-facility configured service lists driving referral suggestions.",
    ],
  },
  {
    title: "Future scope",
    items: [
      "Hypertension and additional conditions; treatment-outcome datasets where licensing permits.",
      "Consent-based ABDM/ABHA sandbox retrieval behind a provider interface (manual entry remains the default path).",
      "Server-side persistence, doctor/admin roles, audit logging, PDF report export.",
      "Calibration analysis, subgroup fairness review and external validation before any clinical use.",
    ],
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Methodology, scope and limitations</h1>
        <p className="text-sm text-muted-foreground">
          PS61 — AI-driven personalised treatment planning · prototype documentation
        </p>
      </header>

      <Disclaimer />

      {sections.map((s) => (
        <section key={s.title} className="panel">
          <h2 className="text-base font-semibold">{s.title}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {s.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="panel">
        <h2 className="text-base font-semibold">Data flow</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-tint p-4 text-xs leading-relaxed">{`Clinical data entry / provider (Manual | ABDM future)
        |
        v
  Preprocessing + standardisation
        |
        v
  Risk model  ->  Feature attribution (explainability)
        |
        v
  Rule layer  ->  Treatment-support options
        |
        +--> Medicine affordability (generic vs branded)
        +--> Facility service check -> referral suggestion
        |
        v
  Doctor dashboard  ->  clinician decides`}</pre>
      </section>
    </div>
  );
}