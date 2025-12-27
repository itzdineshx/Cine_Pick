# Copilot instructions for CinePick

## Stack + local workflow
- Vite + React 18 + TypeScript. Dev server is configured for port `8080` (see `vite.config.ts`).
- Use npm scripts from `package.json`:
  - `npm run dev` (Vite)
  - `npm run build` / `npm run preview`
  - `npm run lint`
- Path alias: `@` maps to `./src` (see `vite.config.ts`). Prefer imports like `@/services/tmdb`.

## Big-picture architecture
- Routing is in `src/App.tsx` via `react-router-dom`:
  - `/` -> `src/pages/Index.tsx`
  - `/search` -> `src/pages/Search.tsx`
  - `/battle` -> `src/pages/Battle.tsx`
- Movie data flow is:
  - Page/UI -> `src/services/tmdb.ts` (public API/re-exports) -> `src/services/movie-service.ts` -> `src/services/api-client.ts`
  - `ApiClient` prefers the Supabase Edge Function endpoint `POST /functions/v1/tmdb-api` and falls back to direct TMDb HTTP.

## Supabase Edge Function contract
- Edge Function implementation: `supabase/functions/tmdb-api/index.ts`.
- Request shape: `POST` JSON `{ action, filters?, movieId? }`.
- If you add a new “action”, update BOTH:
  - the switch in `supabase/functions/tmdb-api/index.ts`
  - the fallback switch in `src/services/api-client.ts`

## Project-specific conventions
- Errors are generally handled by returning safe empty values (e.g. `[]` / empty `MovieResponse`) and showing a toast (see `src/pages/Index.tsx`, `src/pages/Search.tsx`).
- Persistence uses localStorage-backed hooks:
  - `src/hooks/useLocalStorage.ts` is the base hook
  - `src/hooks/useFavorites.ts`, `src/hooks/useWatchlist.ts`, `src/hooks/useSearchHistory.ts` store under `cinepick-*` keys.

## UI + styling
- UI primitives are shadcn/ui components in `src/components/ui/*` (see `components.json`).
- Theme is driven by Tailwind + CSS variables (HSL) in `src/index.css` and `tailwind.config.ts`.
  - Don’t hardcode new hex colors; use existing tokens/classes (e.g. `bg-background`, `text-primary`, `text-cinema-gold`).

## PWA/service worker gotcha (dev)
- The service worker is registered in `src/pages/Index.tsx` and implemented in `public/sw.js` (cache-first for GET).
- When debugging Vite/HMR issues, the SW can interfere with `@vite/*` / `@react-refresh` requests.
  - Prefer guarding registration behind `import.meta.env.PROD` or unregistering the SW in the browser during development.
