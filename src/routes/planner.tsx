import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content:
          "Enter your tasks, deadlines, priorities and available time to get an AI-built daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — Workplace AI" },
      {
        property: "og:description",
        content: "A prioritised, time-blocked schedule generated from your real workload.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

type Horizon = "Daily" | "Weekly";

function PlannerPage() {
  const run = useServerFn(generatePlan);
  const [tasks, setTasks] = useState("");
  const [availability, setAvailability] = useState("");
  const [notes, setNotes] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("Weekly");
  const [plan, setPlan] = useState("");
  const [original, setOriginal] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      run({
        data: { tasks, availability, horizon, notes: notes.trim() ? notes : null },
      }),
    onSuccess: (text: string) => {
      setPlan(text);
      setOriginal(text);
    },
    onError: (error: Error) =>
      toast.error(error.message || "The schedule couldn't be generated. Please try again."),
  });

  const ready = tasks.trim() && availability.trim();

  return (
    <AppShell
      title="AI Task Planner"
      description="A prioritised schedule built around your deadlines and hours"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="surface-card border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Your workload</CardTitle>
            <CardDescription>
              List each task with its deadline and priority so the AI can sequence them properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks, deadlines & priorities</Label>
              <Textarea
                id="tasks"
                rows={9}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={"e.g.\n- Board pack draft — due Friday — high — ~6h\n- Client onboarding calls (3) — Wed/Thu — medium — 1h each\n- Expense claims — end of month — low — 45min"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Available time</Label>
              <Textarea
                id="availability"
                rows={3}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Mon–Fri 08:30–17:00, standup 09:00 daily, Wednesday afternoon blocked, no evening work"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Constraints & preferences (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Deep work best in the morning; keep Friday afternoon light"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horizon">Plan horizon</Label>
              <Select value={horizon} onValueChange={(v) => setHorizon(v as Horizon)}>
                <SelectTrigger id="horizon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily schedule</SelectItem>
                  <SelectItem value="Weekly">Weekly schedule</SelectItem>
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
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <CalendarClock />}
              {mutation.isPending ? "Building your schedule…" : "Generate schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Your schedule</CardTitle>
            <CardDescription>Time-blocked, prioritised and fully editable.</CardDescription>
          </CardHeader>
          <CardContent>
            {plan ? (
              <AiOutput
                value={plan}
                onChange={setPlan}
                original={original}
                label="Schedule"
                rows={24}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
                {mutation.isPending
                  ? "Prioritising your tasks against your available time…"
                  : "Your generated schedule will appear here."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
