import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Disclaimer } from "@/components/Disclaimer";
import { checkReferral, facilities, facilityLadder, services } from "@/lib/clinical-data";

export const Route = createFileRoute("/referral")({
  head: () => ({
    meta: [
      { title: "Referral Guidance — PHC / CHC / District | CareAssist" },
      {
        name: "description",
        content:
          "Check whether a required investigation is configured as available at the patient's facility level and identify the next configured level for referral.",
      },
      { property: "og:title", content: "Referral Guidance — CareAssist" },
      {
        property: "og:description",
        content: "Facility-aware investigation availability across India's public health ladder.",
      },
    ],
  }),
  component: ReferralPage,
});

function ReferralPage() {
  const [facilityId, setFacilityId] = useState("F-PHC-01");
  const [service, setService] = useState("HbA1c");
  const result = checkReferral(facilityId, service);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Referral guidance</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Availability is configurable data for this prototype, not a universal assumption or a
          real-time hospital feed.
        </p>
      </header>

      <Disclaimer compact />

      <div className="panel">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {facilityLadder.map((t, i) => (
            <span key={t} className="flex items-center gap-2">
              <span className="rounded-full bg-surface-tint px-3 py-1 text-foreground">{t}</span>
              {i < facilityLadder.length - 1 && <span>→</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="panel grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-muted-foreground">
          Current facility
          <select
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.type} — {f.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Required investigation / service
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="panel">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            result.availableLocally
              ? "bg-success/12 text-success"
              : "bg-warning/15 text-warning"
          }`}
        >
          {result.availableLocally ? "Available locally" : "Not configured as available"}
        </span>
        <p className="mt-3 text-sm">{result.message}</p>
        {result.suggested && (
          <p className="mt-2 text-sm text-muted-foreground">
            Suggested next level: <strong className="text-foreground">{result.suggested.type}</strong>{" "}
            — {result.suggested.name}, {result.suggested.district}, {result.suggested.state}.
          </p>
        )}
      </div>

      <section className="panel">
        <h2 className="text-base font-semibold">Configured services at {result.currentFacility.name}</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs">
          {result.currentFacility.services.map((s) => (
            <li key={s} className="rounded-full bg-surface-tint px-3 py-1">
              {s}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}