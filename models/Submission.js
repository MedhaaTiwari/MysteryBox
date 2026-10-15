const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  gameId: { type: String, required: true, index: true }, sessionId: { type: String, required: true, index: true },
  caseId: { type: String, required: true }, suspectId: { type: String, required: true },
  evidenceIds: { type: [String], default: [] }, correct: Boolean, score: Number, stars: Number, result: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: false });
module.exports = mongoose.model("Submission", schema);
