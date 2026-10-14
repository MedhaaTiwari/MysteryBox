# MysteryBox — The Database Detective

A noir-themed, browser-based deduction game with 20 mystery cases, sealed clue boxes, timed investigations, server-side verdict validation, progressive case unlocks, stars, and local high-score persistence.

## Run locally

Requires Node.js 20+.

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- 20 case files, from Easy to Master Detective.
- Four evidence boxes per case; opening a box costs 18 seconds and 80 points.
- Three verdict attempts per case.
- Suspect profiles and alibis.
- Progressive hints, score calculation, case debriefs, and next-case unlocks.
- LocalStorage progress: unlocked cases, completions, stars, high scores, and pinned evidence.
- Session-backed server state and protected solution data.

## API

- `GET /api/cases`
- `GET /api/cases/:id`
- `POST /api/game/start` `{ "caseId": "case-01" }`
- `GET /api/game/state`
- `POST /api/game/clue` `{ "clueId": "case-01-clue-1" }`
- `POST /api/game/hint`
- `POST /api/game/accuse` `{ "suspectId": "...", "evidenceIds": [] }`
- `GET /api/leaderboard`

## Important limitations before public production

The canonical answers are server-side in `data/cases.js`, not bundled to the browser. However, the game-state store and leaderboard are in-memory, so a server restart clears active games and multiple instances will not share state. LocalStorage progress is browser-local and is not tamper-proof. For public production, move sessions/game state/results to a database, make clue unlocks and accusations atomic, add CSRF protection appropriate to the deployment, configure a strict Content Security Policy, add automated tests and monitoring, and audit every case's deduction chain. The 20 cases are a playable authored draft; review their narrative fairness before academic submission or public release.

## Research extension

Add an indexed-vs-unindexed MongoDB benchmark with reproducible data, warm-up runs, median/p95 latency, execution statistics, and documented environment. Never invent benchmark results.
