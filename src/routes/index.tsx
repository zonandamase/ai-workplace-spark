import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, CalendarClock, ArrowRight, ShieldCheck, Zap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — AI Productivity Assistant for Professionals" },
      {
        name: "description",
        content:
          "Generate professional emails, research briefings, and prioritised schedules from your own inputs with AI.",
      },
      { property: "og:title", content: "Workplace AI — AI Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Emails, research analysis, and task planning generated dynamically from what you type.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a purpose, a recipient and a few bullet points into a polished, ready-to-send email in the tone you choose.",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Paste an article, drop a link or name a topic, and get a summary, key insights and practical recommendations.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Share your tasks, deadlines and available hours to get a realistic, prioritised daily or weekly schedule.",
  },
] as const;

function Home() {
  return (
    <AppShell
      title="Home"
      description="Your AI workspace for writing, research and planning"
    >
      <section className="overflow-hidden rounded-3xl bg-gradient-brand px-6 py-10 text-primary-foreground shadow-[var(--shadow-glow)] sm:px-10 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-80">
          AI Workplace Productivity Assistant
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold sm:text-4xl">
          Do your best work faster — with AI that responds to your actual input.
        </h2>
        <p className="mt-4 max-w-xl text-sm/relaxed opacity-90">
          Three focused tools for professionals: write email, digest research, and plan your week.
          Every result is generated live from what you provide — nothing canned, nothing stored.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link to="/email">
              Write an email <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/planner">Plan my week</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, body }) => (
          <Card key={to} className="surface-card border-0 shadow-none">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <CardTitle className="mt-3 text-base">{title}</CardTitle>
              <CardDescription>{body}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" size="sm" className="px-0 text-primary hover:bg-transparent hover:underline">
                <Link to={to}>
                  Open <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="surface-card border-0 shadow-none">
          <CardHeader className="flex-row items-start gap-3 space-y-0">
            <Zap className="mt-0.5 size-5 text-primary" />
            <div>
              <CardTitle className="text-sm">Always generated live</CardTitle>
              <CardDescription>
                Each result is produced by an AI model from your specific words — no templates or
                sample text.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="surface-card border-0 shadow-none">
          <CardHeader className="flex-row items-start gap-3 space-y-0">
            <ShieldCheck className="mt-0.5 size-5 text-primary" />
            <div>
              <CardTitle className="text-sm">Nothing is saved</CardTitle>
              <CardDescription>
                No accounts, no database. Your inputs and outputs disappear when you close the tab.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </section>
    </AppShell>
  );
}
