/**
 * Digital Clock Application
 * Real-time clock using Vanilla JavaScript and DOM manipulation
 */

// Cache DOM element references for efficient updates
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const ampmElement = document.getElementById('ampm');
const dateTextElement = document.getElementById('dateText');

/**
 * Main clock update function:
 * 1. Retrieves the current local system time via new Date().
 * 2. Extracts hours, minutes, and seconds.
 * 3. Converts hours to 12-hour format and determines AM/PM period.
 * 4. Applies leading zero padding with String().padStart(2, '0').
 * 5. Updates the DOM elements with formatted values.
 * 6. Updates the full calendar date (e.g., "Thursday, October 22, 2026").
 */
function updateClock() {
  // Step 1: Fetch the current local system time
  const now = new Date();

  // Step 2: Retrieve raw hours (0-23), minutes (0-59), and seconds (0-59)
  const rawHours = now.getHours();
  const rawMinutes = now.getMinutes();
  const rawSeconds = now.getSeconds();

  // Step 3: Determine AM or PM and convert to 12-hour format
  // If hours is >= 12 it is PM, otherwise AM
  const meridiem = rawHours >= 12 ? 'PM' : 'AM';

  // In 12-hour format: 0 becomes 12 (midnight), 13-23 becomes 1-11, 12 remains 12 (noon)
  const hours12 = rawHours % 12 || 12;

  // Step 4: Format each component with a leading zero if it is a single digit
  const formattedHours = String(hours12).padStart(2, '0');
  const formattedMinutes = String(rawMinutes).padStart(2, '0');
  const formattedSeconds = String(rawSeconds).padStart(2, '0');

  // Step 5: Update the time elements in the DOM
  if (hoursElement) hoursElement.textContent = formattedHours;
  if (minutesElement) minutesElement.textContent = formattedMinutes;
  if (secondsElement) secondsElement.textContent = formattedSeconds;
  if (ampmElement) ampmElement.textContent = meridiem;

  // Step 6: Format and update the current day and date
  // Example result: "Thursday, October 22, 2026"
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = now.toLocaleDateString('en-US', dateOptions);

  if (dateTextElement) {
    dateTextElement.textContent = formattedDate;
  }
}

// Step 7: Call updateClock immediately on page load so the clock renders without delay
updateClock();

// Step 8: Refresh the clock every second (1000 milliseconds) without duplicate intervals
setInterval(updateClock, 1000);
