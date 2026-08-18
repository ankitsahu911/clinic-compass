import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, IndianRupee, Hospital, ListTree, Play } from "lucide-react";

import { Disclaimer } from "@/components/Disclaimer";
import {
  bmi,
  checkReferral,
  facilities,
  getFacility,
  getPatient,
  medicines,
} from "@/lib/clinical-data";
import { analyzePatient, MODEL_VERSION } from "@/lib/model";

export const Route = createFileRoute("/patients/$patientId")({
  loader: ({ params }) => {
    const patient = getPatient(params.patientId);
    if (!patient) throw notFound();
    return { patientId: patient.id };
  },
  head: ({ params }) => ({
    meta: [
      { title: `Patient ${params.patientId} — Decision Support | CareAssist` },
      {
        name: "description",
        content: `Explainable risk analysis, treatment-support options, affordability comparison and referral guidance for synthetic patient ${params.patientId}.`,
      },
      { property: "og:title", content: `Patient ${params.patientId} — CareAssist` },
      {
        property: "og:description",
        content: "Explainable decision support for a synthetic Type 2 Diabetes patient profile.",
      },
    ],
  }),
  component: PatientPage,
});

function bandClass(band: string) {
  return band === "High"
    ? "bg-danger/12 text-danger"
    : band === "Moderate"
      ? "bg-warning/15 text-warning"
      : "bg-success/12 text-success";
}

