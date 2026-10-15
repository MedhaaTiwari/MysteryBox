const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("node:path");
const crypto = require("node:crypto");
const { MongoClient } = require("mongodb");
const { CASES: LOCAL_CASES } = require("./data/cases");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.MONGODB_DB_NAME || "mysterybox";
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "local-dev-only-change-this-secret-32chars");

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI. Add your MongoDB Atlas connection string to the environment.");
}
if (process.env.NODE_ENV === "production" && SESSION_SECRET.length < 32) {
  throw new Error("Set SESSION_SECRET to a random value of at least 32 characters in production.");
}

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(session({
  name: "mysterybox.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 8
  }
}));
app.use("/api", rateLimit({
  windowMs: 60_000,
  limit: 90,
  standardHeaders: true,
  legacyHeaders: false
}));

const MAX_CASE_SECONDS = 12 * 60;
const CLUE_COST_SECONDS = 18;
const CLUE_COST_POINTS = 80;

let mongoClient;
let db;
let casesCollection;
let investigationsCollection;
let submissionsCollection;
let playersCollection;

function publicCase(c) {
  return {
    id: c.id,
    number: c.number,
    title: c.title,
    difficulty: c.difficulty,
    location: c.location,
    crime: c.crime,
    briefing: c.briefing,
    victim: c.victim,
    suspects: (c.suspects || []).map(s => ({
      id: s.id, name: s.name, role: s.role, profile: s.profile, alibi: s.alibi
    })),
    clueCount: (c.clues || []).length,
    lockedClues: (c.clues || []).map((clue, i) => ({
      id: clue.id,
      box: i + 1,
      title: `Sealed evidence ${String(i + 1).padStart(2, "0")}`,
      category: clue.category
    })),
    rules: c.rules
  };
}

function publicGame(game) {
  const remaining = Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000));
  return {
    caseId: game.caseId,
    status: game.status,
    startedAt: game.startedAt,
    deadline: game.deadline,
    remainingSeconds: remaining,
    unlockedClues: game.unlockedClues || [],
    guessesRemaining: game.guessesRemaining,
    score: game.score,
    hintsUsed: game.hintsUsed,
    openedBoxes: game.openedBoxes || [],
    result: game.result || null
  };
}

async function findCase(id) {
  return casesCollection.findOne({ id });
}

async function getGame(req) {
  if (!req.session.gameId) return null;
  const game = await investigationsCollection.findOne({ gameId: req.session.gameId });
  if (!game || game.sessionId !== req.sessionID) return null;
  if (game.status === "playing" && Date.now() >= game.deadline) {
    await investigationsCollection.updateOne(
      { gameId: game.gameId, status: "playing" },
      { $set: { status: "time-up", updatedAt: Date.now() } }
    );
    game.status = "time-up";
  }
  return game;
}

