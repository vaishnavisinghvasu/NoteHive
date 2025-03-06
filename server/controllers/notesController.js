const Note = require("../models/notesModel");
const { ObjectId } = require("mongodb");

// Create Note (Admin Only)
const createNote = async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    if (!title || !subject || !content) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const sanitizedContent = DOMPurify.sanitize(content);

    const newNote = new Note({
      title,
      subject,
      content,
      content: sanitizedContent,
      createdBy: req.user._id, // Associate with user
      createdAt: new Date(),
    });

    await newNote.save();
    res.status(201).json({ message: "Note created successfully!", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Notes by Subject
const getNotesBySubject = async (req, res) => {
  try {
    const notes = await Note.find({ subject: req.params.subject }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Note (Admin Only)
const editNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = req.body.title || note.title;
    note.subject = req.body.subject || note.subject;
    note.content = req.body.content || note.content;

    await note.save();
    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Note (Admin Only)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Notes (Admin Only)
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

module.exports = { createNote, getNotesBySubject, editNote, deleteNote, getNotes };
