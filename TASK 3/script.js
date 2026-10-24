/**
 * Weather Forecast Application - Main JavaScript
 * Academic Assignment: Task 3 (Medium)
 *
 * Technologies: Vanilla JavaScript (ES6+), Fetch API, Open-Meteo REST APIs
 * Principles: Clean separation of concerns, robust error handling, secure DOM updates
 */

"use strict";

// ============================================================================
// State Management
// ============================================================================
const AppState = {
  currentLocation: null,   // { name, country, admin1, latitude, longitude }
  lastWeatherResponse: null,
  activeRequestId: 0,      // Incremental counter to prevent race conditions
  isLoading: false
};

// ============================================================================
// DOM Element References
// ============================================================================
const DOM = {
  // Search and Forms
  searchForm: document.getElementById("searchForm"),
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  clearInputBtn: document.getElementById("clearInputBtn"),
  cityChips: document.getElementById("cityChips"),

  // Feedback states
  errorMessage: document.getElementById("errorMessage"),
  errorText: document.getElementById("errorText"),
  dismissErrorBtn: document.getElementById("dismissErrorBtn"),
  loadingIndicator: document.getElementById("loadingIndicator"),
  welcomeCard: document.getElementById("welcomeCard"),

  // Weather Dashboard
  weatherDashboard: document.getElementById("weatherDashboard"),
  cityName: document.getElementById("cityName"),
  countryBadge: document.getElementById("countryBadge"),
  dayNightBadge: document.getElementById("dayNightBadge"),
  dayNightIcon: document.getElementById("dayNightIcon"),
  dayNightText: document.getElementById("dayNightText"),
  lastUpdated: document.getElementById("lastUpdated"),
  refreshBtn: document.getElementById("refreshBtn"),
  refreshIcon: document.getElementById("refreshIcon"),

  // Current weather
  currentWeatherIcon: document.getElementById("currentWeatherIcon"),
  weatherDescription: document.getElementById("weatherDescription"),
  feelsLikeTemp: document.getElementById("feelsLikeTemp"),
  currentTemp: document.getElementById("currentTemp"),
  todayMin: document.getElementById("todayMin"),
  todayMax: document.getElementById("todayMax"),

  // Metric cards
  humidityValue: document.getElementById("humidityValue"),
  windValue: document.getElementById("windValue"),
  precipitationValue: document.getElementById("precipitationValue"),
  todayMinCard: document.getElementById("todayMinCard"),
  todayMaxCard: document.getElementById("todayMaxCard"),

  // 5-Day Forecast
  forecastGrid: document.getElementById("forecastGrid")
};

// ============================================================================
// WMO Weather Code Mappings & SVG Icon Generator
// ============================================================================

/**
 * Maps WMO weather code (0-99) to human-readable condition description.
 * Reference: Open-Meteo WMO Weather Interpretation Codes
 * @param {number} code
 * @returns {string} Human-readable description
 */
function getWeatherDescription(code) {
  const codeMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };

  return codeMap[code] || "Variable conditions";
}

/**
 * Generates an accessible, self-contained SVG weather icon based on code and time of day.
 * Eliminates reliance on external CDNs or image hosts.
 * @param {number} code WMO code
 * @param {boolean} isDay Whether it's daytime
 * @returns {string} Inline SVG markup
 */
