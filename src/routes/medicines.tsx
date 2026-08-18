import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Disclaimer } from "@/components/Disclaimer";
import { medicines } from "@/lib/clinical-data";

export const Route = createFileRoute("/medicines")({
  head: () => ({
    meta: [
      { title: "Medicine Affordability — Generic vs Branded | CareAssist" },
      {
        name: "description",
        content:
          "Compare illustrative generic and branded medicine costs, potential savings and Jan Aushadhi listing status for common diabetes and cardiometabolic drugs.",
      },
      { property: "og:title", content: "Medicine Affordability — CareAssist" },
      {
        property: "og:description",
        content: "Generic vs branded cost comparison with source and last-verified dates.",
      },
    ],
  }),
  component: MedicinesPage,
});

function MedicinesPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      medicines.filter((m) =>
        `${m.genericName} ${m.brandName} ${m.drugClass}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Medicine affordability</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A small, source-tagged reference set. Values are illustrative demonstration data, not a live
          price feed — always verify against the current published price list.
        </p>
      </header>

      <Disclaimer compact />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search generic name, brand or drug class…"
        className="w-full max-w-md rounded-lg border border-input bg-card px-3 py-2 text-sm"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((m) => {
          const saving = m.brandPrice - m.genericPrice;
          const pct = Math.round((saving / m.brandPrice) * 100);
          return (
            <div key={m.id} className="panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    {m.genericName} {m.dosage}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {m.drugClass} · {m.form} · {m.packSize}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  Jan Aushadhi: {m.janAushadhi}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <Stat label="Branded" value={`₹${m.brandPrice}`} />
                <Stat label="Generic" value={`₹${m.genericPrice}`} />
                <Stat label={`Saving (${pct}%)`} value={`₹${saving}`} highlight />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{m.notes}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Source: {m.source} · last verified {m.lastVerified}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-surface-tint px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`font-semibold ${highlight ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}