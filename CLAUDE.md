# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS v11 starter project using TypeScript, with Express as the HTTP platform. Package manager is **pnpm**.

## Commands

```bash
pnpm install              # Install dependencies
pnpm run build            # Compile (nest build, outputs to dist/)
pnpm run start:dev        # Dev server with watch mode
pnpm run lint             # ESLint with auto-fix
pnpm run format           # Prettier formatting
pnpm run test             # Unit tests (Jest, files matching *.spec.ts in src/)
pnpm run test -- --testPathPattern=app.controller  # Run a single test file
pnpm run test:e2e         # E2E tests (Jest, config in test/jest-e2e.json)
pnpm run test:cov         # Unit tests with coverage
```

## Architecture

Standard NestJS module structure — each feature should have its own module with controllers, services, and spec files co-located in `src/`.

- Entry point: `src/main.ts` — bootstraps the app on `process.env.PORT` or 3000
- Root module: `src/app.module.ts`
- E2E tests live in `test/` with `*.e2e-spec.ts` naming

## Code Style

- TypeScript with `nodenext` module resolution, target ES2023
- Prettier: single quotes, trailing commas
- ESLint: flat config (`eslint.config.mjs`), `@typescript-eslint/no-explicit-any` is off, `no-floating-promises` and `no-unsafe-argument` are warnings
