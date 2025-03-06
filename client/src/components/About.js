import React from 'react';
import '../css/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About This App</h1>
        <p>Welcome to <strong>MyApp</strong>, where innovation meets simplicity.</p>
      </div>
      <div className="about-content">
        <p>MyApp is designed to offer a seamless user experience while tackling challenges and enhancing productivity. With a blend of modern technologies and intuitive design, MyApp is built to help you achieve your goals efficiently.</p>

        <div className="features">
          <h2>Key Features</h2>
          <ul>
            <li>User-friendly interface</li>
            <li>Light and Dark theme support</li>
            <li>Real-time updates and notifications</li>
            <li>Responsive design for all devices</li>
          </ul>
        </div>

        <p>The app was crafted using <strong>React.js</strong> and designed with a minimalist aesthetic to provide an enjoyable experience. Whether you're here to track tasks, explore new content, or improve your skills, MyApp is built for you.</p>
      </div>

      <div className="about-footer">
        <p>Created by: <strong>Vaishnavi singh</strong></p>
        <p>&copy; 2025</p>
      </div>
    </div>
  );
}

export default About;
