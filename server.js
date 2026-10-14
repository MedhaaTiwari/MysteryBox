const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("node:path");
const crypto = require("node:crypto");
const { CASES } = require("./data/cases");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "local-dev-only-change-this-secret-32chars");
if (process.env.NODE_ENV === "production" && SESSION_SECRET.length < 32) {
  throw new Error("Set SESSION_SECRET to a random value of at least 32 characters in production.");
}
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(session({
  name: "mysterybox.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 1000 * 60 * 60 * 8 }
}));
app.use("/api", rateLimit({ windowMs: 60_000, limit: 90, standardHeaders: true, legacyHeaders: false }));

const activeGames = new Map();
const MAX_CASE_SECONDS = 12 * 60;
const CLUE_COST_SECONDS = 18;
const CLUE_COST_POINTS = 80;

function publicCase(c) {
  return {
    id: c.id, number: c.number, title: c.title, difficulty: c.difficulty,
    location: c.location, crime: c.crime, briefing: c.briefing, victim: c.victim,
    suspects: c.suspects.map(s => ({ id: s.id, name: s.name, role: s.role, profile: s.profile, alibi: s.alibi })),
    clueCount: c.clues.length, lockedClues: c.clues.map((clue, i) => ({ id: clue.id, box: i + 1, title: `Sealed evidence ${String(i+1).padStart(2,"0")}`, category: clue.category })),
    rules: c.rules
  };
}
function getGame(req) {
  const id = req.session.gameId;
  if (!id) return null;
  const game = activeGames.get(id);
  if (!game || game.sessionId !== req.sessionID) return null;
  if (game.status === "playing" && Date.now() >= game.deadline) game.status = "time-up";
  return game;
}
function publicGame(game) {
  const remaining = Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000));
  return {
    caseId: game.caseId, status: game.status, startedAt: game.startedAt,
    deadline: game.deadline, remainingSeconds: remaining,
    unlockedClues: game.unlockedClues, guessesRemaining: game.guessesRemaining,
    score: game.score, hintsUsed: game.hintsUsed, openedBoxes: game.openedBoxes,
    result: game.result || null
  };
}
function currentCase(game) { return CASES.find(c => c.id === game.caseId); }

app.get("/api/health", (_req, res) => res.json({ ok: true, cases: CASES.length }));
app.get("/api/cases", (_req, res) => res.json({ cases: CASES.map(c => ({
  id: c.id, number: c.number, title: c.title, difficulty: c.difficulty, location: c.location, crime: c.crime, unlockedByDefault: c.number === 1
})) }));
app.get("/api/cases/:id", (req, res) => {
  const c = CASES.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: "Case file not found." });
  res.json({ case: publicCase(c) });
});

app.post("/api/game/start", (req, res) => {
  const caseId = String(req.body.caseId || "case-01");
  const c = CASES.find(x => x.id === caseId);
  if (!c) return res.status(404).json({ error: "That case does not exist." });
  const gameId = crypto.randomUUID();
  const now = Date.now();
  const game = {
    gameId, sessionId: req.sessionID, caseId, status: "playing", startedAt: now,
    deadline: now + MAX_CASE_SECONDS * 1000, unlockedClues: [], openedBoxes: [],
    guessesRemaining: 3, score: 1000, hintsUsed: 0, result: null
  };
  activeGames.set(gameId, game);
  req.session.gameId = gameId;
  res.status(201).json({ game: publicGame(game), case: publicCase(c), mechanics: { clueCostSeconds: CLUE_COST_SECONDS, clueCostPoints: CLUE_COST_POINTS } });
});

app.get("/api/game/state", (req, res) => {
  const game = getGame(req);
  if (!game) return res.status(404).json({ error: "No active investigation. Start a case first." });
  res.json({ game: publicGame(game), case: publicCase(currentCase(game)) });
});

app.post("/api/game/clue", (req, res) => {
  const game = getGame(req);
  if (!game) return res.status(409).json({ error: "Start a case before opening a mystery box." });
  if (game.status !== "playing") return res.status(409).json({ error: "This investigation has ended.", game: publicGame(game) });
  const c = currentCase(game);
  const clueId = String(req.body.clueId || "");
  const clue = c.clues.find(x => x.id === clueId);
  if (!clue) return res.status(404).json({ error: "Evidence box not found." });
  if (!game.unlockedClues.includes(clueId)) {
    game.unlockedClues.push(clueId);
    game.openedBoxes.push(clueId);
    game.deadline -= CLUE_COST_SECONDS * 1000;
    game.score = Math.max(0, game.score - CLUE_COST_POINTS);
  }
  res.json({ clue: { id: clue.id, title: clue.title, category: clue.category, description: clue.description, detail: clue.detail }, game: publicGame(game) });
});