function getWeatherIcon(code, isDay = true) {
  // Clear Sky
  if (code === 0) {
    if (isDay) {
      return `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="32" cy="32" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
          <path d="M32 6v6M32 52v6M6 32h6M52 32h6M13.6 13.6l4.2 4.2M46.2 46.2l4.2 4.2M13.6 50.4l4.2-4.2M46.2 17.8l4.2-4.2" stroke="#f59e0b" stroke-width="3"/>
        </svg>`;
    } else {
      return `
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M42 38A18 18 0 1 1 26 22a14 14 0 0 0 16 16z" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>
          <circle cx="48" cy="18" r="1.5" fill="#facc15" stroke="none"/>
          <circle cx="54" cy="28" r="1" fill="#facc15" stroke="none"/>
        </svg>`;
    }
  }

  // Mainly Clear / Partly Cloudy (1, 2)
  if (code === 1 || code === 2) {
    if (isDay) {
      return `
        <svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="24" cy="24" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <path d="M24 8v3M24 37v3M8 24h3M37 24h3M12.7 12.7l2.1 2.1M33.2 33.2l2.1 2.1M12.7 35.3l2.1-2.1M33.2 14.8l2.1-2.1" stroke="#f59e0b" stroke-width="2"/>
          <path d="M46 44a11 11 0 0 0-21.7-2.5A8 8 0 0 0 16 48a8 8 0 0 0 8 8h22a9 9 0 0 0 0-18c-.6 0-1.2.1-1.8.2" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>
        </svg>`;
    } else {
      return `
        <svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M30 26a12 12 0 1 1-10-10 10 10 0 0 0 10 10z" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
          <path d="M46 44a11 11 0 0 0-21.7-2.5A8 8 0 0 0 16 48a8 8 0 0 0 8 8h22a9 9 0 0 0 0-18c-.6 0-1.2.1-1.8.2" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/>
        </svg>`;
    }
  }

  // Overcast (3)
  if (code === 3) {
    return `
      <svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M40 32a10 10 0 0 0-19.6-2.5A7.5 7.5 0 0 0 12 36a7.5 7.5 0 0 0 7.5 7.5h21a8.5 8.5 0 0 0 0-17c-.5 0-1 .1-1.5.2" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
        <path d="M48 44a11 11 0 0 0-21.7-2.5A8 8 0 0 0 18 48a8 8 0 0 0 8 8h22a9 9 0 0 0 0-18c-.6 0-1.2.1-1.8.2" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/>
      </svg>`;
  }

  // Fog (45, 48)
  if (code === 45 || code === 48) {
    return `
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M44 32a9 9 0 0 0-17.7-2A6.5 6.5 0 0 0 18 36a6.5 6.5 0 0 0 6.5 6.5h20a7.5 7.5 0 0 0 0-15c-.5 0-.9.1-1.4.2" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
        <line x1="14" y1="46" x2="50" y2="46" stroke="#94a3b8" stroke-width="3"/>
        <line x1="18" y1="52" x2="46" y2="52" stroke="#94a3b8" stroke-width="3"/>
        <line x1="22" y1="58" x2="42" y2="58" stroke="#cbd5e1" stroke-width="2.5"/>
      </svg>`;
  }

  // Drizzle / Rain Showers / Freezing Rain (51-67, 80-82)
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    const isHeavy = code === 65 || code === 82;
    return `
      <svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M46 36a11 11 0 0 0-21.7-2.5A8 8 0 0 0 16 40a8 8 0 0 0 8 8h22a9 9 0 0 0 0-18c-.6 0-1.2.1-1.8.2" fill="#bfdbfe" stroke="#0284c7" stroke-width="2.5"/>
        <line x1="24" y1="52" x2="20" y2="60" stroke="#0284c7" stroke-width="${isHeavy ? "3.5" : "2.5"}"/>
        <line x1="34" y1="52" x2="30" y2="60" stroke="#0284c7" stroke-width="${isHeavy ? "3.5" : "2.5"}"/>
        <line x1="44" y1="52" x2="40" y2="60" stroke="#0284c7" stroke-width="${isHeavy ? "3.5" : "2.5"}"/>
      </svg>`;
  }

  // Snowfall / Snow Showers (71-77, 85, 86)
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return `
      <svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M46 34a11 11 0 0 0-21.7-2.5A8 8 0 0 0 16 38a8 8 0 0 0 8 8h22a9 9 0 0 0 0-18c-.6 0-1.2.1-1.8.2" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.5"/>
        <circle cx="22" cy="54" r="2.5" fill="#38bdf8" stroke="none"/>
        <circle cx="32" cy="56" r="2.5" fill="#38bdf8" stroke="none"/>
        <circle cx="42" cy="54" r="2.5" fill="#38bdf8" stroke="none"/>
      </svg>`;
  }

  // Thunderstorm (95, 96, 99)
  if (code >= 95) {
    return `
      <svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M46 32a11 11 0 0 0-21.7-2.5A8 8 0 0 0 16 36a8 8 0 0 0 8 8h22a9 9 0 0 0 0-18c-.6 0-1.2.1-1.8.2" fill="#64748b" stroke="#334155" stroke-width="2.5"/>
        <polygon points="31,44 25,54 32,54 29,63 39,51 33,51" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
      </svg>`;
  }

  // Default / Atmospheric fallback
  return `
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="32" cy="32" r="16" fill="#e0f2fe" stroke="#0284c7"/>
    </svg>`;
}

// ============================================================================
// UI Feedback and State Utilities
// ============================================================================

/**
 * Displays error message in the designated banner.
 * @param {string} message
 */
