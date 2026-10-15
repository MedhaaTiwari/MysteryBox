const mongoose = require("mongoose");

const clueSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true }
}, { _id: false });

const suspectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  statement: { type: String, default: "" },
  occupation: { type: String, default: "" }
}, { _id: false });

const caseSchema = new mongoose.Schema({
  caseId: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, default: "Easy" },
  story: { type: String, required: true },
  suspects: { type: [suspectSchema], default: [] },
  clues: { type: [clueSchema], default: [] },
  solution: {
    suspect: { type: String, required: true },
    evidence: { type: [String], default: [] },
    explanation: { type: String, default: "" }
  }
}, { timestamps: true, collection: "cases" });

module.exports = mongoose.model("Case", caseSchema);
