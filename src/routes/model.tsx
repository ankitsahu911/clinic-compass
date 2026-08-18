import { createFileRoute } from "@tanstack/react-router";

import { Disclaimer } from "@/components/Disclaimer";
import { MODEL_VERSION, modelEvaluation } from "@/lib/model";

export const Route = createFileRoute("/model")({
  head: () => ({
    meta: [
      { title: "Model Performance & Evaluation — CareAssist" },
      {
        name: "description",
        content:
          "Accuracy, precision, recall, F1, ROC-AUC and confusion matrix for the synthetic-cohort Type 2 Diabetes control-risk model, with stated limitations.",
      },
      { property: "og:title", content: "Model Performance & Evaluation — CareAssist" },
      {
        property: "og:description",
        content: "Evaluation metrics and documented limitations of the prototype risk model.",
      },
    ],
  }),
  component: ModelPage,
});

function ModelPage() {
  const { confusionMatrix: cm } = modelEvaluation;
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Model performance</h1>
        <p className="text-sm text-muted-foreground">
          Deployed version <code className="rounded bg-secondary px-1.5 py-0.5">{MODEL_VERSION}</code>
        </p>
      </header>

      <Disclaimer compact />

      <section className="panel space-y-2 text-sm">
        <p>
          <strong>Task:</strong> {modelEvaluation.task}
        </p>
        <p>
          <strong>Dataset:</strong> {modelEvaluation.dataset}
        </p>
        <p>
          <strong>Features:</strong> HbA1c, previous treatment response, BMI, duration of diabetes,
          fasting glucose, systolic BP, age, eGFR (standardised).
        </p>
        <p>
          <strong>Why this target:</strong> no treatment-outcome labels are available, so the model
          predicts a defensible control-risk outcome. Treatment options are produced by documented
          rules using that risk — no fabricated response labels are used anywhere.
        </p>
      </section>

      <section className="panel">
        <h2 className="text-base font-semibold">Held-out test split (n = 800)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                {["Model", "Accuracy", "Precision", "Recall", "F1", "ROC-AUC"].map((h) => (
                  <th key={h} className="border-b border-border pb-2 pr-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modelEvaluation.models.map((m) => (
                <tr key={m.name} className="border-b border-border/60">
                  <td className="py-2 pr-4">
                    {m.name}
                    {m.deployed && (
                      <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground">
                        deployed
                      </span>
                    )}
                  </td>
                  {[m.accuracy, m.precision, m.recall, m.f1, m.rocAuc].map((v, i) => (
                    <td key={i} className="py-2 pr-4">
                      {(v * 100).toFixed(1)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="panel">
          <h2 className="text-base font-semibold">Confusion matrix</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <span />
            <span className="text-xs text-muted-foreground">Pred. controlled</span>
            <span className="text-xs text-muted-foreground">Pred. poor control</span>
            <span className="text-xs text-muted-foreground">Actual controlled</span>
            <span className="rounded-lg bg-success/12 py-3 font-medium">{cm.tn}</span>
            <span className="rounded-lg bg-surface-tint py-3">{cm.fp}</span>
            <span className="text-xs text-muted-foreground">Actual poor control</span>
            <span className="rounded-lg bg-surface-tint py-3">{cm.fn}</span>
            <span className="rounded-lg bg-success/12 py-3 font-medium">{cm.tp}</span>
          </div>
        </div>
        <div className="panel">
          <h2 className="text-base font-semibold">Limitations</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {modelEvaluation.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}