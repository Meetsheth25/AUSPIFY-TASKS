# To-Do List Application — Task 2

A clean, responsive, and intuitive To-Do List application built using **HTML5**, **CSS3**, **Vanilla JavaScript**, and browser **Local Storage**.

---

## 1. Project Overview

This application provides a daily task management solution where users can:
- Add new tasks dynamically using either the **Add Task** button or the **Enter** key.
- Mark tasks as completed or revert them to active status with custom styled checkboxes.
- Delete individual tasks without impacting other tasks.
- Keep all tasks saved in the browser's `localStorage` so data survives page refreshes and browser restarts.
- Track real-time summary statistics: **Total**, **Completed**, and **Remaining** tasks.
- View a friendly empty state when all tasks are cleared.

---

## 2. Project Structure

```
todo-list/
├── index.html       # Semantic HTML5 markup, accessibility attributes, and metadata
├── style.css        # Responsive styling, light productivity theme, CSS variables, and layout
├── script.js        # Vanilla JavaScript data model, Local Storage persistence, and DOM manipulation
└── README.md        # Comprehensive documentation and running instructions
```

---

## 3. Technology Stack

- **HTML5**: Semantic tags (`<main>`, `<article>`, `<header>`, `<section>`, `<ul>`, `<li>`, `<footer>`), forms, and ARIA accessibility labels.
- **CSS3**: Modern Flexbox, CSS Grid, custom CSS variables, responsive `clamp()` units, custom checkboxes, and animations.
- **Vanilla JavaScript (ES6+)**: Pure client-side JavaScript without external libraries, frameworks, or bundlers.
- **Web Storage API (`localStorage`)**: Browser-native persistent storage using JSON serialization.

---

## 4. Key Programming Concepts Explained

### A. JavaScript Arrays and Objects
- **Data Model**: Every task is modeled as an object:
  ```javascript
  {
    id: "task_...",       // Unique string identifier
    text: "Finish report",// Task description string
    completed: false,     // Boolean completion flag
    createdAt: 1729600000 // Creation timestamp
  }
  ```
- **Array Storage**: The application maintains an in-memory array `tasks = []`.
- **Array Methods**:
  - `tasks.push(newTask)`: Appends newly created tasks.
  - `tasks.filter(t => t.id !== id)`: Removes the specified task without mutating other items.
  - `tasks.find(t => t.id === id)`: Locates a task by its unique ID for toggling completion.
  - `tasks.filter(t => t.completed).length`: Computes the number of completed tasks.

### B. Safe DOM Manipulation
- Elements are created using `document.createElement('li')`, `document.createElement('span')`, etc.
- Task descriptions are injected strictly via **`element.textContent`** rather than `innerHTML`. This guarantees that user input (such as `<script>` or HTML tags) is rendered as safe literal text, eliminating Cross-Site Scripting (XSS) risks.
- Event delegation on the `<ul>` element intercepts clicks on delete buttons and changes on checkboxes efficiently.

### C. Browser Local Storage
- **Saving Data**: `localStorage.setItem('todoTasks', JSON.stringify(tasks))` converts the array of objects into a JSON string and writes it to browser storage.
- **Loading Data**: `const stored = localStorage.getItem('todoTasks')` reads the string, and `JSON.parse(stored)` converts it back into an active JavaScript array.
- **Error Handling**: Both read and write operations are wrapped in `try...catch` blocks to protect against malformed JSON or storage quota errors.

---

## 5. How to Run Locally

### Option 1: Direct File Open (Simplest)
1. Navigate to `todo-list/index.html`.
2. Double-click `index.html` or open it with any web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Option 2: Local HTTP Server
Using Python's built-in HTTP server:
```bash
# In your terminal, navigate to the folder
cd "todo-list"

# Launch local server
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your web browser.

---

## 6. Assignment Requirements Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **No External Libraries** | Pure HTML5, CSS3, Vanilla JS, and `localStorage` | Verified |
| **Title & Subtitle** | "My To-Do List" & "Organize your day, one task at a time." | Verified |
| **Task Input & Add Button** | Accessible text input with "What needs to get done?" placeholder | Verified |
| **Add via Enter & Button** | Supported via standard form submit event listener | Verified |
| **Reject Empty Tasks** | Whitespace-trimmed; empty strings ignored without error | Verified |
| **Unique IDs** | `crypto.randomUUID()` with timestamp fallback | Verified |
| **Mark as Completed** | Custom checkbox toggles `completed` boolean and strikethrough styling | Verified |
| **Delete Individual Tasks** | Delete button with trash icon removes selected task by ID | Verified |
| **Local Storage Persistence** | Automatic `saveTasks()` and `loadTasks()` using key `todoTasks` | Verified |
| **Dynamic Counters** | Total, Completed, and Remaining counts calculated from array | Verified |
| **Friendly Empty State** | "You're all caught up! Add a task to get started." shown when tasks = 0 | Verified |
| **XSS Protection** | Uses `textContent` for user text insertion | Verified |
| **Responsive Design** | Flexbox, Grid, clamp(), tested across mobile, tablet, and desktop | Verified |
| **Isolated Folder** | Restricted strictly to `todo-list/`; Task 1 files left untouched | Verified |
