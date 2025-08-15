## Zod versions – resolution memo (future-proofing)

This memo records how we unified Zod versions across the workspace and why. It should help future updates when package ecosystems move.

### Background

- We use Zod for schema validation in several stacks:
  - LM Studio SDK (`@lmstudio/sdk`) → Zod v3
  - LangChain packages → Zod v3
  - MCP SDK → Zod v3
  - OpenAI Agents (`@openai/agents` and friends) → expects Zod v3 within a specific range
- Initial state had root `zod@^4.x` which caused npm peer-resolution errors and duplicate trees.

### Investigation

Commands run:

```bash
npm ls zod | cat
```

Findings (summarized):
- Most libraries wanted Zod v3.25.x.
- `@openai/agents` subtree peer range required 3.25.40–3.25.67.
- LM Studio SDK, LangChain, and others worked with 3.25.76, but that exceeded the agents peer range and produced ELSPROBLEMS.

### Resolution steps

1) Pin root Zod to a modern v3 (attempt):

```json
"zod": "3.25.76"
```

2) Attempted npm overrides to satisfy `@openai/agents` subtree with 3.25.67 while keeping 3.25.76 at root. This reduced but didn’t remove ELSPROBLEMS reliably.

3) Final alignment: pin root Zod to `3.25.67`, which satisfies the strictest peer range (agents) while remaining compatible with LM Studio SDK and LangChain.

```json
"zod": "3.25.67"
```

4) Reinstall and verify:

```bash
npm install --no-audit --no-fund | cat
npm ls zod | cat
```

Result: all consumers deduped to `zod@3.25.67`; no npm ELSPROBLEMS.

### Why 3.25.67?

- It matches `@openai/agents` required peer range (3.25.40–3.25.67), while remaining compatible with LM Studio SDK and LangChain which accept 3.25.x.

### Guidance going forward

- If `@openai/agents` updates its peer range, consider bumping root Zod accordingly.
- Prefer a single Zod major (v3) across the project. Avoid Zod v4 unless all dependents support it.
- When adding new packages, check their Zod peer requirements and run `npm ls zod` to verify.

### Notes on SDK tool definitions

- With Zod unified on v3.25.67, it’s safe to use `@lmstudio/sdk` `tool({ parameters: { a: z.number(), ... }})` so the SDK derives JSON Schema directly from Zod.
- If version skew reappears, fallback to `rawFunctionTool` with explicit JSON Schema to decouple runtime parser versions.