function showError(message) {
  DOM.errorText.textContent = message;
  DOM.errorMessage.style.display = "flex";
}

/**
 * Clears and hides the error banner.
 */
function clearError() {
  DOM.errorText.textContent = "";
  DOM.errorMessage.style.display = "none";
}

/**
 * Toggles the loading spinner and disables action buttons.
 * @param {boolean} isLoading
 */
function showLoading(isLoading = true) {
  AppState.isLoading = isLoading;
  if (isLoading) {
    clearError();
    DOM.loadingIndicator.style.display = "flex";
    DOM.searchBtn.disabled = true;
    DOM.refreshBtn.disabled = true;
    DOM.refreshIcon.classList.add("rotating");
  } else {
    DOM.loadingIndicator.style.display = "none";
    DOM.searchBtn.disabled = false;
    DOM.refreshBtn.disabled = false;
    DOM.refreshIcon.classList.remove("rotating");
  }
}

/**
 * Updates the 'Last Updated' timestamp display.
 */
function updateLastUpdatedTimestamp() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  DOM.lastUpdated.textContent = `Updated: ${timeStr}`;
}

// ============================================================================
// Core API Integration (Open-Meteo Geocoding & Forecast)
// ============================================================================

/**
 * Geocodes a city name to latitude and longitude using Open-Meteo Geocoding API.
 * @param {string} cityName
 * @returns {Promise<Object|null>} Location object or null if not found
 */
