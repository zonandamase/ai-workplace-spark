import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { createResponsesProvider, responsesProviderOptions } from "./ai-gateway.server";

const MODEL = "openai/gpt-6-astra";

async function generate(system: string, prompt: string) {
  const lovable = createResponsesProvider();
  const result = streamText({
    model: lovable.responses(MODEL),
    system,
    prompt,
    providerOptions: responsesProviderOptions as never,
  });
  const text = (await result.text).trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

/* ---------------- Email generator ---------------- */

const EmailInput = z.object({
  purpose: z.string().min(1).max(2000),
  context: z.string().min(1).max(2000),
  keyPoints: z.string().min(1).max(4000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    generate(
      "You are an expert business communication writer. Write complete, ready-to-send professional emails. Output only the email: a 'Subject:' line, then the body with greeting, paragraphs and sign-off. No commentary, no markdown fences, no placeholders unless a detail is genuinely missing (then use [square brackets]).",
      `Tone: ${data.tone}\n\nPurpose of the email:\n${data.purpose}\n\nRecipient and context:\n${data.context}\n\nKey points that must be covered:\n${data.keyPoints}`,
    ),
  );

/* ---------------- Research assistant ---------------- */

const ResearchInput = z.object({
  mode: z.enum(["topic", "text", "url"]),
  content: z.string().min(1).max(20000),
  focus: z.string().max(1000).nullable(),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const label =
      data.mode === "topic"
        ? "Research topic"
        : data.mode === "url"
          ? "URL to analyse (rely on what you know about this page/source and state uncertainty where relevant)"
          : "Pasted source text to analyse";

    return generate(
      "You are a rigorous research analyst. Analyse the specific input given and respond in plain text with exactly three sections, in this order and with these headings: 'SUMMARY', 'KEY INSIGHTS' (numbered), 'PRACTICAL RECOMMENDATIONS' (numbered, actionable). Ground everything in the supplied input, reference its specifics, and never produce generic filler. Flag anything uncertain or missing from the input.",
      `${label}:\n${data.content}${data.focus ? `\n\nSpecific angle the reader cares about:\n${data.focus}` : ""}`,
    );
  });

/* ---------------- Task planner ---------------- */

const PlannerInput = z.object({
  tasks: z.string().min(1).max(6000),
  availability: z.string().min(1).max(2000),
  horizon: z.enum(["Daily", "Weekly"]),
  notes: z.string().max(2000).nullable(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) =>
    generate(
      "You are an expert productivity coach and scheduler. Build a realistic, time-blocked schedule from the user's actual tasks, deadlines, priorities and available time. Prioritise by urgency, importance, deadline proximity and effort, and never exceed the stated availability. Plain text only: time-blocked schedule first (grouped by day for weekly plans), then a short 'PRIORITY RATIONALE' section, then 'RISKS & TRADE-OFFS' naming anything that will not fit.",
      `Plan horizon: ${data.horizon}\n\nTasks, deadlines and priorities:\n${data.tasks}\n\nAvailable time / working hours:\n${data.availability}${data.notes ? `\n\nOther constraints and preferences:\n${data.notes}` : ""}`,
    ),
  );
