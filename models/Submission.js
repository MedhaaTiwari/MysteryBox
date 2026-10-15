const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  caseId: { type: Number, required: true },
  suspect: { type: String, required: true },
  evidence: { type: [String], default: [] },
  correct: { type: Boolean, required: true },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model("Submission", submissionSchema);