app.post("/api/game/hint", (req, res) => {
  const game = getGame(req);
  if (!game) return res.status(409).json({ error: "Start a case first." });
  if (game.status !== "playing") return res.status(409).json({ error: "This investigation has ended." });
  const c = currentCase(game);
  const hint = c.hints[Math.min(game.hintsUsed, c.hints.length - 1)];
  game.hintsUsed += 1;
  game.score = Math.max(0, game.score - 100);
  res.json({ hint, game: publicGame(game) });
});

app.post("/api/game/accuse", (req, res) => {
  const game = getGame(req);
  if (!game) return res.status(409).json({ error: "Start a case before submitting a verdict." });
  if (game.status !== "playing") return res.status(409).json({ error: "This investigation has already ended.", game: publicGame(game) });
  if (Date.now() >= game.deadline) {
    game.status = "time-up";
    return res.status(409).json({ error: "Time expired. Review the debrief and try again.", game: publicGame(game) });
  }
  if (game.guessesRemaining <= 0) return res.status(409).json({ error: "No guesses remain.", game: publicGame(game) });
  const c = currentCase(game);
  const suspectId = String(req.body.suspectId || "");
  const evidenceIds = Array.isArray(req.body.evidenceIds) ? [...new Set(req.body.evidenceIds.map(String))] : [];
  if (!c.suspects.some(s => s.id === suspectId)) return res.status(400).json({ error: "Select a valid suspect." });
  if (evidenceIds.some(id => !game.unlockedClues.includes(id))) return res.status(400).json({ error: "You can only submit evidence you have opened." });

  const correctSuspect = suspectId === c.solution.suspectId;
  const required = c.solution.requiredClues;
  const matchedEvidence = evidenceIds.filter(id => required.includes(id)).length;
  const evidenceComplete = required.every(id => evidenceIds.includes(id)) &&
    evidenceIds.every(id => required.includes(id));
  // A correct suspect is always a win. Evidence quality affects score/stars, not acceptance.
  game.guessesRemaining -= 1;
  const elapsed = Math.max(0, Math.floor((Date.now() - game.startedAt) / 1000));
  const remaining = Math.max(0, Math.floor((game.deadline - Date.now()) / 1000));
  const timeBonus = Math.min(300, remaining);
  const evidenceBonus = matchedEvidence * 100;
  const rawScore = Math.max(0, game.score + evidenceBonus + timeBonus - (3 - game.guessesRemaining) * 100);
  const scoreMultiplier = correctSuspect ? (evidenceComplete ? 1 : 0.75) : 0;
  const verdictScore = Math.round(rawScore * scoreMultiplier);
  const correct = correctSuspect;
  game.score = verdictScore;
  game.status = correctSuspect ? "won" : game.guessesRemaining === 0 ? "lost" : "playing";
  game.result = {
    correct, correctSuspect, evidenceComplete, matchedEvidence, requiredEvidenceCount: required.length,
    guessesRemaining: game.guessesRemaining, elapsedSeconds: elapsed, timeBonus, evidenceBonus,
    score: verdictScore, scoreMultiplier, stars: correctSuspect ? (evidenceComplete ? 3 : 2) : 0,
    verdictGrade: correctSuspect ? (evidenceComplete ? "FLAWLESS INVESTIGATION" : "CASE CLOSED — WEAK EVIDENCE") : "INCORRECT SUSPECT",
    message: correctSuspect ? (evidenceComplete ? "Flawless investigation. Every exhibit supports your deduction." : "Case closed. Your suspect is correct, but your evidence chain is incomplete or contains irrelevant exhibits.") :
      game.guessesRemaining > 0 ? "INCORRECT SUSPECT. The evidence contradicts your accusation. Reconsider the case." :
      "INCORRECT SUSPECT. The investigation is over. Read the debrief, then return to the case board."
  };
  const debrief = (game.status === "won" || game.status === "lost") ? {
    culprit: c.suspects.find(s => s.id === c.solution.suspectId).name,
    motive: c.solution.motive,
    explanation: c.solution.explanation,
    chain: c.solution.requiredClues.map(id => {
      const clue = c.clues.find(x => x.id === id);
      return { title: clue.title, explanation: clue.detail };
    })
  } : null;
  res.json({ result: game.result, game: publicGame(game), debrief });
});

app.get("/api/leaderboard", (_req, res) => {
  // In-memory MVP leaderboard. A database-backed leaderboard should replace this for multi-instance production.
  const rows = [...activeGames.values()].filter(g => g.status === "won" && g.result).sort((a,b) => b.score - a.score).slice(0,10)
    .map((g,i) => ({ rank:i+1, caseId:g.caseId, score:g.score, elapsedSeconds:g.result.elapsedSeconds }));
  res.json({ leaderboard: rows });
});

app.use(express.static(path.join(__dirname, "public")));
app.use((err, _req, res, _next) => {
  console.error("MysteryBox error:", err.message);
  if (!res.headersSent) res.status(500).json({ error: "Unexpected server error. Please try again." });
});
app.listen(PORT, () => console.log(`MysteryBox ready at http://localhost:${PORT}`));
