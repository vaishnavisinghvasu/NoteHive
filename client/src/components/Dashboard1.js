import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import '../css/Dashboard.css';

const Dashboard1 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(""); // Start with an empty role
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "https://via.placeholder.com/150");

  const navigate = useNavigate();

  // Get role when component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem("role")?.trim().toLowerCase();
    setRole(storedRole || ""); // Ensure a valid role is set
  }, []);

  // Sync dark mode state
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role"); // Remove role
    localStorage.removeItem("token");
    localStorage.removeItem("profilePic"); // Clear profile picture
    setUsername("");
    setRole(""); // Clear role immediately
    setProfilePic("https://via.placeholder.com/150"); // Reset profile picture to default
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="taskbar">
        <div className="taskbar-logo">
          <h1>NoteHive</h1>
        </div>

        <nav className={`taskbar-nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="about">About</Link></li>
            <li><Link to="notes">Notes</Link></li>
            <li><Link to="cp-trivia">Trivia & Quizzes</Link></li>

            {/* Only show Admin Panel for users with role "admin" */}
            {role === "admin" && (
              <>
                <li><Link to="/admin">Admin Panel</Link></li>
                <li><Link to="/admin/noteManager">Note Manager</Link></li>
              </>
            )}
            {username ? (
              <li className="profile-dropdown">
                <span className="profile-trigger">
                  {/* Display profile picture or default icon */}
                  <img
                    src={profilePic} 
                    alt="Profile"
                    className="profile-icon"
                    style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                  />
                  {username}
                </span>
                <ul className="dropdown-menu">
                  <li onClick={() => navigate("/profile")}>Profile</li>
                  <li onClick={() => navigate("/settings")}>Settings</li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </li>
            ) : (
              <>
                <li><Link to="login">Login</Link></li>
                <li><Link to="register">Sign Up</Link></li>
              </>
            )}

            {/* Dark mode toggle */}
            <li className="dark-mode-toggle" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </li>
          </ul>
        </nav>

        {/* Mobile menu toggle button */}
        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard1;
