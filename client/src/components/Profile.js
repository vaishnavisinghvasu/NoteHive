import React, { useState, useEffect } from "react";
import "../css/Profile.css";

const Profile = () => {
  // Initialize state with default empty values
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "",
    phone: "",
    location: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Fetch user data from registration details (localStorage)
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "Your Name";
    const storedEmail = localStorage.getItem("email") || "your.email@example.com";
    const storedBio = localStorage.getItem("bio") || "Write your bio here...";
    const storedProfilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/150";
    const storedPhone = localStorage.getItem("phone") || "Enter your phone number";
    const storedLocation = localStorage.getItem("location") || "Enter your location";

    setUser({
      name: storedUsername,
      email: storedEmail,
      bio: storedBio,
      profilePic: storedProfilePic,
      phone: storedPhone,
      location: storedLocation,
    });

    // Set editable fields
    setNewBio(storedBio);
    setNewPhone(storedPhone);
    setNewLocation(storedLocation);
  }, []);

  // Save updated profile details
  const handleSave = () => {
    localStorage.setItem("bio", newBio);
    localStorage.setItem("phone", newPhone);
    localStorage.setItem("location", newLocation);
    if (newProfilePic) {
      localStorage.setItem("profilePic", newProfilePic);
    }

    setUser({
      ...user,
      bio: newBio,
      profilePic: newProfilePic || user.profilePic,
      phone: newPhone,
      location: newLocation,
    });

    setEditMode(false);
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result); // Set the uploaded profile picture to the state
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={newProfilePic || user.profilePic}
            alt="Profile"
            className="profile-pic"
          />
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p> {/* Display email here */}
          <p className="tagline">{user.bio}</p>
        </div>

        {/* Edit Mode Fields */}
        {editMode && (
          <div className="edit-fields">
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Write something about yourself..."
            />
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter your location"
            />
            <div className="upload-section">
              <label htmlFor="profile-pic-upload">Upload Profile Picture</label>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="button-group">
          <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
          {editMode && (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
