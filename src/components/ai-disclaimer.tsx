import { AlertTriangle } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        AI-generated content may contain errors or omissions. Always review, verify, and edit AI
        outputs before using them for professional communication, research, or decision-making.
      </p>
    </div>
  );
}
