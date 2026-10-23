# Task 4 – Interactive Quiz Application

A responsive, interactive Quiz Application developed using **HTML5**, **CSS3**, and **Vanilla JavaScript**. The application features an active countdown timer, 10 predefined multiple-choice questions across diverse categories, single-selection answer locking, real-time score calculation, and a comprehensive post-quiz results breakdown.

---

## 🌟 Key Features

1. **Diverse Question Bank**:
   - 10 curated multiple-choice questions spanning Science, Technology, General Knowledge, and Everyday Facts.
   - Structured in a modular JavaScript array of objects with question IDs, categories, topics, four options, and correct answers.

2. **Accurate Countdown Timer**:
   - 30-second visible countdown for every question with animated circular SVG indicator.
   - Dynamic 5-second warning state featuring a pulsing crimson alert glow.
   - Automatic timeout handling that records unanswered questions with 0 points and smoothly advances.
   - Thorough timer cleanup ensuring no overlapping intervals or negative counters.

3. **Single Selection & Answer Locking**:
   - Users select one option per question; duplicate clicks and multi-selection are strictly prevented.
   - Immediate visual feedback on selection: correct answers glow emerald green, incorrect choices highlight crimson with the correct option revealed.
   - Answer submission is required before the "Next Question" or "Finish Quiz" navigation button unlocks.

4. **Detailed Results & Analytics**:
   - Final score display (e.g. `8/10`) alongside calculated percentage accuracy.
   - Breakdown metrics grid showing **Correct**, **Incorrect**, and **Unanswered** counts.
   - Performance tier feedback message and dynamic trophy badge.
   - Expandable **Question Review Accordion** showing question-by-question user choices vs correct answers.

5. **Smooth Restart Mechanism**:
   - The "Restart Quiz" button completely re-initializes all state, timers, scores, and progress without needing a page refresh.

---

## 📂 Project Structure

```
TASK 4/
├── quiz-app/
│   ├── index.html       # Application semantic layout & screen sections
│   ├── style.css        # Responsive styling, glassmorphism, animations & tokens
│   ├── script.js        # Core quiz engine, timer, scoring, and DOM rendering
│   └── README.md        # Dedicated application documentation
├── index.html           # Root quick launcher / direct application loader
└── README.md            # Task 4 root documentation
```

---

## 🚀 How to Run Locally

You can run the Quiz Application in any modern web browser using either of the following methods:

### Method 1: Using Python Built-in HTTP Server (Recommended)
From PowerShell / terminal in the `TASK 4` directory:
```bash
python -m http.server 8084
```
Then navigate to:
```
http://localhost:8084/quiz-app/index.html
```
or simply:
```
http://localhost:8084/
```

### Method 2: Direct File Open
Simply double-click or drag-and-drop `quiz-app/index.html` into your browser (Chrome, Edge, Firefox, Safari).

---

## 🧪 Testing Checklist Verification

- [x] **Intro Screen**: Displays title, guidelines, and active Start button.
- [x] **Question & Options Rendering**: Renders questions with 4 distinct choices (A, B, C, D).
- [x] **Answer Locking**: Selecting an option locks choices and prevents re-selection.
- [x] **Score Tracking**: Correct choices award 1 point; incorrect award 0 points.
- [x] **Navigation Guard**: Next button disabled until an option is picked or timer expires.
- [x] **Countdown Timer**: 30-second countdown updates smoothly each second.
- [x] **Warning Pulse**: Visual warning triggers when 5 seconds remain.
- [x] **Timeout Transition**: Unanswered questions score 0 and advance after a brief notification.
- [x] **Results Screen**: Accurately aggregates final score, accuracy %, correct, incorrect, and unanswered.
- [x] **Review Accordion**: Displays detailed answer breakdown for every question.
- [x] **Seamless Restart**: Resets all state and re-enables a fresh quiz run without page reload.
- [x] **Responsive Layout**: Adapts smoothly to mobile (<640px), tablet, and desktop viewports.
