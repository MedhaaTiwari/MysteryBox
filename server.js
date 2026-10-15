require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const Case = require("./models/Case");
const Investigation = require("./models/Investigation");
const Submission = require("./models/Submission");
const seedCases = require("./data/cases");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

if (!SESSION_SECRET) {
  console.error("SESSION_SECRET is missing. Set it in your environment.");
  process.exit(1);
}
if (!MONGO_URI) {
  console.error("MONGO_URI or MONGODB_URI is missing. Configure it in your environment.");
  process.exit(1);
}

app.use(session({
  name: "mysterybox.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "native",
    touchAfter: 24 * 60 * 60
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, "public"), {
  extensions: ["html"],
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.get("/api/health", (_req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? "ok" : "database_unavailable",
    database: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown"
  });
});

function publicCase(doc) {
  return {
    caseId: doc.caseId,
    title: doc.title,
    difficulty: doc.difficulty,
    story: doc.story,
    suspects: doc.suspects,
    clues: doc.clues.map(c => ({ title: c.title, description: c.description }))
  };
}

app.get("/api/cases", async (_req, res, next) => {
  try {
    const docs = await Case.find({}, { solution: 0, __v: 0 }).sort({ caseId: 1 }).lean();
    res.json({ cases: docs.map(publicCase) });
  } catch (err) { next(err); }
});

app.post("/api/game/start", async (req, res, next) => {
  try {
    const caseId = Number(req.body.caseId || 1);
    if (!Number.isInteger(caseId) || caseId < 1) return res.status(400).json({ error: "Invalid caseId." });
    const gameCase = await Case.findOne({ caseId }).lean();
    if (!gameCase) return res.status(404).json({ error: "Case not found." });
    const existing = await Investigation.findOne({ sessionId: req.sessionID, caseId });
    const investigation = existing || await Investigation.create({
      sessionId: req.sessionID, caseId, unlockedClues: [], attemptsRemaining: 3
    });
    res.json({
      case: publicCase(gameCase),
      progress: {
        unlockedClues: investigation.unlockedClues,
        attemptsRemaining: investigation.attemptsRemaining,
        score: investigation.score,
        stars: investigation.stars
      }
    });
  } catch (err) { next(err); }
});

app.post("/api/game/clue", async (req, res, next) => {
  try {
    const caseId = Number(req.body.caseId);
    const clueTitle = String(req.body.clueTitle || "").trim();
    const gameCase = await Case.findOne({ caseId }).lean();
    if (!gameCase) return res.status(404).json({ error: "Case not found." });
    if (!gameCase.clues.some(c => c.title === clueTitle)) return res.status(400).json({ error: "Unknown clue." });
    const investigation = await Investigation.findOneAndUpdate(
      { sessionId: req.sessionID, caseId },
      { $addToSet: { unlockedClues: clueTitle } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const clue = gameCase.clues.find(c => c.title === clueTitle);
    res.json({ clue, unlockedClues: investigation.unlockedClues });
  } catch (err) { next(err); }
});

app.post("/api/game/accuse", async (req, res, next) => {
  try {
    const caseId = Number(req.body.caseId);
    const suspect = String(req.body.suspect || "").trim();
    const evidence = Array.isArray(req.body.evidence) ? [...new Set(req.body.evidence.map(String))] : [];
    const gameCase = await Case.findOne({ caseId }).lean();
    if (!gameCase) return res.status(404).json({ error: "Case not found." });
    if (!gameCase.suspects.some(s => s.name === suspect)) return res.status(400).json({ error: "Invalid suspect." });
    const allowedEvidence = new Set(gameCase.clues.map(c => c.title));
    if (evidence.some(e => !allowedEvidence.has(e))) return res.status(400).json({ error: "Invalid evidence selection." });

    let investigation = await Investigation.findOne({ sessionId: req.sessionID, caseId });
    if (!investigation) investigation = await Investigation.create({ sessionId: req.sessionID, caseId });
    if (investigation.attemptsRemaining <= 0 || investigation.completedAt) {
      return res.status(409).json({ error: "This investigation is already finished." });
    }

    const correct = suspect === gameCase.solution.suspect;
    const evidenceCorrect = correct && gameCase.solution.evidence.every(e => evidence.includes(e)) &&
      evidence.every(e => gameCase.solution.evidence.includes(e));
    const score = correct ? (evidenceCorrect ? 100 : 75) : 0;
    const stars = correct ? (evidenceCorrect ? 3 : 2) : 0;
    const attemptsRemaining = correct ? investigation.attemptsRemaining : investigation.attemptsRemaining - 1;
    const completed = correct || attemptsRemaining <= 0;

    investigation.attemptsRemaining = attemptsRemaining;
    investigation.score = score;
    investigation.stars = stars;
    if (completed) {
      investigation.completedAt = new Date();
      investigation.verdict = suspect;
    }
    await investigation.save();
    await Submission.create({
      sessionId: req.sessionID, caseId, suspect, evidence, correct, score
    });

    res.json({
      correct,
      completed,
      suspect,
      score,
      stars,
      attemptsRemaining,
      explanation: correct ? gameCase.solution.explanation : "The evidence does not support that accusation. Reconsider the timeline and clues.",
      message: correct ? (evidenceCorrect ? "Perfect verdict!" : "Correct suspect, but the evidence is incomplete.") : "Incorrect accusation."
    });
  } catch (err) { next(err); }
});

app.get("/api/game/progress", async (req, res, next) => {
  try {
    const rows = await Investigation.find({ sessionId: req.sessionID }).sort({ caseId: 1 }).lean();
    res.json({ progress: rows.map(r => ({
      caseId: r.caseId, attemptsRemaining: r.attemptsRemaining, score: r.score,
      stars: r.stars, completed: Boolean(r.completedAt)
    })) });
  } catch (err) { next(err); }
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "API route not found." });
  next();
});

app.use((err, _req, res, _next) => {
  console.error("Request failed:", err);
  if (res.headersSent) return;
  res.status(500).json({ error: "An unexpected server error occurred." });
});

async function connectAndStart() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    console.log("Connected to MongoDB.");
    await Case.bulkWrite(seedCases.map(c => ({
      updateOne: { filter: { caseId: c.caseId }, update: { $setOnInsert: c }, upsert: true }
    })), { ordered: false });
    console.log("Case seed check complete.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`MysteryBox listening on port ${PORT}`);
    });
    const shutdown = async signal => {
      console.log(`${signal} received. Closing server and MongoDB connection...`);
      server.close(async () => {
        try { await mongoose.disconnect(); process.exit(0); }
        catch (err) { console.error("Shutdown error:", err); process.exit(1); }
      });
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Could not start MysteryBox:", err.message);
    process.exitCode = 1;
  }
}

connectAndStart();
