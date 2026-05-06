const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  userId: String,
  title: String,     // ✅ ADD THIS
  content: String    // encrypted
}, { timestamps: true });

module.exports = mongoose.model("Note", NoteSchema);