# MysteryBox — The Database Detective (Restored)

This package restores the original noir front-end, timed case mechanics, sealed clue boxes, suspect/evidence verdict flow, and the complete 20-case data set from the source files available for this project. MongoDB Atlas is used for session storage, game snapshots, and verdict submissions.

## Setup
1. Install Node.js 20.x.
2. Run `npm install`.
3. Copy `.env.example` to `.env`; set `MONGO_URI` (or `MONGODB_URI`) and a random `SESSION_SECRET` with at least 32 characters.
4. Run `npm start`, then visit `http://localhost:3000`.

## Render
Build command: `npm install`; start command: `npm start`. Add `MONGO_URI`, `MONGODB_DB_NAME=mysterybox`, `SESSION_SECRET`, and `NODE_ENV=production` in Render Environment. In Atlas Network Access, allow the Render service outbound IP ranges. URL-encode reserved characters in the database password.

Health check: `GET /api/health`.

## Persistence note
Sessions use `connect-mongo` with `resave: false` and `saveUninitialized: false`. Game snapshots and verdict submissions are written to MongoDB. The original game runtime still uses an in-process active-game map for live timer interactions, so active investigations are not automatically rehydrated after a process restart; persistent records and submissions remain in MongoDB. A fully multi-instance deployment would require moving active game state into MongoDB as the source of truth and adding transactional/concurrency tests.

## Security and verification
Solutions remain server-side in `data/cases.js` and are excluded from public case responses. Do not commit `.env` or share credentials. This package has not been tested against your live Atlas credentials, so a successful connection must be confirmed with `/api/health` after deployment.
