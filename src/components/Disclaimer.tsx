import { ShieldAlert } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" />
      <p className="text-foreground/85">
        <strong className="font-semibold">AI-generated decision support only.</strong> This prototype
        does not diagnose disease and does not prescribe medicines. Model outputs are probabilistic
        patterns from a synthetic demonstration cohort plus documented rules, are not clinically
        validated, and must be reviewed by a qualified healthcare professional who makes the final
        treatment decision.
        {!compact && (
          <>
            {" "}
            Medicine prices and facility service lists are illustrative configurable data, not live
            feeds — verify locally before counselling a patient.
          </>
        )}
      </p>
    </div>
  );
}