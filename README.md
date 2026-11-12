# CredCare

A credit-score recovery app for people in India with a falling CIBIL score and debt stress. It shows what pulled the score down, then works through a 180-day plan, one payment at a time.

The design language is "the passbook": ruled entries, stamps, receipts and a printer loader, in one ink-blue hue. Words are set in Manrope and figures in IBM Plex Mono.

This repo is the production build of the **CredCare v9** design handoff. It ports all 58 product frames faithfully: same layout, same CSS, same interactions.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- No CSS framework. Global `styles/tokens.css` and `styles/app.css` (the frames' component CSS, copied in), plus one scoped stylesheet per screen and CSS Modules for new components.
- [`motion`](https://motion.dev) for springs, drag and layout animation; the frames' CSS keyframes for entrances
- One `AppProvider` (context + `useReducer`) for session state: pay, completeTask, undo, submitDispute, startUpload, setAutopay
- No backend: `lib/data.ts` is the API boundary. Swap it for a fetch layer that returns the same shapes and no component needs to change.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run build` / `npm start` | Production build and server |
| `npm run lint`, `npm run typecheck` | ESLint, TypeScript |
| `npm run test:e2e` | Playwright: interactions, axe, reduced motion and transparency |
| `npm run audit:design` | Raw colours, spacing scale, type sizes, contrast, tap targets, overflow (needs the app on :3010) |
| `npm run audit:screens` | Renders every frame's route at 390 px into `audit/screens` and side-by-side comparisons |
| `npm run audit:zoom` | 200 % text check on Home, Pay and Actions |

To see a state frame, add `?state=` to its route, for example `/home?state=offline`, `/actions?sheet=pay&stage=success` or `/verify?state=otp`. The full map is in `tools/routes.mjs`.

## Where things are

```
app/                 routes; (tabs) holds Home, Recovery, Actions, Learn, Profile and the tab bar
components/screens/  one component + scoped stylesheet per screen, ported from the frames
components/{card,chart,plan,home,list,ui}/   PaymentCard, ScoreSlider, PhaseStack, WeekStrip, SwipeRow, HoldButton, Sheet…
lib/                 data.ts (mock), model.ts, plan.ts, store.tsx, motion.ts, session.ts, format.ts
styles/              tokens.css, app.css (from the frames), shell.css (phone frame, overlays, transitions)
design/              tokens.json and components.json from the handoff
tools/               porting aids, the screenshot diff and the audits
tests/               Playwright specs
```

The design handoff (reference frames, PNGs and specs) lives outside this repo, in `credcare-v9-handoff/`.

## Acceptance

All checks pass. Details and every intentional difference from the frames are in [ACCEPTANCE.md](ACCEPTANCE.md).

- Build, lint and TypeScript: clean
- Visual diff across all 58 frames: worst 1.81 % of pixels differ, median 0.82 %
- 14 interaction tests, axe on 5 pages, reduced motion, reduced transparency: all pass
- Design audit: zero failures
- Lighthouse on `/home`: performance 97, accessibility 100, best practices 100

## Live URL

**https://credcare-plus.vercel.app**, deployed on Vercel with the Next.js preset and no environment variables. All 21 Playwright tests also pass against it: `BASE_URL=https://credcare-plus.vercel.app npm run test:e2e`.
