import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Describe the purpose, recipient and key points, and let AI write a complete professional email in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "AI-written professional emails generated from your own brief.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [draft, setDraft] = useState("");
  const [original, setOriginal] = useState("");

  const mutation = useMutation({
    mutationFn: () => run({ data: { purpose, context, keyPoints, tone } }),
    onSuccess: (text: string) => {
      setDraft(text);
      setOriginal(text);
    },
    onError: (error: Error) =>
      toast.error(error.message || "The email couldn't be generated. Please try again."),
  });

  const ready = purpose.trim() && context.trim() && keyPoints.trim();

  return (
    <AppShell
      title="Smart Email Generator"
      description="Brief the AI once and get a send-ready email"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="surface-card border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Your brief</CardTitle>
            <CardDescription>
              The more specific you are, the more usable the email will be.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of the email</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a two-week extension on the audit report"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Recipient & context</Label>
              <Textarea
                id="context"
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Thandi Mokoena, our external auditor. We've worked together for two years; last check-in was Monday."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points to cover</Label>
              <Textarea
                id="points"
                rows={6}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={"e.g.\n- Two team members were on leave\n- Draft ready 30 September\n- Offer a call on Thursday"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="brand"
              size="lg"
              className="w-full"
              disabled={!ready || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {mutation.isPending ? "Writing your email…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Generated email</CardTitle>
            <CardDescription>Edit freely, then copy it into your mail client.</CardDescription>
          </CardHeader>
          <CardContent>
            {draft ? (
              <AiOutput value={draft} onChange={setDraft} original={original} label="Email draft" />
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
                {mutation.isPending
                  ? "The AI is drafting your email…"
                  : "Your generated email will appear here."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
