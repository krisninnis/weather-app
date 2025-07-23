import React, { useState } from "react";

const settingsData = {
  units: {
    label: "Temperature Units",
    options: [
      { value: "metric", label: "Celsius (°C)" },
      { value: "imperial", label: "Fahrenheit (°F)" },
      { value: "standard", label: "Kelvin (K)" },
    ],
    default: "metric",
  },
  language: {
    label: "Language",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
      { value: "zh", label: "Chinese" },
      { value: "ar", label: "Arabic" },
    ],
    default: "en",
  },
  theme: {
    label: "Theme",
    options: [
      { value: "light", label: "Light Mode" },
      { value: "dark", label: "Dark Mode" },
      { value: "system", label: "Use System Preference" },
    ],
    default: "system",
  },
  notifications: {
    label: "Notifications",
    options: [
      { value: "on", label: "Enable Weather Alerts" },
      { value: "off", label: "Disable Weather Alerts" },
    ],
    default: "off",
  },
};

export default function Settings() {
  const [units, setUnits] = useState(settingsData.units.default);
  const [language, setLanguage] = useState(settingsData.language.default);
  const [theme, setTheme] = useState(settingsData.theme.default);
  const [notifications, setNotifications] = useState(
    settingsData.notifications.default
  );

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="setting-group">
        <label htmlFor="units-select">{settingsData.units.label}</label>
        <select
          id="units-select"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        >
          {settingsData.units.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="language-select">{settingsData.language.label}</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {settingsData.language.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="theme-select">{settingsData.theme.label}</label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {settingsData.theme.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label htmlFor="notifications-select">{settingsData.notifications.label}</label>
        <select
          id="notifications-select"
          value={notifications}
          onChange={(e) => setNotifications(e.target.value)}
        >
          {settingsData.notifications.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
