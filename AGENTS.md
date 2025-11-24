# Repository Guidelines

## Project Structure & Module Organization
This template runs on Next.js 16 with the App Router. Route handlers, pages, and layout scaffolding live in `src/app`. Use `src/components` for shareable UI building blocks and co-locate styles when practical. Global providers and wrappers belong in `src/layout`. Static assets (icons, images) go under `public/`. Configuration lives at the repo root (`next.config.ts`, `eslint.config.mjs`, `tsconfig.json`) so update those files when adjusting build or lint behavior.

## Build, Test, and Development Commands
- `pnpm dev` starts the local development server at `http://localhost:3000`.
- `pnpm build` compiles the production bundle.
- `pnpm start` serves the built app; run it after `pnpm build`.
- `pnpm lint` runs ESLint with Tailwind ordering rules; `pnpm lint:fix` applies safe fixes.  
Install dependencies with `pnpm install` before any command; the CI lint workflow uses the same script.

## Coding Style & Naming Conventions
TypeScript and React 19 are the defaults—prefer `.tsx` files for components. ESLint enforces 2-space indentation via `@stylistic/indent` and ensures Tailwind classes follow the canonical order from `better-tailwindcss`. Name React components in PascalCase and hook utilities in camelCase (`useCounter`). Keep server-only files in folders named `server` or `actions` to clarify their runtime. Avoid default exports for shared components to retain IDE auto-import accuracy.

## Testing Guidelines
A dedicated test runner is not wired up yet; please add Vitest + React Testing Library when introducing tests. Place specs alongside source under `src/**` using the `*.test.ts(x)` suffix. Target meaningful coverage for new logic (minimum 80% per module once tests exist) and favor behavioral assertions over snapshot noise. Document any required environment variables in the test file header and gate async tests on stable server mocks.

## Commit & Pull Request Guidelines
Follow the existing Conventional Commit style (`feat:`, `chore:`, `format:`). Scope the message when helpful (`feat(app): add filters`). Before opening a PR, run `pnpm lint` and note results. PR descriptions should include: objective summary, linked issue or ticket, screenshots or Loom for UI changes, and deployment risks. Request at least one review and ensure the lint workflow passes before merging.