function PatientPage() {
  const { patientId } = Route.useLoaderData();
  const patient = getPatient(patientId)!;
  const [ran, setRan] = useState(false);
  const [facilityId, setFacilityId] = useState(patient.facilityId);

  const analysis = analyzePatient(patient);
  const maxAbs = Math.max(...analysis.contributions.map((c) => Math.abs(c.contribution)));
  const facility = getFacility(facilityId)!;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="size-4" /> Back to worklist
      </Link>

      {/* Patient header */}
      <section className="panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{patient.code}</h1>
            <p className="text-sm text-muted-foreground">
              {patient.age} y · {patient.sex} · {patient.condition} · {patient.location}
            </p>
          </div>
          <button
            onClick={() => setRan(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Play className="size-4" /> {ran ? "Re-run AI analysis" : "Run AI analysis"}
          </button>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-6">
          {[
            ["HbA1c", `${patient.clinical.hba1c} %`],
            ["Fasting glucose", `${patient.clinical.glucoseFasting} mg/dL`],
            ["BMI", `${bmi(patient).toFixed(1)}`],
            ["Blood pressure", `${patient.clinical.systolic}/${patient.clinical.diastolic}`],
            ["eGFR", `${patient.clinical.egfr}`],
            ["Duration", `${patient.clinical.durationYears} yrs`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-surface-tint px-3 py-2">
              <dt className="text-[11px] text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Known conditions" value={patient.knownConditions.join(", ")} />
          <Info label="Current medications" value={patient.currentMedications.join(", ")} />
          <Info
            label="Previous treatment"
            value={`${patient.previousTreatment} — ${patient.previousResponse} response`}
          />
          <Info label="Allergies" value={patient.allergies.join(", ")} />
        </div>
      </section>

      {!ran ? (
        <div className="panel text-sm text-muted-foreground">
          Clinical record dated {patient.clinical.recordDate} is loaded. Select{" "}
          <strong className="text-foreground">Run AI analysis</strong> to generate risk estimate,
          feature attribution, affordability comparison and referral guidance.
        </div>
      ) : (
        <>
          <Disclaimer />

          {/* Risk + options */}
          <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
            <div className="panel">
              <h2 className="text-base font-semibold">Predicted outcome risk</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Probability of poor glycaemic control (HbA1c ≥ 7.5%) at ~6 months if management is
                unchanged.
              </p>
              <p className="mt-4 text-5xl font-semibold text-primary">
                {(analysis.riskProbability * 100).toFixed(0)}%
              </p>
              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${bandClass(analysis.riskBand)}`}
              >
                {analysis.riskBand} risk band
              </span>
              <p className="mt-4 text-[11px] text-muted-foreground">Model: {MODEL_VERSION}</p>
            </div>

            <div className="panel">
              <h2 className="text-base font-semibold">Treatment-support options (rule-based)</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Suitability scores combine the risk estimate with documented, editable clinical
                rules. They are not learned drug-response probabilities and are not prescriptions.
              </p>
              <ul className="mt-4 space-y-3">
                {analysis.options.map((o) => (
                  <li key={o.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        Option {o.id}: {o.label}
                      </p>
                      <span className="text-sm font-semibold text-primary">
                        {(o.suitability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${o.suitability * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Supporting: </span>
                      {o.rationale.join("; ")}
                    </p>
                    {o.cautions.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-warning">Cautions: </span>
                        {o.cautions.join("; ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Explainability */}
          <section className="panel">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <ListTree className="size-4 text-primary" /> Why this prediction
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Additive feature contributions (coefficient × standardised value) — the exact
              attribution for this linear model.
            </p>
            <ul className="mt-4 space-y-2">
              {analysis.contributions.map((c) => {
                const pct = (Math.abs(c.contribution) / maxAbs) * 100;
                const up = c.direction === "increases";
                return (
                  <li key={c.key} className="grid grid-cols-[minmax(0,180px)_1fr_auto] items-center gap-3">
                    <span className="truncate text-sm">
                      {c.label} <span className="text-muted-foreground">({c.value})</span>
                    </span>
                    <span className="h-2.5 rounded-full bg-secondary">
                      <span
                        className={`block h-full rounded-full ${up ? "bg-danger" : "bg-success"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-28 text-right text-xs text-muted-foreground">
                      {up ? "↑ raises" : "↓ lowers"} {c.contribution.toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 rounded-lg bg-surface-tint p-3 text-sm">{analysis.narrative}</p>
          </section>

          {/* Affordability */}
          <section className="panel">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <IndianRupee className="size-4 text-primary" /> Affordability for these option classes
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr>
                    {["Option", "Generic", "Branded ₹", "Generic ₹", "Saving", "Jan Aushadhi"].map(
                      (h) => (
                        <th key={h} className="border-b border-border pb-2 pr-4 font-medium">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {analysis.options.map((o) => {
                    const m = medicines.find((x) => x.genericName === o.genericName);
                    if (!m) return null;
                    return (
                      <tr key={o.id} className="border-b border-border/60">
                        <td className="py-2 pr-4">Option {o.id}</td>
                        <td className="py-2 pr-4">
                          {m.genericName} {m.dosage}
                        </td>
                        <td className="py-2 pr-4">₹{m.brandPrice}</td>
                        <td className="py-2 pr-4">₹{m.genericPrice}</td>
                        <td className="py-2 pr-4 font-medium text-success">
                          ₹{m.brandPrice - m.genericPrice}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">{m.janAushadhi}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Prices are illustrative demo values per pack, last reviewed 2026-08-01. Verify against
              current published price lists before counselling.
            </p>
          </section>

          {/* Referral */}
          <section className="panel">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Hospital className="size-4 text-primary" /> Referral guidance
            </h2>
            <label className="mt-3 block text-xs text-muted-foreground">
              Current facility
              <select
                value={facilityId}
                onChange={(e) => setFacilityId(e.target.value)}
                className="mt-1 block w-full max-w-sm rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.type} — {f.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-3 text-xs text-muted-foreground">
              Services required for this care plan, checked against {facility.name}:
            </p>
            <ul className="mt-3 space-y-2">
              {analysis.requiredServices.map((s) => {
                const r = checkReferral(facilityId, s);
                return (
                  <li
                    key={s}
                    className="rounded-lg border border-border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{s}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.availableLocally
                            ? "bg-success/12 text-success"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {r.availableLocally ? "Available locally" : "Not configured as available"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.message}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* History */}
          <section className="panel">
            <h2 className="text-base font-semibold">Clinical history timeline</h2>
            <ol className="mt-4 space-y-3 border-l border-border pl-5">
              {[patient.clinical, ...patient.history].map((r) => (
                <li key={r.recordDate} className="relative text-sm">
                  <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-primary" />
                  <p className="font-medium">{r.recordDate}</p>
                  <p className="text-muted-foreground">
                    HbA1c {r.hba1c}% · FBG {r.glucoseFasting} mg/dL · BP {r.systolic}/{r.diastolic} ·
                    eGFR {r.egfr}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}