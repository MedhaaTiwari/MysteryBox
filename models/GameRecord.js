const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true, index: true },
  sessionId: { type: String, required: true, index: true },
  caseId: { type: String, required: true, index: true },
  status: { type: String, required: true },
  startedAt: Date, deadline: Date, unlockedClues: { type: [String], default: [] },
  openedBoxes: { type: [String], default: [] }, guessesRemaining: Number, score: Number, hintsUsed: Number, result: mongoose.Schema.Types.Mixed
}, { timestamps: true });
module.exports = mongoose.model("GameRecord", schema);
