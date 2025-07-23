import React, { useState, useEffect, useRef } from "react";

const cities = [
  { name: "London" },
  { name: "New York" },
  { name: "Tokyo" },
  { name: "Paris" },
  { name: "Sydney" },
];

const API_KEY = "58ab7cf5d82f6902762a0563a01c1056";

export default function Home() {
  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("London");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showDropdown, setShowDropdown] = useState(false);

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // <-- forecast state here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchWeatherAndForecast(selectedCity);
  }, [selectedCity]);

  // Fetch current weather AND 5-day forecast
  const fetchWeatherAndForecast = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!weatherRes.ok) throw new Error("City not found.");
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // Fetch 5-day forecast (3-hour intervals)
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!forecastRes.ok) throw new Error("Forecast not found.");
      const forecastData = await forecastRes.json();

      // Process forecast data: pick one forecast per day (e.g., 12:00:00 time)
      const dailyForecasts = [];
      const forecastList = forecastData.list;

      // Use a Set to track unique dates
      const dates = new Set();

      for (let entry of forecastList) {
        const date = entry.dt_txt.split(" ")[0]; // get date only
        const time = entry.dt_txt.split(" ")[1];
        if (time === "12:00:00" && !dates.has(date)) {
          dailyForecasts.push(entry);
          dates.add(date);
        }
      }

      setForecast(dailyForecasts.slice(0, 5)); // limit to 5 days
    } catch (err) {
      setError("Failed to load weather or forecast. Please try a valid city.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    const filtered = value.trim()
      ? cities.filter((city) =>
          city.name.toLowerCase().startsWith(value.toLowerCase())
        )
      : cities;
    setFilteredCities(filtered);
    setShowDropdown(true);
  };

  const handleSelectCity = (cityName) => {
    setCityInput(cityName);
    setSelectedCity(cityName);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim() !== "") {
      setSelectedCity(cityInput.trim());
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="weather-container">
      <form onSubmit={handleSubmit} className="city-form" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Enter or select a city"
          value={cityInput}
          onChange={handleInputChange}
          onFocus={() => {
            setShowDropdown(true);
            if (cityInput.trim() === "") {
              setFilteredCities(cities);
            }
          }}
          className="city-input"
          autoComplete="off"
        />
        <button type="submit" className="search-button">
          Search
        </button>

        {showDropdown && filteredCities.length > 0 && (
          <ul className="dropdown-list">
            {filteredCities.map((city) => (
              <li
                key={city.name}
                className="dropdown-item"
                onClick={() => handleSelectCity(city.name)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      {loading && <div className="weather-loading">Loading weather...</div>}
      {error && <div className="weather-error">{error}</div>}

      {weather && (
        <div className="weather-result">
          <div className="weather-title">{weather.name}</div>
          <div className="weather-description">
            {weather.weather[0].description}
          </div>
          <div className="weather-temp">🌡 Temp: {weather.main.temp}°C</div>
          <div className="weather-humidity">💧 Humidity: {weather.main.humidity}%</div>
        </div>
      )}

      {/* Render 5-day forecast */}
      {forecast.length > 0 && (
        <div className="forecast-list">
          {forecast.map((day) => (
            <div key={day.dt} className="forecast-item">
              <div>{new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
              <div>{day.weather[0].description}</div>
              <div>🌡 {Math.round(day.main.temp)}°C</div>
              <div>💧 {day.main.humidity}%</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
