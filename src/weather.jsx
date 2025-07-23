import React, { useState, useRef, useEffect } from "react";
import "./weather.scss";

const citiesList = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Berlin",
  "Sydney",
  "Moscow",
  "Toronto",
  "Beijing",
  "Dubai",
];

export default function Weather() {
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError("City not found");
        setWeather(null);
      }
    } catch {
      // Removed unused err param here to fix eslint no-unused-vars
      setError("Failed to fetch weather data");
      setWeather(null);
    } finally {
      setLoading(false);
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const filtered = citiesList.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setShowDropdown(false);
      setFilteredCities([]);
      setHighlightedIndex(-1);
    }
  };

  const onSelectCity = (cityName) => {
    setCity(cityName);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current.focus();
  };

  const onKeyDownHandler = (e) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCities.length) {
        onSelectCity(filteredCities[highlightedIndex]);
      } else {
        fetchWeather();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="weather-container">
      {/* Logo */}
      <img
        src="/logo.svg"
        alt="CloudChirp Logo"
        width={150}
        height={150}
        style={{ display: "block", margin: "0 auto 20px auto" }}
      />

      <div className="weather-search" style={{ position: "relative" }}>
        <input
          type="text"
          value={city}
          onChange={onChangeHandler}
          placeholder="Enter city name"
          className="weather-input"
          ref={inputRef}
          autoComplete="off"
          onFocus={() => {
            if (city.length > 0) setShowDropdown(true);
          }}
          onKeyDown={onKeyDownHandler}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="city-listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `city-option-${highlightedIndex}` : undefined
          }
        />
        <button onClick={fetchWeather} className="weather-button">
          Get Weather
        </button>

        {showDropdown && filteredCities.length > 0 && (
          <ul
            className="dropdown-list"
            id="city-listbox"
            role="listbox"
            ref={dropdownRef}
          >
            {filteredCities.map((c, idx) => (
              <li
                key={c}
                id={`city-option-${idx}`}
                className={
                  "dropdown-item" + (highlightedIndex === idx ? " highlighted" : "")
                }
                onClick={() => onSelectCity(c)}
                role="option"
                aria-selected={highlightedIndex === idx}
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="weather-error">{error}</p>}

      {loading && <p className="weather-loading">Loading...</p>}

      {weather && (
        <div className="weather-result">
          <h2 className="weather-title">{weather.name}</h2>
          <p className="weather-description">{weather.weather[0].description}</p>
          <p className="weather-temp">Temperature: {weather.main.temp}°C</p>
          <p className="weather-humidity">Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}
