# Digital Clock Application — JavaScript Assignment

A responsive, modern real-time Digital Clock built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**.

---

## Project Structure

```
digital-clock/
├── index.html       # HTML5 semantic structure and metadata
├── style.css        # CSS3 custom styling, layout, glassmorphism, animations, and media queries
├── script.js        # Vanilla JavaScript real-time clock logic & DOM updates
└── README.md        # Documentation and running instructions
```

---

## Features

- **Real-Time Accuracy**: Fetches current local system time using JavaScript's native `Date` object (`new Date()`).
- **Smooth 1-Second Updates**: Refreshes seamlessly every 1,000ms using `setInterval()`, initialized immediately on load to prevent rendering delay.
- **Consistent 12-Hour Time Format**: Displays hours, minutes, seconds, and an AM/PM period indicator.
- **Two-Digit Formatting**: Uses `String().padStart(2, '0')` to guarantee consistent double-digit displays (e.g., `09:05:07`).
- **Live Day & Date Display**: Formats full calendar date (e.g., `Thursday, October 22, 2026`) and updates automatically when the calendar day changes.
- **Status Indicator**: Features a glowing pulsing green dot with a `"LIVE CLOCK"` label.
- **No Layout Jitter**: Employs monospaced typography with `font-variant-numeric: tabular-nums;` ensuring digits do not shift horizontally when numbers change.
- **Fully Responsive**: Adapts across mobile, tablet, and desktop screens using Flexbox and dynamic `clamp()` font scaling.
- **Zero External Dependencies**: Pure vanilla code without frameworks, external APIs, or libraries.

---

## How the Application Works

1. **`updateClock()` Execution**:
   - `const now = new Date();` captures the current system timestamp.
   - `rawHours`, `rawMinutes`, and `rawSeconds` are extracted using `.getHours()`, `.getMinutes()`, and `.getSeconds()`.
   - The hour is converted to 12-hour format (`rawHours % 12 || 12`) and the period is determined (`rawHours >= 12 ? 'PM' : 'AM'`).
   - Each number is converted to a string and padded to 2 digits using `.padStart(2, '0')`.
   - The DOM elements are updated with the formatted text.
   - The date is localized using `toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })`.
2. **Immediate Invocation & Interval**:
   - `updateClock()` is invoked once immediately when the script executes, preventing a 1-second blank or placeholder delay.
   - `setInterval(updateClock, 1000)` continues running the function precisely once every 1,000 milliseconds.

---

## How to Run Locally

### Option 1: Direct File Open
Double-click `digital-clock/index.html` or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Web Server
You can serve the directory using Python's built-in HTTP server:
```bash
# Navigate to the project directory
cd digital-clock

# Run Python's HTTP server
python -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.
