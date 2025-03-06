import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE
import { useNavigate } from "react-router-dom";
//import "tinymce/skins/content/default/content.css"; // Import default TinyMCE styles
import "../css/NoteManager.css"; // Import CSS file

const NoteManager = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({ title: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Fetch notes from localStorage
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
    setLoading(false);
  }, []);

  const saveNote = () => {
    const updatedNotes = [...notes];
    const newNote = { ...note, id: Date.now() };

    // Ensure content doesn't have unnecessary wrapping <p> tags
    const cleanedContent = newNote.content.replace(/^<p>/, "").replace(/<\/p>$/, "");
    newNote.content = cleanedContent;
    console.log("Saving content:", newNote.content); 

    if (editingNoteId) {
      const index = notes.findIndex((n) => n.id === editingNoteId);
      updatedNotes[index] = newNote;
    } else {
      updatedNotes.unshift(newNote);
    }

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);

    setNote({ title: "", content: "" });
    setEditingNoteId(null);
  };

  const editNote = (note) => {
    setEditingNoteId(note.id);
    setNote({ title: note.title, content: note.content });
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="note-manager-container">
      <h2>Note Manager</h2>

      <div className="note-editor">
        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="note-title-input"
        />
        {/* TinyMCE Editor */}
        <Editor
  apiKey="qks55it6scopg5ibx5k982jzxunxu1x79rdlzkmx2yapv5bb" // Use this for the free version
  value={note.content}
  onEditorChange={(content) => setNote({ ...note, content })}
  init={{
    height: 250,
    menubar: false,
    plugins: "lists link image table code",
    toolbar: "undo redo | bold italic underline | bullist numlist | link | code",
    content_css: "https://cdn.jsdelivr.net/npm/tinymce@5/skins/ui/oxide/content.css", // Load styles
  }}
/>
        <button onClick={saveNote} className="save-button">
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <h3>All Notes</h3>
      <table className="notes-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.title}</td>
              <td dangerouslySetInnerHTML={{ __html: note.content }}></td>
              <td>
                <button onClick={() => editNote(note)} className="edit-button">
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoteManager;
