# MysteryBox — MongoDB integration

This version adds MongoDB Atlas persistence while retaining the existing frontend and case data.

## Collections
- `cases`: case narratives, suspects, clue records, and protected solutions
- `investigations`: persistent active and completed game sessions
- `submissions`: each submitted verdict and selected evidence
- `players`: per-browser-session aggregate statistics

Indexes are created on startup. On first startup, the 20 local case records in `data/cases.js` are inserted into `cases`. Existing case documents are not overwritten.

## Required environment variables
- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB_NAME`: database name (defaults to `mysterybox`)
- `SESSION_SECRET`: random secret of at least 32 characters in production
- `PORT`: provided by Render; optional locally

## Run locally
1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and fill in your Atlas connection string and secret.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.
6. Test `http://localhost:3000/api/health`; it should report `database: connected`.

Do not commit `.env` or your real connection string.

## Render
Set `MONGODB_URI`, `MONGODB_DB_NAME`, and `SESSION_SECRET` under Render → your Web Service → Environment. Add the Render outbound network access to Atlas Network Access. If using Atlas IP allowlisting, Render's outbound IPs may vary by plan; consult current Render/Atlas guidance rather than assuming one fixed address.

## Notes
- MongoDB now stores cases, active/completed investigations, verdict submissions, and aggregate player stats.
- Express's default session store remains in-memory. Active game data is in MongoDB but the browser session cookie is still needed to associate a player with a game. For stronger production persistence, use a Mongo-backed Express session store as a follow-up.
- Browser-side career unlocks and pinned evidence remain in localStorage to preserve the current frontend behavior.
- Never expose MongoDB credentials in frontend files.
