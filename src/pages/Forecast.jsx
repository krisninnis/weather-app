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
  const [unit, setUnit] = useState("metric");
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [wind, setWind] = useState(null);

  const dropdownRef = useRef(null);

  const getWeatherClass = (main) => {
    const condition = main.toLowerCase();
    if (condition.includes("cloud")) return "cloudy";
    if (condition.includes("rain")) return "rainy";
    if (condition.includes("snow")) return "snowy";
    if (condition.includes("storm") || condition.includes("thunder")) return "stormy";
    if (condition.includes("fog") || condition.includes("mist") || condition.includes("haze")) return "foggy";
    if (condition.includes("clear")) return "sunny";
    return "";
  };

  useEffect(() => {
    setFilteredCities(cities);
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError("");
      setForecast([]);
      setSunrise(null);
      setSunset(null);
      setWind(null);

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=${unit}`
        );
        if (!res.ok) throw new Error("Could not load forecast.");

        const data = await res.json();
        const dailyForecast = data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

        setForecast(dailyForecast.slice(0, 5));

        // Fetch current weather for sunrise/sunset/wind
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=${unit}`
        );
        const current = await currentRes.json();
        setSunrise(new Date(current.sys.sunrise * 1000).toLocaleTimeString());
        setSunset(new Date(current.sys.sunset * 1000).toLocaleTimeString());
        setWind(current.wind.speed);
      } catch {
        setError("Could not load forecast.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchForecast();
    }
  }, [selectedCity, unit]);

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
        <button
          className="unit-toggle"
          onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
        >
          Show in °{unit === "metric" ? "F" : "C"}
        </button>
      </div>

      {loading && <div className="forecast-loading">Loading forecast...</div>}
      {error && <div className="forecast-error">{error}</div>}

      {sunrise && sunset && wind !== null && (
        <div className="extra-info">
          🌅 Sunrise: <strong>{sunrise}</strong> | 🌇 Sunset:{" "}
          <strong>{sunset}</strong> | 💨 Wind: <strong>{wind} {unit === "metric" ? "m/s" : "mph"}</strong>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-results">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {forecast.map((day) => {
              const date = new Date(day.dt_txt);
              return (
                <div
                  className={`forecast-day ${getWeatherClass(
                    day.weather[0].main
                  )}`}
                  key={day.dt}
                >
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
                    {Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}
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
