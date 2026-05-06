const router = require("express").Router();
const Note = require("../models/Note");

// ================= CREATE NOTE =================
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      userId: req.body.userId,
      title: req.body.title,     // ✅ ADD THIS
      content: req.body.content
    });

    res.json(note);
  } catch (err) {
    res.status(500).send("Error creating note");
  }
});

// ================= GET ALL NOTES =================
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch {
    res.status(500).send("Error fetching notes");
  }
});

// ================= GET SINGLE NOTE =================
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).send("Note not found");

    res.json(note);
  } catch {
    res.status(500).send("Error fetching note");
  }
});

// ================= UPDATE NOTE =================
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content
      },
      { new: true }
    );

    res.json(note);
  } catch {
    res.status(500).send("Error updating note");
  }
});

// ================= DELETE NOTE =================
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch {
    res.status(500).send("Error deleting note");
  }
});

module.exports = router;