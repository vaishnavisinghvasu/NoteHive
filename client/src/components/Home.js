import React from "react";
import "../css/Home.css";
import FAQ from "./FAQ";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h2>Welcome to Your Dashboard 🚀</h2>
        <p>Your central hub for managing notes and user information.</p>

        {/* Image Section */}
        <img 
        src="https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800&q=80" 
        alt="Dashboard" 
        className="rounded-lg shadow-md w-full"
        />
        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
};

export default Home;
