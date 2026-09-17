import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Analyse a topic, pasted article or link and get a summary, key insights and practical recommendations generated from your input.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Summaries, insights and recommendations tailored to the source you provide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

type Mode = "topic" | "text" | "url";

const PLACEHOLDERS: Record<Mode, string> = {
  topic: "e.g. How mid-sized accounting firms in South Africa are adopting AI for audit prep",
  text: "Paste the full article, report extract or meeting notes you want analysed…",
  url: "https://example.com/article-you-want-analysed",
};

function ResearchPage() {
  const run = useServerFn(runResearch);
  const [mode, setMode] = useState<Mode>("topic");
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState("");
  const [result, setResult] = useState("");
  const [original, setOriginal] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      run({ data: { mode, content, focus: focus.trim() ? focus : null } }),
    onSuccess: (text: string) => {
      setResult(text);
      setOriginal(text);
    },
    onError: (error: Error) =>
      toast.error(error.message || "The analysis couldn't be generated. Please try again."),
  });

  return (
    <AppShell
      title="AI Research Assistant"
      description="Summaries, insights and recommendations from your source"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="surface-card border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">What should the AI analyse?</CardTitle>
            <CardDescription>Choose an input type, then add your material.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as Mode);
                setContent("");
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="topic" className="flex-1">
                  Topic
                </TabsTrigger>
                <TabsTrigger value="text" className="flex-1">
                  Pasted text
                </TabsTrigger>
                <TabsTrigger value="url" className="flex-1">
                  URL
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="content">
                {mode === "topic" ? "Research topic" : mode === "url" ? "Link" : "Source text"}
              </Label>
              {mode === "url" ? (
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={PLACEHOLDERS.url}
                />
              ) : (
                <Textarea
                  id="content"
                  rows={mode === "text" ? 12 : 4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={PLACEHOLDERS[mode]}
                />
              )}
              {mode === "url" ? (
                <p className="text-xs text-muted-foreground">
                  Pasting the article text gives the most accurate analysis of a specific page.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus">Focus or question (optional)</Label>
              <Input
                id="focus"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g. What does this mean for our Q4 client pricing?"
              />
            </div>

            <Button
              variant="brand"
              size="lg"
              className="w-full"
              disabled={!content.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <Search />}
              {mutation.isPending ? "Analysing…" : "Analyse with AI"}
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Research briefing</CardTitle>
            <CardDescription>Summary, key insights and practical recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <AiOutput
                value={result}
                onChange={setResult}
                original={original}
                label="Briefing"
                rows={22}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
                {mutation.isPending
                  ? "Reading your input and building the briefing…"
                  : "Your briefing will appear here."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
