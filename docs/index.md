# Core Tech Stacks

## Core Platform
- `TypeScript v5.8.3` (pinned for stability)

## Electron Platform
- `Electron v37` + `electron-builder v26`
- `@electron-toolkit/utils v4`
- `@electron-toolkit/tsconfig v1`

## Build & Dev Tooling
- `Vite v7` + `Electron-Vite v4`
- `@vitejs/plugin-react v5`

## UI Framework & State
- `React v19`
- `zustand v5`
- `immer v10`

## Styling
- `Tailwind CSS v4`
- `@tailwindcss/vite v4`
- `tailwind-merge v3`

## Validation
- `Zod v3.25.67` (pinned for compatibility)

## Linting & Formatting
- `eslint v9`
- `@typescript-eslint/eslint-plugin v8`
- `@typescript-eslint/parser v8`
- `prettier v3`

## Database & ORM
- `@prisma/client v6`
- `prisma v6`

---

# Directory Design Principles

This section defines how the codebase is structured and the responsibilities of each layer.  
The goal is to keep concerns well separated, enforce safe communication between processes,  
and ensure the code remains maintainable and scalable as the project grows.

## High-Level Structure

- `src/`
  - `main/` : application lifecycle & window management (Electron main process)
    - `shared/` : platform-agnostic code shared across main, preload, and renderer
    - `index.ts` : entry for Electron main process

  - `preload/` : secure bridge between main and renderer (contextIsolation + contextBridge)
    - `index.d.ts` : preload type definitions
    - `index.ts` : preload script entry

  - `renderer/` : UI layer (React + Tailwind, runs in browser context)
    - `index.html` : HTML template
    - `index.tsx` : renderer entry point
    - `src/`
      - `globals.css` : global styling baseline
      - `components/`
        - `ui/` : reusable UI primitives
        - `layout/` : layout components (navigation, shell, etc.)
      - `hooks/` : React hooks (custom logic like useTheme, useShortcut)
      - `stores/` : state management (e.g., zustand slices, context)
      - `lib/` : renderer-side utilities (helpers, constants)
      - `services/` : API calls or IPC-based services
      - `App.tsx` : root React component
- `package.json` : project metadata and scripts
- `package-lock.json` : exact dependency lockfile
- `electron.vite.config.ts` : Vite + Electron build configuration
- `electron-builder.yml` : Electron Builder packaging configuration
- `eslint.config.mjs` : ESLint v9 flat configuration
- `tsconfig.json` : base TypeScript configuration
- `tsconfig.node.json` : Node/Electron main process TypeScript configuration
- `tsconfig.web.json` : renderer/web TypeScript configuration
- `.prettierrc.json` : Prettier configuration
- `.prettierignore` : Prettier ignore patterns

---

# AI Codegen Guardrails
- ESM-only for source. Exception: preload bundle may emit CommonJS to support `sandbox: true`. Do not use CommonJS elsewhere at runtime.
- TypeScript strict; avoid `any`. Prefer Zod schemas for runtime boundaries.
- Keep identifiers, comments, and docs **English-only**. Filenames **kebab-case**.
- Prefer pure functions, explicit return types, and narrow IPC/preload surfaces.
- Don’t introduce new libraries without prior approval; prefer extending existing stack.