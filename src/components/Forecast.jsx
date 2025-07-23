import React, { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function Forecast({ cityName }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cityName) return;

    async function fetchForecast() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("City not found.");
        const data = await response.json();
        setForecast(data);
      } catch {
        setError("Failed to load forecast. Try a valid city name.");
        setForecast(null);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [cityName]);

  if (loading) return <p>Loading forecast...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!forecast) return null;

  return (
    <div className="forecast">
      <h2>5-day Forecast for {cityName}</h2>
      {/* Render forecast list */}
      <ul>
        {forecast.list.map((item) => (
          <li key={item.dt}>
            {new Date(item.dt * 1000).toLocaleString()}: {item.weather[0].description}, {item.main.temp}°C
          </li>
        ))}
      </ul>
    </div>
  );
}