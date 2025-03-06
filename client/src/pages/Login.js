import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';

const Login = ({ setUsername, setAdminUsername, role = 'user' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true); // State to control form visibility

  // Determine API endpoint & redirect path based on role
  const apiEndpoint = role === 'admin' ? 'http://localhost:5000/admin/login' : 'http://localhost:5000/api/auth/login';
  const redirectPath = role === 'admin' ? '/admin' : '/dashboard'; // Redirect users to dashboard after login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging: Check what backend returns

      if (response.ok) {
        const storageKey = role === 'admin' ? 'adminToken' : 'token';
        const usernameKey = role === 'admin' ? 'adminUsername' : 'username';

        localStorage.setItem(storageKey, data.token);
        localStorage.setItem(usernameKey, data.username);
        localStorage.setItem('role', data.role); // ✅ Store role in localStorage!

        if (role === 'admin') {
          setAdminUsername(data.username);
        } else {
          setUsername(data.username);
        }

        setMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful! Redirecting...`);

        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      } else {
        setMessage(data.message || 'Invalid credentials. Try again.');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showForm && (
        <div className="login-form-container">
          <button className="close-btn" onClick={() => setShowForm(false)}>
            &times; {/* Cross symbol for close */}
          </button>
          <h2>{role === 'admin' ? 'Admin Login' : 'User Login'}</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder={`${role === 'admin' ? 'Admin Email' : 'Email'}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder={`${role === 'admin' ? 'Admin Password' : 'Password'}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
          {role === 'user' ? (
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          ) : (
            <p>Not an admin? <Link to="/login">User Login</Link></p>
          )}
        </div>
      )}
    </>
  );
};

export default Login;
