import React, { useState, useEffect, useRef } from "react";

const cities = [
  { name: "London" },
  { name: "New York" },
  { name: "Tokyo" },
  { name: "Paris" },
  { name: "Sydney" },
];

// Use API key from Vite environment variables
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function Home() {
  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("London");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showDropdown, setShowDropdown] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("City not found.");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather. Please try a valid city name.");
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
        <label htmlFor="home-city-input" className="visually-hidden">
          City
        </label>
        <input
          id="home-city-input"
          name="home-city"
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
          autoComplete="on"
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
    </main>
  );
}
