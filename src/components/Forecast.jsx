import React, { useState, useEffect, useRef } from "react";

const cities = [
  { name: "London" },
  { name: "New York" },
  { name: "Tokyo" },
  { name: "Paris" },
  { name: "Sydney" },
];

const API_KEY = "58ab7cf5d82f6902762a0563a01c1056";

export default function Forecast() {
  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("London");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [showDropdown, setShowDropdown] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchForecast(selectedCity);
  }, [selectedCity]);

  const fetchForecast = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError("");
    setForecast([]);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("City not found.");
      const data = await response.json();

      // Get one forecast per day (around midday)
      const dailyForecasts = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      ).slice(0, 5);

      setForecast(dailyForecasts);
    } catch (err) {
      setError("Failed to load forecast. Try a valid city name.");
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
    <main className="forecast-container">
      <form onSubmit={handleSubmit} className="city-form" ref={dropdownRef} autoComplete="off">
        <label htmlFor="forecast-city-input" className="visually-hidden">
          City
        </label>
        <input
          id="forecast-city-input"
          name="forecast-city"
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
          aria-autocomplete="list"
          aria-controls="city-listbox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
        <button type="submit" className="search-button">
          Get Forecast
        </button>

        {showDropdown && filteredCities.length > 0 && (
          <ul
            id="city-listbox"
            role="listbox"
            className="dropdown-list"
            aria-label="City suggestions"
          >
            {filteredCities.map((city) => (
              <li
                key={city.name}
                role="option"
                tabIndex={0}
                className="dropdown-item"
                onClick={() => handleSelectCity(city.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectCity(city.name);
                  }
                }}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      {loading && <div className="weather-loading">Loading forecast...</div>}
      {error && <div className="weather-error">{error}</div>}

      {forecast.length > 0 && (
        <div className="forecast-grid" role="list">
          {forecast.map((day, index) => (
            <article
              key={index}
              className="forecast-card"
              role="listitem"
              tabIndex={0}
              aria-label={`Forecast for ${new Date(day.dt_txt).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}: ${day.weather[0].description}, temperature ${day.main.temp.toFixed(1)} degrees Celsius, humidity ${day.main.humidity} percent`}
            >
              <div className="forecast-date">
                {new Date(day.dt_txt).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="forecast-desc">{day.weather[0].description}</div>
              <div className="forecast-temp">🌡 {day.main.temp.toFixed(1)}°C</div>
              <div className="forecast-humidity">💧 {day.main.humidity}%</div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
