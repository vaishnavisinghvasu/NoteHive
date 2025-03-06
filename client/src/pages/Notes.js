import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Notes.css";
import { color } from "framer-motion";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes from localStorage when the component mounts
  useEffect(() => {
    const fetchNotes = () => {
      const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
      setNotes(storedNotes);
      setLoading(false);
    };

    fetchNotes();
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>My Notes</h2>
      </div>

      <div className="notes-grid">
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-inner">
                {/* Front Side */}
                <div className="note-front">
                  <h3 style={{ color: "white" }}>{note.title}</h3>
                </div>

                {/* Back Side */}
                <div className="note-back">
                  {/* <h3>{note.title}</h3> */}
                  {/* <p dangerouslySetInnerHTML={{ __html: note.content }}></p> */}
                  <Link to={`/notes/${note.id}`} className="note-link">
                    View Note
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
