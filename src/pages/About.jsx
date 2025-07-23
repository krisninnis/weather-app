import React from "react";

export default function About() {
  return (
    <main className="about-container">
      <h1>About WeatherApp</h1>
      <section>
        <p>
          WeatherApp is a simple React application that provides current weather and 5-day forecasts for cities around the world.
        </p>
        <p>
          It uses the OpenWeatherMap API to fetch real-time weather data and displays it in a clean and user-friendly interface.
        </p>
      </section>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Search for cities and view current weather conditions</li>
          <li>5-day weather forecasts with temperature, humidity, and descriptions</li>
          <li>Responsive design for use on desktop and mobile devices</li>
          <li>Accessible and keyboard-friendly UI components</li>
        </ul>
      </section>

      <section>
        <h2>About the Developer</h2>
        <p>
          This app was developed by Kristian Ninnis as part of a React learning project. It demonstrates React fundamentals, API integration, routing, and styling.
        </p>
        <p>
          Feel free to reach out or contribute ideas to improve the app!
        </p>
      </section>
    </main>
  );
}
