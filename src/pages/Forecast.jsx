import React, { useState, useEffect, useRef } from "react";
import "../styles/forecast.scss";

const cities = [
  { name: "London" },
  { name: "New York" },
  { name: "Tokyo" },
  { name: "Paris" },
  { name: "Sydney" },
  { name: "Berlin" },
  { name: "Moscow" },
  { name: "Dubai" },
  { name: "Toronto" },
  { name: "San Francisco" },
];

const API_KEY = "58ab7cf5d82f6902762a0563a01c1056";

export default function Forecast() {
  const [inputCity, setInputCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("London");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  // Load initial city list
  useEffect(() => {
    setFilteredCities(cities);
  }, []);

  // Fetch forecast when selectedCity changes
  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError("");
      setForecast([]);

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error("Could not load forecast.");

        const data = await res.json();
        const dailyForecast = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

        setForecast(dailyForecast.slice(0, 5)); // Next 5 days only
      } catch {
        setError("Could not load forecast.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchForecast();
    }
  }, [selectedCity]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputCity(input);

    const filtered = input.trim()
      ? cities.filter((city) =>
          city.name.toLowerCase().startsWith(input.toLowerCase())
        )
      : cities;

    setFilteredCities(filtered);
    setDropdownOpen(true);
  };

  const handleCitySelect = (cityName) => {
    setInputCity(cityName);
    setSelectedCity(cityName);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim() !== "") {
      setSelectedCity(inputCity.trim());
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="forecast-container">
      <form onSubmit={handleSubmit} className="forecast-form" ref={dropdownRef}>
        <input
          type="text"
          className="forecast-input"
          value={inputCity}
          onChange={handleInputChange}
          onFocus={() => {
            setDropdownOpen(true);
            if (inputCity.trim() === "") setFilteredCities(cities);
          }}
          placeholder="Enter or select a city"
          autoComplete="off"
        />
        <button type="submit" className="forecast-button">
          Search
        </button>

        {dropdownOpen && filteredCities.length > 0 && (
          <ul className="forecast-dropdown">
            {filteredCities.map((city) => (
              <li
                key={city.name}
                className="forecast-dropdown-item"
                onClick={() => handleCitySelect(city.name)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="forecast-selected">
        Selected city: <strong>{selectedCity}</strong>
      </div>

      {loading && <div className="forecast-loading">Loading forecast...</div>}
      {error && <div className="forecast-error">{error}</div>}

      {forecast.length > 0 && (
        <div className="forecast-results">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {forecast.map((day) => {
              const date = new Date(day.dt_txt);
              return (
                <div className="forecast-day" key={day.dt}>
                  <div className="forecast-date">
                    {date.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="forecast-icon"
                  />
                  <div className="forecast-temp">
                    {Math.round(day.main.temp)}°C
                  </div>
                  <div className="forecast-desc">{day.weather[0].description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
