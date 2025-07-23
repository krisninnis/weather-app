import React, { useState } from "react";
import Forecast from "../components/Forecast";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function Home() {
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchWeather() {
    if (!cityName) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("City not found.");
      const data = await response.json();
      setWeather(data);
    } catch {
      setError("Failed to load weather. Please try a valid city name.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchWeather();
  }

  return (
    <div className="home">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter city name"
          aria-label="City Name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="current-weather">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Conditions: {weather.weather[0].description}</p>
          <Forecast cityName={weather.name} />
        </div>
      )}
    </div>
  );
}