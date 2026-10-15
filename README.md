# MysteryBox — The Database Detective

This package keeps the existing MysteryBox frontend and API contracts intact while adding MongoDB persistence for case definitions, active/completed investigations, verdict submissions, and Express sessions.

## What changed

- `lib/db.js` — MongoDB client singleton with connection pooling and graceful close handling.
- `server.js` — existing API routes and response shapes retained; case records are seeded into MongoDB; investigation state and verdict submissions are persisted; sessions use MongoDB in production; Render proxy handling is configured.
- `package.json` — adds `mongodb` and `connect-mongo`.
- `.env.example` — documents required configuration.
- `public/index.html`, `public/styles.css`, `public/app.js`, and `data/cases.js` are the supplied versions and have not been changed.

## Collections

| Collection | Purpose | Important fields / indexes |
|---|---|---|
| `cases` | Canonical authored cases, including server-side solutions | `_id` is the case ID; unique index on `number` |
| `investigations` | Current game state and completed results | `_id` is the game ID; indexed by `sessionId`, `status`, and score |
| `submissions` | Each verdict submission and its result | `gameId`, `sessionId`, `caseId`, `suspectId`, `evidenceIds`, result; indexed by `gameId` and creation time |
| `sessions` | Express session records | Managed by `connect-mongo`, expires after the session TTL |

Case records are seeded/upserted from `data/cases.js` on startup. The solution remains excluded from public API responses. Browser-only preferences and the existing career UI state continue to use `localStorage` so the frontend behavior is unchanged. Active investigations, submitted verdicts, leaderboard source records, and sessions persist in MongoDB when configured.

## Configure MongoDB Atlas

1. Create a MongoDB Atlas cluster and a database user.
2. In Atlas Network Access, allow your deployment to connect. Prefer a restricted IP range where practical; `0.0.0.0/0` allows all IPs and should only be used when you understand the tradeoff.
3. Copy the **Node.js** connection string and replace the placeholders with your database user's credentials.
4. Set these environment variables locally or in Render:

```env
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster-host>/mysterybox?retryWrites=true&w=majority
MONGODB_DB_NAME=mysterybox
MONGODB_MAX_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
SESSION_SECRET=<random-secret-at-least-32-characters>
NODE_ENV=production
```

Do not commit your real `.env` file or database password. URL-encode special characters in the database username/password if required by the connection string.

## Run locally

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# Edit .env and set a real MONGODB_URI and SESSION_SECRET
npm start
```

Open `http://localhost:3000`. When `MONGODB_URI` is not set in development, the server uses its in-memory fallback so the existing game can still be run locally. Production intentionally refuses to start without MongoDB configured.

## Deploy to Render

1. Commit the changed files to the existing GitHub repository.
2. In the existing Render Web Service, add `MONGODB_URI`, `MONGODB_DB_NAME`, and `SESSION_SECRET` under **Environment**. Set `NODE_ENV=production` if it is not already set.
3. Keep the existing build/start commands (`npm install` / `npm start`).
4. Save changes and wait for Render to deploy. No new Render service or URL is needed.
5. Test `/api/health`, start Case 001, open a clue, and submit a test verdict.

## Existing API contract

- `GET /api/health`
- `GET /api/cases`
- `GET /api/cases/:id`
- `POST /api/game/start` `{ "caseId": "case-01" }`
- `GET /api/game/state`
- `POST /api/game/clue` `{ "clueId": "case-01-clue-1" }`
- `POST /api/game/hint`
- `POST /api/game/accuse` `{ "suspectId": "...", "evidenceIds": [] }`
- `GET /api/leaderboard`

The frontend, route paths, request bodies, response shapes, scoring, clue costs, timer, and verdict behavior are intentionally preserved.

## Operational notes

- Active investigations are stored in MongoDB and associated with a MongoDB-backed Express session. A browser needs its existing session cookie to resume that investigation.
- The in-memory fallback is for local development only. Production requires MongoDB.
- The original frontend progress/preferences remain in browser `localStorage` to avoid UI/API changes. They are browser-specific and are not a user account system.
- For higher-concurrency production use, consider conditional/atomic updates for game actions and integration tests around concurrent clue/verdict requests.
