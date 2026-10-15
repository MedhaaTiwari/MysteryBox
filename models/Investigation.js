const mongoose = require("mongoose");

const investigationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  caseId: { type: Number, required: true },
  unlockedClues: { type: [String], default: [] },
  attemptsRemaining: { type: Number, default: 3 },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  verdict: { type: String, default: null },
  score: { type: Number, default: 0 },
  stars: { type: Number, default: 0 }
}, { timestamps: true });

investigationSchema.index({ sessionId: 1, caseId: 1 }, { unique: true });

module.exports = mongoose.model("Investigation", investigationSchema);