async function geocodeCity(cityName) {
  const endpoint = new URL("https://geocoding-api.open-meteo.com/v1/search");
  endpoint.searchParams.set("name", cityName);
  endpoint.searchParams.set("count", "5");
  endpoint.searchParams.set("language", "en");
  endpoint.searchParams.set("format", "json");

  const response = await fetch(endpoint.toString());

  if (!response.ok) {
    throw new Error(`Geocoding service error (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.results) || data.results.length === 0) {
    return null;
  }

  // Select the top match
  const bestMatch = data.results[0];
  return {
    name: bestMatch.name,
    country: bestMatch.country || "",
    countryCode: bestMatch.country_code || "",
    admin1: bestMatch.admin1 || "",
    latitude: bestMatch.latitude,
    longitude: bestMatch.longitude
  };
}

/**
 * Fetches current weather and 5-day daily forecast from Open-Meteo Forecast API.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Weather forecast response object
 */
async function fetchWeather(latitude, longitude) {
  const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
  endpoint.searchParams.set("latitude", latitude.toString());
  endpoint.searchParams.set("longitude", longitude.toString());
  endpoint.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m");
  endpoint.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
  endpoint.searchParams.set("timezone", "auto");
  endpoint.searchParams.set("forecast_days", "5");

  const response = await fetch(endpoint.toString());

  if (!response.ok) {
    throw new Error(`Weather service error (HTTP ${response.status})`);
  }

  const data = await response.json();

  // Validate critical response structure
  if (!data || !data.current || !data.daily) {
    throw new Error("Invalid or incomplete weather data received from service.");
  }

  return data;
}

// ============================================================================
// DOM Rendering Functions
// ============================================================================

/**
 * Renders the current weather conditions into the dashboard.
 * @param {Object} current Current conditions from Open-Meteo
 * @param {Object} daily Daily forecast object for today's extremes
 * @param {Object} location Location details
 */
function renderCurrentWeather(current, daily, location) {
  // Update Location Titles
  DOM.cityName.textContent = location.name;

  let regionDetail = location.country;
  if (location.admin1 && location.admin1 !== location.name) {
    regionDetail = `${location.admin1}, ${location.country}`;
  }
  DOM.countryBadge.textContent = regionDetail || location.countryCode || "Global";

  // Day / Night Indicator
  const isDay = current.is_day === 1;
  DOM.dayNightBadge.className = `day-night-badge ${isDay ? "day" : "night"}`;
  DOM.dayNightIcon.textContent = isDay ? "☀️" : "🌙";
  DOM.dayNightText.textContent = isDay ? "Daytime" : "Nighttime";

  // Current Temperature & Condition
  const currentTemp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const weatherCode = current.weather_code;

  DOM.currentTemp.textContent = isNaN(currentTemp) ? "--" : currentTemp;
  DOM.feelsLikeTemp.textContent = isNaN(feelsLike) ? "--°C" : `${feelsLike}°C`;
  DOM.weatherDescription.textContent = getWeatherDescription(weatherCode);

  // Set Current Weather SVG Icon
  DOM.currentWeatherIcon.innerHTML = getWeatherIcon(weatherCode, isDay);

  // Today's Min & Max
  const todayMin = (daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined)
    ? Math.round(daily.temperature_2m_min[0])
    : "--";
  const todayMax = (daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined)
    ? Math.round(daily.temperature_2m_max[0])
    : "--";

  DOM.todayMin.textContent = todayMin;
  DOM.todayMax.textContent = todayMax;
  DOM.todayMinCard.textContent = todayMin;
  DOM.todayMaxCard.textContent = todayMax;

  // Additional Weather Metrics
  DOM.humidityValue.textContent = current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : "--";
  DOM.windValue.textContent = current.wind_speed_10m !== undefined ? Math.round(current.wind_speed_10m) : "--";
  DOM.precipitationValue.textContent = current.precipitation !== undefined ? current.precipitation.toFixed(1) : "0.0";
}

/**
 * Formats a date string ('YYYY-MM-DD') into a user-friendly day name & date label.
 * @param {string} dateStr
 * @param {number} index
 * @returns {{ dayLabel: string, dateLabel: string }}
 */
function formatForecastDate(dateStr, index) {
  if (index === 0) {
    return { dayLabel: "Today", dateLabel: "Current" };
  }
  if (index === 1) {
    return { dayLabel: "Tomorrow", dateLabel: formatShortDate(dateStr) };
  }

  // Parse YYYY-MM-DD using local time parts to prevent timezone offsets
  const parts = dateStr.split("-");
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

  const dayLabel = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const dateLabel = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return { dayLabel, dateLabel };
}

/**
 * Formats YYYY-MM-DD into "Mon, Day" (e.g. "Oct 24")
 * @param {string} dateStr
 * @returns {string}
 */
function formatShortDate(dateStr) {
  const parts = dateStr.split("-");
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Renders the 5-day daily forecast cards using safe DOM operations.
 * @param {Object} daily Daily weather data from Open-Meteo
 */
function renderForecast(daily) {
  // Clear previous forecast cards safely
  DOM.forecastGrid.textContent = "";

  if (!daily || !Array.isArray(daily.time)) {
    const emptyNotice = document.createElement("p");
    emptyNotice.textContent = "Forecast data is currently unavailable.";
    emptyNotice.className = "forecast-empty";
    DOM.forecastGrid.appendChild(emptyNotice);
    return;
  }

  const daysCount = Math.min(daily.time.length, 5);

  for (let i = 0; i < daysCount; i++) {
    const dateStr = daily.time[i];
    const weatherCode = daily.weather_code[i];
    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);
    const { dayLabel, dateLabel } = formatForecastDate(dateStr, i);

    // Build card container
    const card = document.createElement("div");
    card.className = `forecast-card ${i === 0 ? "today-highlight" : ""}`;

    // Day title
    const dayElem = document.createElement("span");
    dayElem.className = "forecast-day";
    dayElem.textContent = dayLabel;

    // Date sub-label
    const dateElem = document.createElement("span");
    dateElem.className = "forecast-date";
    dateElem.textContent = dateLabel;

    // Weather Icon Container
    const iconElem = document.createElement("div");
    iconElem.className = "forecast-icon";
    iconElem.innerHTML = getWeatherIcon(weatherCode, true);

    // Condition description
    const condElem = document.createElement("span");
    condElem.className = "forecast-cond";
    condElem.textContent = getWeatherDescription(weatherCode);

    // Temperatures row
    const tempsElem = document.createElement("div");
    tempsElem.className = "forecast-temps";

    const maxElem = document.createElement("span");
    maxElem.className = "forecast-max";
    maxElem.textContent = `${maxTemp}°`;
    maxElem.title = `High: ${maxTemp}°C`;

    const dividerElem = document.createElement("span");
    dividerElem.textContent = "/";
    dividerElem.style.color = "var(--text-subtle)";

    const minElem = document.createElement("span");
    minElem.className = "forecast-min";
    minElem.textContent = `${minTemp}°`;
    minElem.title = `Low: ${minTemp}°C`;

    tempsElem.appendChild(maxElem);
    tempsElem.appendChild(dividerElem);
    tempsElem.appendChild(minElem);

    // Assemble card
    card.appendChild(dayElem);
    card.appendChild(dateElem);
    card.appendChild(iconElem);
    card.appendChild(condElem);
    card.appendChild(tempsElem);

    DOM.forecastGrid.appendChild(card);
  }
}

// ============================================================================
// Workflow Controllers: Search & Refresh
// ============================================================================

/**
 * Main search controller: validates input, geocodes, fetches weather, and renders dashboard.
 * @param {string} queryCity
 */
async function searchCity(queryCity) {
  const trimmedCity = queryCity.trim();

  // Validate user input
  if (!trimmedCity) {
    showError("Please enter a city name to search.");
    DOM.cityInput.focus();
    return;
  }

  // Prevent race conditions with monotonic request tracking
  const requestId = ++AppState.activeRequestId;

  showLoading(true);

  try {
    // 1. Geocode city name to coordinates
    const location = await geocodeCity(trimmedCity);

    // Guard against race condition: check if a newer search was started
    if (requestId !== AppState.activeRequestId) {
      return;
    }

    if (!location) {
      showError(`No location found matching "${trimmedCity}". Please check the spelling and try again.`);
      return;
    }

    // 2. Fetch live weather forecast for coordinates
    const weatherData = await fetchWeather(location.latitude, location.longitude);

    if (requestId !== AppState.activeRequestId) {
      return;
    }

    // 3. Cache state for refresh capability
    AppState.currentLocation = location;
    AppState.lastWeatherResponse = weatherData;

    // 4. Render to DOM
    renderCurrentWeather(weatherData.current, weatherData.daily, location);
    renderForecast(weatherData.daily);
    updateLastUpdatedTimestamp();

    // 5. Reveal dashboard and hide welcome card
    DOM.welcomeCard.style.display = "none";
    DOM.weatherDashboard.style.display = "block";
    clearError();

  } catch (err) {
    if (requestId !== AppState.activeRequestId) {
      return;
    }

    console.error("Error fetching weather forecast:", err);

    if (!navigator.onLine) {
      showError("Network connection unavailable. Please check your internet connection.");
    } else {
      showError(err.message || "Failed to retrieve weather data. Please try again.");
    }
  } finally {
    if (requestId === AppState.activeRequestId) {
      showLoading(false);
    }
  }
}

/**
 * Refreshes weather data for the currently selected city.
 */
async function refreshWeather() {
  if (!AppState.currentLocation) {
    showError("Please search for a city first before refreshing.");
    return;
  }

  const { latitude, longitude, name } = AppState.currentLocation;
  const requestId = ++AppState.activeRequestId;

  showLoading(true);

  try {
    const weatherData = await fetchWeather(latitude, longitude);

    if (requestId !== AppState.activeRequestId) {
      return;
    }

    AppState.lastWeatherResponse = weatherData;

    renderCurrentWeather(weatherData.current, weatherData.daily, AppState.currentLocation);
    renderForecast(weatherData.daily);
    updateLastUpdatedTimestamp();
    clearError();

  } catch (err) {
    if (requestId !== AppState.activeRequestId) {
      return;
    }
    console.error("Error refreshing weather forecast:", err);
    showError(`Failed to refresh weather for ${name}: ${err.message}`);
  } finally {
    if (requestId === AppState.activeRequestId) {
      showLoading(false);
    }
  }
}

// ============================================================================
// Event Listeners & Initialization
// ============================================================================

/**
 * Initializes all user interaction handlers.
 */
function initEventListeners() {
  // Submit via form submit (handles Search button and Enter key)
  DOM.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchCity(DOM.cityInput.value);
  });

  // Clear button logic
  DOM.cityInput.addEventListener("input", () => {
    DOM.clearInputBtn.style.display = DOM.cityInput.value.length > 0 ? "flex" : "none";
    if (DOM.errorText.textContent) {
      clearError();
    }
  });

  DOM.clearInputBtn.addEventListener("click", () => {
    DOM.cityInput.value = "";
    DOM.clearInputBtn.style.display = "none";
    DOM.cityInput.focus();
  });

  // Popular City Quick-Select Chips
  DOM.cityChips.addEventListener("click", (e) => {
    const target = e.target.closest(".chip-btn");
    if (!target) return;
    const selectedCity = target.getAttribute("data-city");
    if (selectedCity) {
      DOM.cityInput.value = selectedCity;
      DOM.clearInputBtn.style.display = "flex";
      searchCity(selectedCity);
    }
  });

  // Refresh Weather button
  DOM.refreshBtn.addEventListener("click", () => {
    refreshWeather();
  });

  // Dismiss Error banner button
  DOM.dismissErrorBtn.addEventListener("click", () => {
    clearError();
  });
}

// Start application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
});
