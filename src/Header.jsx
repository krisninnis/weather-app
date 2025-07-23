import React from "react";

const cities = [
  { name: "London" },
  { name: "New York" },
  { name: "Tokyo" },
  { name: "Paris" },
  { name: "Sydney" },
  { name: "Berlin" },
  { name: "Toronto" },
];

export default function Header({ fetchWeatherForCity }) {
  return (
    <header className="header">
      <img src="/assets/logo.svg" alt="Logo" className="logo" />

      <nav className="nav-menu">
        <ul>
          <li className="weather-dropdown">
            <span>Weather</span>
            <ul className="dropdown-list">
              {cities.map((city, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => fetchWeatherForCity(city.name)}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
