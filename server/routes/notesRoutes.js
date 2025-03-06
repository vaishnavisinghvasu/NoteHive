const express = require("express");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");
const { createNote, getNotesBySubject, editNote, deleteNote,getNotes } = require("../controllers/notesController");

const router = express.Router();

// ✅ Create a note (Admin Only)
router.post("/notes", authenticate, authorizeAdmin, createNote);

// ✅ Get notes by subject (Users & Admin)
router.get("/notes/:subject", authenticate, getNotesBySubject);

// ✅ Edit a note (Admin Only)
router.put("/notes/:id", authenticate, authorizeAdmin, editNote);

// ✅ Delete a note (Admin Only)
router.delete("/notes/:id", authenticate, authorizeAdmin, deleteNote);
router.get("/notes", authenticate, getNotes);

module.exports = router;
