import React from "react";
import "../styles/about.scss";
 // Make sure this file exists!

const About = () => {
  return (
    <div className="about-container">
      <h2>About This App</h2>
      <p>
        This weather app allows users to check the current weather and a 5-day
        forecast for cities around the world.
      </p>

      <div className="features">
        <h3>Features:</h3>
        <ul>
          <li>Search weather by city</li>
          <li>5-day forecast</li>
          <li>Sunrise & sunset times</li>
          <li>Responsive design</li>
        </ul>
      </div>

      <div className="tech-stack">
        <h3>Built With:</h3>
        <ul>
          <li>React</li>
          <li>SCSS (Sass)</li>
          <li>OpenWeatherMap API</li>
          <li>Vite</li>
        </ul>
      </div>

      <p className="footer-note">Made with ❤️ by Kristian Ninnis</p>
    </div>
  );
};

export default About;
