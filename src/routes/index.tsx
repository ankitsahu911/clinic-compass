import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, IndianRupee, Hospital, Sparkles } from "lucide-react";

import { Disclaimer } from "@/components/Disclaimer";
import { bmi, getFacility, patients } from "@/lib/clinical-data";
import { analyzePatient } from "@/lib/model";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Patient Worklist — CareAssist Decision Support" },
      {
        name: "description",
        content:
          "Doctor worklist of synthetic Type 2 Diabetes patients with model-estimated control risk, ready for explainable treatment-planning support.",
      },
      { property: "og:title", content: "Patient Worklist — CareAssist Decision Support" },
      {
        name: "og:description",
        content: "Review synthetic T2D patients and run explainable decision-support analysis.",
      },
    ],
  }),
  component: Index,
});

function bandClass(band: string) {
  return band === "High"
    ? "bg-danger/12 text-danger"
    : band === "Moderate"
      ? "bg-warning/15 text-warning"
      : "bg-success/12 text-success";
}

function Index() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkles className="size-3.5" /> PS61 · AI-driven personalised treatment planning
        </span>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold">
          Explainable treatment-planning support for Type 2 Diabetes care
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Combine patient-level risk prediction, transparent feature attribution, generic vs branded
          affordability and facility-aware referral guidance — so the clinician decides with more
          context, not less.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            to="/patients/$patientId"
            params={{ patientId: "P001" }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open demo patient P001 <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/model"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium"
          >
            Model performance
          </Link>
        </div>
      </section>

      <Disclaimer />

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Sparkles,
            title: "Risk + attribution",
            body: "Logistic model with exact additive feature contributions per patient.",
          },
          {
            icon: IndianRupee,
            title: "Affordability",
            body: "Generic vs branded comparison with source and last-verified dates.",
          },
          {
            icon: Hospital,
            title: "Referral ladder",
            body: "Sub-Centre → PHC → CHC → District Hospital service availability checks.",
          },
        ].map((c) => (
          <div key={c.title} className="panel">
            <c.icon className="size-5 text-primary" />
            <h2 className="mt-3 text-base font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Patient worklist</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((p) => {
            const a = analyzePatient(p);
            const facility = getFacility(p.facilityId);
            return (
              <Link
                key={p.id}
                to="/patients/$patientId"
                params={{ patientId: p.id }}
                className="panel transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{p.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.age} y · {p.sex} · {p.condition}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${bandClass(a.riskBand)}`}
                  >
                    {a.riskBand} · {(a.riskProbability * 100).toFixed(0)}%
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  {[
                    ["HbA1c", `${p.clinical.hba1c}%`],
                    ["BMI", bmi(p).toFixed(1)],
                    ["BP", `${p.clinical.systolic}/${p.clinical.diastolic}`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-surface-tint px-2 py-1.5">
                      <dt className="text-[11px] text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  {facility?.type} · {facility?.name}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
