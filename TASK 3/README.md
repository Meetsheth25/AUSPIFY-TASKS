# Weather Forecast Application

A modern, responsive, real-time Weather Forecast Application built with standard **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**. This application connects directly to the Open-Meteo REST APIs to provide real-time meteorological conditions and an accurate 5-day daily forecast for any city worldwide.

Developed as **Task 3 (Medium)** for the Web Development Academic Internship Assignment.

---

## 📌 Project Overview

- **Application Title**: Weather Forecast
- **Subtitle**: Real-time weather for your city
- **Architecture**: Single Page Application (SPA), Client-side REST integration, Zero framework dependencies
- **Data Providers**:
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
  - [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

---

## 🚀 Key Features

### 1. City Search & Geocoding
- Search for any global city by name.
- Trigger search using either the **Search** button or the **Enter** key.
- Quick-select chips for popular cities (London, Tokyo, New York, Paris, Mumbai).
- Input trimming, empty-query rejection, and clear input button.
- Resolves geographical coordinates (latitude and longitude) using the Open-Meteo Geocoding API.

### 2. Live Current Weather Display
- Prominent current temperature in degrees Celsius (°C).
- WMO condition description mapped from official WMO weather codes (e.g., Clear sky, Overcast, Moderate rain, Thunderstorm).
- Self-contained crisp inline SVG weather illustrations that dynamically adapt to **day** or **night**.
- Apparent ("Feels like") temperature.
- Day / Night indicator badge.
- Selected city, state/region, and country badge.

### 3. Detailed Weather Metrics
- **Relative Humidity**: Percentage of moisture in the atmosphere.
- **Wind Speed**: 10-meter surface wind speed in km/h.
- **Precipitation**: Liquid-equivalent rainfall in millimeters (mm).
- **Today's Temperature Range**: Daily minimum and maximum temperature boundaries.

### 4. 5-Day Daily Forecast
- Displays today's forecast alongside 4 upcoming days.
- Accurate date formatting with weekday name and calendar date.
- Dedicated weather icons and condition text for each forecast day.
- High and low temperature projections.

### 5. Live Refresh & State Management
- **Refresh Weather** button to re-query the latest weather data for the current active city.
- Live formatted timestamp indicating when data was last updated.
- Visual rotation animation on the refresh icon during fetch operations.

### 6. Robust Error Handling & Loading States
- **Empty input validation**: Friendly warning near the search box.
- **Unknown city**: Clear notification when no geographic coordinates match the query.
- **Network / Offline detection**: Informative prompt when internet connectivity is lost.
- **HTTP & Service errors**: Graceful fallback with specific status details.
- **Race condition prevention**: Monotonic request identifier ensures older, slow responses never overwrite newer user queries.
- Clean loading spinner with accessible `aria-live` attributes.

---

## 💻 Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Structure** | HTML5 | Semantic elements (`<header>`, `<main>`, `<section>`, `<form>`, `<footer>`), ARIA attributes |
| **Styling** | CSS3 | Responsive layout (CSS Grid & Flexbox), CSS Custom Properties (Tokens), Keyframe animations |
| **Logic** | Vanilla JavaScript | ES6+ async/await, Fetch API, DOM manipulation, WMO code interpretation |
| **APIs** | Open-Meteo REST APIs | Free, open-source weather and geocoding endpoints (no API key required) |

*Strictly no React, Vue, jQuery, Bootstrap, Tailwind, backend servers, or third-party runtime libraries were used.*

---

## 📂 Project Structure

```
weather-forecast/
├── index.html       # Semantic dashboard structure and ARIA live regions
├── style.css        # Responsive layouts, tokens, cards, and animations
├── script.js        # Geocoding, Fetch API logic, DOM rendering, and error handling
└── README.md        # Comprehensive documentation and viva preparation guide
```

---

## ⚙️ Running the Application Locally

The application runs directly in any modern browser without requiring build steps, node modules, or compile scripts.

### Option 1: Direct File Opening
Double-click `index.html` or right-click and choose **Open with** -> **Google Chrome** (or Edge/Firefox/Safari).

### Option 2: Using a Lightweight HTTP Server
If using VS Code / Python / Node:
```bash
# Using Python 3:
cd weather-forecast
python -m http.server 8080

# Or using Node http-server:
npx http-server . -p 8080
```
Open your browser to: `http://localhost:8080`

---

## 🎓 Academic Viva & Technical Explanation

### 1. What is the Fetch API?
The `fetch()` API is a modern, native JavaScript interface for making asynchronous HTTP requests over the network. It replaces older `XMLHttpRequest` with a cleaner, Promise-based architecture.

```javascript
const response = await fetch(endpointUrl);
if (!response.ok) {
  throw new Error(`HTTP error ${response.status}`);
}
const data = await response.json();
```

### 2. What is JSON and how is it parsed?
**JSON** (JavaScript Object Notation) is a lightweight, language-independent data-interchange text format.
When an API responds with JSON text, `response.json()` reads the response stream to completion and parses the text into native JavaScript objects and arrays.

### 3. How does `async` / `await` simplify asynchronous programming?
`async` and `await` are syntactic sugar over JavaScript Promises:
- Marking a function `async` ensures it automatically returns a Promise.
- `await` pauses execution inside the async function until the Promise settles (resolves or rejects).
- Standard `try / catch / finally` blocks can be used for intuitive, readable error handling without nested `.then()` callbacks ("callback hell").

### 4. How does the 2-Step API Integration work?
1. **Step 1: Geocoding**:
   The user enters a city name (e.g. `"London"`). The Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search?name=London`) resolves this string into geographic coordinates:
   - Latitude: `51.50853`
   - Longitude: `-0.12574`
2. **Step 2: Weather Forecast**:
   The coordinates are passed to the Open-Meteo Forecast API (`https://api.open-meteo.com/v1/forecast?latitude=51.50853&longitude=-0.12574&current=...&daily=...`). The API returns real-time weather metrics and daily projections.

### 5. Why are inline SVGs used for icons?
- **Zero CDN reliance**: Renders reliably even in offline or restricted environments.
- **Crisp on high-DPI screens**: Vector graphics scale cleanly at any resolution.
- **Fast performance**: No extra HTTP round-trips to download image files.

---

## ✅ Requirement-by-Requirement Testing Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **Title & Subtitle** | "Weather Forecast" & "Real-time weather for your city" in `<header>` | Pass |
| **City Search Input & Button** | `<input id="cityInput">` with `<button id="searchBtn">` | Pass |
| **Enter Key Support** | Handled natively by `<form id="searchForm">` submit listener | Pass |
| **Input Validation** | Rejects empty or whitespace-only inputs with friendly alert | Pass |
| **Open-Meteo Geocoding** | Queries `https://geocoding-api.open-meteo.com/v1/search` with URLSearchParams | Pass |
| **Open-Meteo Forecast** | Queries `https://api.open-meteo.com/v1/forecast` with `current` & `daily` fields | Pass |
| **Real API Data** | Actual temperatures, conditions, and dates displayed (no mock data) | Pass |
| **Current Weather Details** | Temp in °C, Feels-like, Condition text, City & Country badge | Pass |
| **Day / Night Indicator** | Evaluates `current.is_day` to display Day ☀️ / Night 🌙 badge & icons | Pass |
| **Additional Weather Cards** | Humidity (%), Wind Speed (km/h), Precipitation (mm), Today's Min/Max | Pass |
| **5-Day Forecast** | Responsive 5-card grid with Day, Date, Icon, Condition, and Min/Max temps | Pass |
| **Refresh Weather Button** | Re-queries coordinates of active city; updates last-updated timestamp | Pass |
| **Loading State** | Animated spinner appears during network requests; disables buttons | Pass |
| **Error Handling** | Unknown city, network down, and HTTP errors displayed near search area | Pass |
| **Responsive Design** | Fluid layouts on Mobile (<600px), Tablet (<820px), and Desktop (>820px) | Pass |
| **Security & Quality** | Uses `textContent` and safe DOM construction to prevent XSS | Pass |

---

## 🔒 Folder Protection Confirmation

All files for Task 3 are strictly isolated within the `TASK 3` directory:
- `m:/Mit/INTERNSHIP/AUSPIFY/TASK 3/weather-forecast/index.html`
- `m:/Mit/INTERNSHIP/AUSPIFY/TASK 3/weather-forecast/style.css`
- `m:/Mit/INTERNSHIP/AUSPIFY/TASK 3/weather-forecast/script.js`
- `m:/Mit/INTERNSHIP/AUSPIFY/TASK 3/weather-forecast/README.md`

No files in Task 1, Task 2, or any root or shared repository directories were modified or created.
