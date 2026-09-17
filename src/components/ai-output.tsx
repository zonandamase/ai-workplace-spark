import { useEffect, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AiOutput({
  value,
  onChange,
  original,
  label,
  rows = 18,
}: {
  value: string;
  onChange: (next: string) => void;
  original: string;
  label: string;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser. Select the text and copy manually.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onChange(original)} disabled={value === original}>
            <RotateCcw /> Reset edits
          </Button>
          <Button variant="soft" size="sm" onClick={copy}>
            {copied ? <Check /> : <Copy />} Copy
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck
        className="resize-y bg-card font-sans text-sm leading-relaxed whitespace-pre-wrap"
      />
      <p className="text-xs text-muted-foreground">
        Fully editable — refine the wording before you use it.
      </p>
    </div>
  );
}
