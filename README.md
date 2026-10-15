# MysteryBox — The Database Detective

A noir-style browser deduction game backed by MongoDB Atlas. Express serves the frontend and API; MongoDB stores cases, investigation progress, verdict submissions, and persistent sessions.

## Requirements
- Node.js 20.x
- MongoDB Atlas deployment or another MongoDB connection string

## Local setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`.
3. Set `MONGO_URI` (or `MONGODB_URI`) to your MongoDB connection string.
4. Set `SESSION_SECRET` to a long, random secret.
5. Run `npm start`.
6. Open `http://localhost:3000`.

Never commit `.env` or share database credentials.

## Render deployment
1. Push the repository to GitHub.
2. Create or use a Render Web Service connected to the repository's `main` branch.
3. Build command: `npm install`; start command: `npm start`.
4. Add Render environment variables:
   - `MONGO_URI`: full Atlas URI (URL-encode special characters in the password).
   - `MONGODB_DB_NAME`: database name, e.g. `mysterybox`.
   - `SESSION_SECRET`: long random secret.
   - `NODE_ENV`: `production`.
5. In Atlas Network Access, allow the Render service's outbound IP addresses. Avoid leaving `0.0.0.0/0` enabled. Confirm the Atlas database user and password are correct.
6. Wait for deployment and test `/api/health`. It returns HTTP 200 when connected.

## Environment variables
- `MONGO_URI` or `MONGODB_URI` (required)
- `SESSION_SECRET` (required)
- `MONGODB_DB_NAME` (optional; defaults to `mysterybox`)
- `PORT` (optional; defaults to 3000)

## API endpoints
- `GET /api/health`
- `GET /api/cases`
- `POST /api/game/start` with `{ "caseId": 1 }`
- `POST /api/game/clue` with `{ "caseId": 1, "clueTitle": "Wet Footprints" }`
- `POST /api/game/accuse` with `{ "caseId": 1, "suspect": "Mara Finch", "evidence": ["Camera Gap", "Ink Smudge"] }`
- `GET /api/game/progress`

## Case data
Two demonstration cases are included. `data/cases.js` seeds missing cases into MongoDB without overwriting existing case records. Add the remaining cases there before treating the project as a 20-case game.

## Production notes
- Sessions are stored in MongoDB via `connect-mongo`; Express MemoryStore is not used.
- The solution field is excluded from public case responses.
- This is a deployment-ready starter, not a claim of a completed security audit. Before public production use, add rate limiting, CSRF protection if introducing cookie-authenticated state-changing endpoints, automated tests, centralized logging, a durable session store policy, and a proper error/monitoring service. Keep dependencies patched.
