# AI Workplace Spark

Build a clean, modern, responsive SaaS-style web application called AI Workplace Productivity Assistant for professionals.

Core Requirement

All generated responses must come from AI dynamically based on the user's input. Do not use hardcoded, generic, placeholder, or pre-written responses. Each feature must process the user's specific input and generate a relevant response using an AI model/API.

Features

1. Smart Email Generator

User enters the purpose, recipient/context, and key points.

AI generates a complete professional email based on the user's input.

Tone options: Formal, Friendly, Persuasive.

Generated email must be editable and copyable.

2. AI Research Assistant

User can enter a research topic, paste text/article content, or provide a URL.

AI analyses the provided input and generates:

Summary

Key insights

Practical recommendations

Responses must be specific to the user's input and not generic.

Results must be editable and copyable.

3. AI Task Planner

User enters their tasks, deadlines, priorities, and available time.

AI generates a personalised daily or weekly schedule based on the information provided.

AI should prioritise tasks according to urgency, importance, deadlines, and available time.

Generated schedule must be editable.

Dashboard & Design

Modern professional dashboard with sidebar navigation.

Responsive desktop, tablet, and mobile design.

Clean SaaS-style interface.

Colour palette: raspberry/pink-purple luxury accent + light blue + medium blue, with subtle gradients.

Use professional cards, forms, buttons, icons, and clear typography.

Dashboard sections: Home, Email Generator, Research Assistant, Task Planner.

Technical Constraints

Frontend-only application.

No custom backend, database, authentication, or persistent data storage.

Do not save user inputs or AI outputs.

Use an appropriate AI API/integration to generate responses dynamically.

Keep API keys secure and do not expose secret keys in client-side code.

Avoid unnecessary features or complexity.

Responsible AI

Include a visible disclaimer:

“AI-generated content may contain errors or omissions. Always review, verify, and edit AI outputs before using them for professional communication, research, or decision-making.”

The final application should feel like a real AI productivity tool, not a static demo. Every AI response must be dynamically generated from the user's specific input.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/188274e1-c54a-4bbf-a979-5e2f49498f30).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