async function startMongo() {
  mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await mongoClient.connect();
  db = mongoClient.db(DB_NAME);

  casesCollection = db.collection("cases");
  investigationsCollection = db.collection("investigations");
  submissionsCollection = db.collection("submissions");
  playersCollection = db.collection("players");

  await Promise.all([
    casesCollection.createIndex({ id: 1 }, { unique: true }),
    casesCollection.createIndex({ number: 1 }, { unique: true }),
    investigationsCollection.createIndex({ gameId: 1 }, { unique: true }),
    investigationsCollection.createIndex({ sessionId: 1, status: 1 }),
    investigationsCollection.createIndex({ status: 1, score: -1 }),
    submissionsCollection.createIndex({ gameId: 1, createdAt: -1 }),
    submissionsCollection.createIndex({ caseId: 1, correct: 1 }),
    playersCollection.createIndex({ sessionId: 1 }, { unique: true })
  ]);

  // Seed the authored cases on first run. Existing DB records are not overwritten.
  const count = await casesCollection.countDocuments();
  if (count === 0) {
    const docs = LOCAL_CASES.map(c => ({
      ...c,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    if (docs.length) await casesCollection.insertMany(docs);
    console.log(`Seeded ${docs.length} cases into MongoDB.`);
  } else {
    // Add any new case IDs without overwriting records already in the database.
    for (const c of LOCAL_CASES) {
      await casesCollection.updateOne(
        { id: c.id },
        { $setOnInsert: { ...c, createdAt: new Date(), updatedAt: new Date() } },
        { upsert: true }
      );
    }
  }

  console.log(`MongoDB connected: database "${DB_NAME}".`);
}

app.get("/api/health", async (_req, res) => {
  try {
    await db.command({ ping: 1 });
    res.json({ ok: true, database: "connected", cases: await casesCollection.countDocuments() });
  } catch (err) {
    res.status(503).json({ ok: false, database: "disconnected", error: "Database health check failed." });
  }
});

app.get("/api/cases", async (_req, res, next) => {
  try {
    const cases = await casesCollection.find(
      {}, { projection: { _id: 0, id: 1, number: 1, title: 1, difficulty: 1, location: 1, crime: 1 } }
    ).sort({ number: 1 }).toArray();
    res.json({ cases: cases.map(c => ({ ...c, unlockedByDefault: c.number === 1 })) });
  } catch (err) { next(err); }
});

app.get("/api/cases/:id", async (req, res, next) => {
  try {
    const c = await findCase(req.params.id);
    if (!c) return res.status(404).json({ error: "Case file not found." });
    res.json({ case: publicCase(c) });
  } catch (err) { next(err); }
});

app.post("/api/game/start", async (req, res, next) => {
  try {
    const caseId = String(req.body.caseId || "case-01");
    const c = await findCase(caseId);
    if (!c) return res.status(404).json({ error: "That case does not exist." });

    const gameId = crypto.randomUUID();
    const now = Date.now();
    const game = {
      gameId,
      sessionId: req.sessionID,
      caseId,
      status: "playing",
      startedAt: now,
      deadline: now + MAX_CASE_SECONDS * 1000,
      unlockedClues: [],
      openedBoxes: [],
      guessesRemaining: 3,
      score: 1000,
      hintsUsed: 0,
      result: null,
      createdAt: new Date(now),
      updatedAt: new Date(now)
    };

    await investigationsCollection.insertOne(game);
    req.session.gameId = gameId;

    req.session.save(err => {
      if (err) {
        console.error("Session save failed:", err.message);
        investigationsCollection.deleteOne({ gameId }).catch(console.error);
        return res.status(500).json({ error: "Could not save your session. Please try starting the case again." });
      }
      res.status(201).json({
        game: publicGame(game),
        case: publicCase(c),
        mechanics: { clueCostSeconds: CLUE_COST_SECONDS, clueCostPoints: CLUE_COST_POINTS }
      });
    });
  } catch (err) { next(err); }
});

app.get("/api/game/state", async (req, res, next) => {
  try {
    const game = await getGame(req);
    if (!game) return res.status(404).json({ error: "No active investigation. Start a case first." });
    const c = await findCase(game.caseId);
    if (!c) return res.status(404).json({ error: "Case file not found." });
    res.json({ game: publicGame(game), case: publicCase(c) });
  } catch (err) { next(err); }
});

app.post("/api/game/clue", async (req, res, next) => {
  try {
    const game = await getGame(req);
    if (!game) return res.status(409).json({ error: "Start a case before opening a mystery box." });
    if (game.status !== "playing") {
      return res.status(409).json({ error: "This investigation has ended.", game: publicGame(game) });
    }

    const c = await findCase(game.caseId);
    if (!c) return res.status(404).json({ error: "Case file not found." });
    const clueId = String(req.body.clueId || "");
    const clue = c.clues.find(x => x.id === clueId);
    if (!clue) return res.status(404).json({ error: "Evidence box not found." });

    // Conditional update prevents duplicate clicks from charging twice.
    if (!(game.unlockedClues || []).includes(clueId)) {
      const update = await investigationsCollection.updateOne(
        { gameId: game.gameId, status: "playing", unlockedClues: { $ne: clueId } },
        {
          $addToSet: { unlockedClues: clueId, openedBoxes: clueId },
          $inc: { deadline: -CLUE_COST_SECONDS * 1000, score: -CLUE_COST_POINTS },
          $set: { updatedAt: new Date() }
        }
      );
      if (update.modifiedCount) {
        game.unlockedClues.push(clueId);
        game.openedBoxes.push(clueId);
        game.deadline -= CLUE_COST_SECONDS * 1000;
        game.score = Math.max(0, game.score - CLUE_COST_POINTS);
      }
    }

    const latest = await investigationsCollection.findOne({ gameId: game.gameId });
    res.json({
      clue: { id: clue.id, title: clue.title, category: clue.category, description: clue.description, detail: clue.detail },
      game: publicGame(latest || game)
    });
  } catch (err) { next(err); }
});

app.post("/api/game/hint", async (req, res, next) => {
  try {
    const game = await getGame(req);
    if (!game) return res.status(409).json({ error: "Start a case first." });
    if (game.status !== "playing") return res.status(409).json({ error: "This investigation has ended." });

    const c = await findCase(game.caseId);
    if (!c) return res.status(404).json({ error: "Case file not found." });
    const hint = c.hints[Math.min(game.hintsUsed, c.hints.length - 1)];

    await investigationsCollection.updateOne(
      { gameId: game.gameId, status: "playing" },
      { $inc: { hintsUsed: 1, score: -100 }, $set: { updatedAt: new Date() } }
    );
    const latest = await investigationsCollection.findOne({ gameId: game.gameId });
    if (latest) latest.score = Math.max(0, latest.score);
    if (latest && latest.score < 0) {
      latest.score = 0;
      await investigationsCollection.updateOne({ gameId: game.gameId }, { $set: { score: 0 } });
    }
    res.json({ hint, game: publicGame(latest || game) });
  } catch (err) { next(err); }
});

app.post("/api/game/accuse", async (req, res, next) => {
  try {
    const game = await getGame(req);
    if (!game) return res.status(409).json({ error: "Start a case before submitting a verdict." });
    if (game.status !== "playing") {
      return res.status(409).json({ error: "This investigation has already ended.", game: publicGame(game) });
    }
    if (Date.now() >= game.deadline) {
      await investigationsCollection.updateOne({ gameId: game.gameId }, { $set: { status: "time-up", updatedAt: new Date() } });
      game.status = "time-up";
      return res.status(409).json({ error: "Time expired. Review the debrief and try again.", game: publicGame(game) });
    }
    if (game.guessesRemaining <= 0) return res.status(409).json({ error: "No guesses remain.", game: publicGame(game) });

    const c = await findCase(game.caseId);
    if (!c) return res.status(404).json({ error: "Case file not found." });

    const suspectId = String(req.body.suspectId || "");
    const evidenceIds = Array.isArray(req.body.evidenceIds) ? [...new Set(req.body.evidenceIds.map(String))] : [];
    if (!c.suspects.some(s => s.id === suspectId)) return res.status(400).json({ error: "Select a valid suspect." });
    if (evidenceIds.some(id => !(game.unlockedClues || []).includes(id))) {
      return res.status(400).json({ error: "You can only submit evidence you have opened." });
    }

    const correctSuspect = suspectId === c.solution.suspectId;
    const required = c.solution.requiredClues;
    const matchedEvidence = evidenceIds.filter(id => required.includes(id)).length;
    const evidenceComplete = required.every(id => evidenceIds.includes(id)) &&
      evidenceIds.every(id => required.includes(id));

    const guessesRemaining = game.guessesRemaining - 1;
    const elapsed = Math.max(0, Math.floor((Date.now() - game.startedAt) / 1000));
    const remaining = Math.max(0, Math.floor((game.deadline - Date.now()) / 1000));
    const timeBonus = Math.min(300, remaining);
    const evidenceBonus = matchedEvidence * 100;
    const rawScore = Math.max(0, game.score + evidenceBonus + timeBonus - (3 - guessesRemaining) * 100);
    const scoreMultiplier = correctSuspect ? (evidenceComplete ? 1 : 0.75) : 0;
    const verdictScore = Math.round(rawScore * scoreMultiplier);
    const status = correctSuspect ? "won" : guessesRemaining === 0 ? "lost" : "playing";

    const result = {
      correct: correctSuspect,
      correctSuspect,
      evidenceComplete,
      matchedEvidence,
      requiredEvidenceCount: required.length,
      guessesRemaining,
      elapsedSeconds: elapsed,
      timeBonus,
      evidenceBonus,
      score: verdictScore,
      scoreMultiplier,
      stars: correctSuspect ? (evidenceComplete ? 3 : 2) : 0,
      verdictGrade: correctSuspect
        ? (evidenceComplete ? "FLAWLESS INVESTIGATION" : "CASE CLOSED — WEAK EVIDENCE")
        : "INCORRECT SUSPECT",
      message: correctSuspect
        ? (evidenceComplete
          ? "Flawless investigation. Every exhibit supports your deduction."
          : "Case closed. Your suspect is correct, but your evidence chain is incomplete or contains irrelevant exhibits.")
        : guessesRemaining > 0
          ? "INCORRECT SUSPECT. The evidence contradicts your accusation. Reconsider the case."
          : "INCORRECT SUSPECT. The investigation is over. Read the debrief, then return to the case board."
    };

    const update = await investigationsCollection.updateOne(
      { gameId: game.gameId, status: "playing", guessesRemaining: game.guessesRemaining },
      {
        $set: {
          guessesRemaining,
          score: verdictScore,
          status,
          result,
          updatedAt: new Date()
        }
      }
    );
    if (!update.modifiedCount) {
      return res.status(409).json({ error: "The investigation changed. Refresh the case and try again." });
    }

    await submissionsCollection.insertOne({
      gameId: game.gameId,
      sessionId: req.sessionID,
      caseId: game.caseId,
      suspectId,
      evidenceIds,
      correct: correctSuspect,
      evidenceComplete,
      matchedEvidence,
      score: verdictScore,
      stars: result.stars,
      createdAt: new Date()
    });

    await playersCollection.updateOne(
      { sessionId: req.sessionID },
      {
        $setOnInsert: { sessionId: req.sessionID, createdAt: new Date() },
        $inc: { totalVerdicts: 1, correctVerdicts: correctSuspect ? 1 : 0, totalScore: verdictScore },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    const debrief = (status === "won" || status === "lost") ? {
      culprit: c.suspects.find(s => s.id === c.solution.suspectId).name,
      motive: c.solution.motive,
      explanation: c.solution.explanation,
      chain: c.solution.requiredClues.map(id => {
        const clue = c.clues.find(x => x.id === id);
        return { title: clue.title, explanation: clue.detail };
      })
    } : null;

    res.json({ result, game: publicGame({ ...game, ...{ guessesRemaining, score: verdictScore, status, result } }), debrief });
  } catch (err) { next(err); }
});

app.get("/api/leaderboard", async (_req, res, next) => {
  try {
    const rows = await investigationsCollection.find({ status: "won", result: { $ne: null } })
      .sort({ score: -1, updatedAt: 1 })
      .limit(10)
      .toArray();
    res.json({
      leaderboard: rows.map((g, i) => ({
        rank: i + 1,
        caseId: g.caseId,
        score: g.score,
        elapsedSeconds: g.result.elapsedSeconds
      }))
    });
  } catch (err) { next(err); }
});

app.use(express.static(path.join(__dirname, "public")));

app.use((err, _req, res, _next) => {
  console.error("MysteryBox error:", err.stack || err.message);
  if (!res.headersSent) {
    res.status(500).json({ error: "Unexpected server error. Please try again." });
  }
});

async function shutdown(signal) {
  console.log(`${signal} received. Closing MongoDB connection...`);
  try { if (mongoClient) await mongoClient.close(); } catch (err) { console.error(err.message); }
  process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`MysteryBox ready at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("Could not start MysteryBox:", err.message);
    process.exit(1);
  });
