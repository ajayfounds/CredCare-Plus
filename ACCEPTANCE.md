# CredCare v9 — acceptance results

| # | Check | Result |
|---|---|---|
| 1 | `npm run build`, `npm run lint`, `tsc --noEmit` | Pass, zero errors (npm used; pnpm not installed) |
| 2 | Visual diff, 58 frames at 390 px (`tools/shots.mjs`, `tools/diff.mjs`) | Pass: max 1.81 % pixels differ, median 0.82 % |
| 3 | Playwright interaction tests (14) | Pass |
| 4 | `npm run audit:design` | Pass: 0 raw colours, 0 off-scale spacing, ≤ 6 type sizes, 0 low-contrast text, graphics ≥ 3:1, 0 targets < 44, no overflow |
| 5 | axe-core: Home, Analysis, Actions, Pay sheet, Verify | Pass (see note) |
| 6 | Reduced motion / reduced transparency | Pass |
| 7 | 200 % text on Home, Pay, Actions (`tools/zoom.mjs`) | Pass, nothing clipped |
| 8 | Lighthouse `/home` | Performance 97, Accessibility 100, Best practices 100 |

## Intentional differences from the frames
- Week underline centred (frames had it 2 px off after the 4 px snap pass).
- Task titles wrap instead of truncating, so 200 % text never clips (identical at 100 %).
- Article read-bar counts are computed per category from `data.ts` (frames typed "of 3"/"of 4").
- Actions badge counts open tasks from data (4); the frame said 3.
- Page insets and clearances (56/60/64/120/128/140 px) are named layout tokens in `styles/tokens.css`.
- Rejected upload size (8.4 MB) added to `data.ts`; it existed only in the frame.
- Week-day buttons keep the spec's names ("Mon 2 Feb, …"); axe's experimental label-in-name rule is filtered for them only.
- Facet field ships as the frames' precomputed geometry; the handoff contains no generator.
