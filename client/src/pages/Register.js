import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Register.css";

const Register = ({ setUsername, setEmail }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes and update formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (user registration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registration Response:", data);

      if (response.ok) {
        // Clear previous user data from localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("bio");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("phone");
        localStorage.removeItem("location");

        // Fallback: If backend doesn't return email, use formData.email
        const registeredEmail = data.email || formData.email;

        // Store new user data in localStorage
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", registeredEmail);

        // Update global state if functions are provided
        if (setUsername) setUsername(data.username);
        if (setEmail) setEmail(registeredEmail);

        setMessage("Registration successful! Redirecting...");

        setTimeout(() => {
          navigate("/profile");  // Redirect to profile or home page
          // Optionally, remove the following line if you don't want a full page reload.
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close the registration form and navigate to home
  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="register-form-container">
      <button className="close-btn" onClick={handleClose}>X</button>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && (
        <p className={message.includes("success") ? "success" : "error"}>
          {message}
        </p>
      )}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
