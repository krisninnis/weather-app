import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/weather.scss";

import Home from "./pages/Home";
import Forecast from "./components/Forecast";
import Settings from "./pages/Settings";
import About from "./pages/About";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="logo">WeatherApp</div>
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
        </header>

        <div className="main-content">
          <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/forecast" onClick={() => setMenuOpen(false)}>
                  Forecast
                </Link>
              </li>
              <li>
                <Link to="/settings" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
              </li>
            </ul>
          </nav>

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
