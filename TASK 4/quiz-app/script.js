(() => {
  'use strict';

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      category: 'Science',
      topic: 'Atmospheric Science',
      question: 'What is the most abundant gas in Earth\'s atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      correctIndex: 1
    },
    {
      id: 2,
      category: 'Technology',
      topic: 'Web Security',
      question: 'Which network protocol encrypts web traffic to ensure private and secure data transmission?',
      options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
      correctIndex: 2
    },
    {
      id: 3,
      category: 'General Knowledge',
      topic: 'Astronomy',
      question: 'Which planet in our solar system has the highest number of recognized natural moons?',
      options: ['Jupiter', 'Saturn', 'Mars', 'Neptune'],
      correctIndex: 1
    },
    {
      id: 4,
      category: 'Science',
      topic: 'Chemistry',
      question: 'What is the chemical element symbol for Gold on the Periodic Table?',
      options: ['Ag', 'Au', 'Fe', 'Gd'],
      correctIndex: 1
    },
    {
      id: 5,
      category: 'Technology',
      topic: 'Computing History',
      question: 'Who is recognized as the inventor of the World Wide Web in 1989 at CERN?',
      options: ['Tim Berners-Lee', 'Alan Turing', 'Steve Wozniak', 'Ada Lovelace'],
      correctIndex: 0
    },
    {
      id: 6,
      category: 'General Knowledge',
      topic: 'Geography',
      question: 'Which river is internationally regarded as the longest river in the world?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
      correctIndex: 1
    },
    {
      id: 7,
      category: 'Everyday Facts',
      topic: 'Human Health',
      question: 'Which essential vitamin is produced in human skin through direct exposure to sunlight?',
      options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin B12'],
      correctIndex: 2
    },
    {
      id: 8,
      category: 'Technology',
      topic: 'Computer Hardware',
      question: 'In computer architecture, what does the acronym "RAM" stand for?',
      options: ['Read Access Memory', 'Random Access Memory', 'Rapid Action Module', 'Remote Auxiliary Memory'],
      correctIndex: 1
    },
    {
      id: 9,
      category: 'Science',
      topic: 'Human Anatomy',
      question: 'How many individual bones make up an adult human skeletal structure?',
      options: ['186', '206', '226', '246'],
      correctIndex: 1
    },
    {
      id: 10,
      category: 'Everyday Facts',
      topic: 'World Heritage',
      question: 'In which South American country is the historic 15th-century Inca citadel of Machu Picchu located?',
      options: ['Peru', 'Chile', 'Ecuador', 'Colombia'],
      correctIndex: 0
    }
  ];

  const QUESTION_DURATION = 30;
  const CIRCLE_CIRCUMFERENCE = 213.6; // 2 * PI * 34 for SVG radius 34

  // Application State
  const state = {
    currentIndex: 0,
    score: 0,
    answers: [], // Array of { questionId, selectedIndex, isCorrect, isUnanswered }
    timeRemaining: QUESTION_DURATION,
    timerInterval: null,
    isAnswerLocked: false,
    isTransitioning: false
  };

  // DOM Elements
  const startScreen = document.getElementById('startScreen');
  const quizScreen = document.getElementById('quizScreen');
  const resultsScreen = document.getElementById('resultsScreen');

  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const nextBtnText = document.getElementById('nextBtnText');
  const restartBtn = document.getElementById('restartBtn');
  const reviewToggleBtn = document.getElementById('reviewToggleBtn');
  const reviewContainer = document.getElementById('reviewContainer');

  const questionTracker = document.getElementById('questionTracker');
  const categoryPill = document.getElementById('categoryPill');
  const scorePill = document.getElementById('scorePill');
  const progressFill = document.getElementById('progressFill');
  const progressBarTrack = document.getElementById('progressBarTrack');
  const topicTag = document.getElementById('topicTag');

  const timerWrapper = document.getElementById('timerWrapper');
  const timerText = document.getElementById('timerText');
  const timerProgressCircle = document.getElementById('timerProgressCircle');

  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const feedbackBanner = document.getElementById('feedbackBanner');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackMessage = document.getElementById('feedbackMessage');
  const footerHint = document.getElementById('footerHint');

  const finalScoreDisplay = document.getElementById('finalScoreDisplay');
  const percentageDisplay = document.getElementById('percentageDisplay');
  const performanceMessage = document.getElementById('performanceMessage');
  const metricCorrect = document.getElementById('metricCorrect');
  const metricIncorrect = document.getElementById('metricIncorrect');
  const metricUnanswered = document.getElementById('metricUnanswered');
  const metricTotal = document.getElementById('metricTotal');
  const trophyBadge = document.getElementById('trophyBadge');

  function initApp() {
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', handleNextNavigation);
    restartBtn.addEventListener('click', resetQuiz);
    reviewToggleBtn.addEventListener('click', toggleReviewSection);
  }

  function startQuiz() {
    resetState();
    startScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    quizScreen.style.display = 'flex';
    renderCurrentQuestion();
  }

  function resetState() {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.timeRemaining = QUESTION_DURATION;
    state.isAnswerLocked = false;
    state.isTransitioning = false;
  }

  function renderCurrentQuestion() {
    state.isAnswerLocked = false;
    state.isTransitioning = false;

    const currentQ = QUIZ_QUESTIONS[state.currentIndex];
    const totalQ = QUIZ_QUESTIONS.length;
    const isLastQuestion = state.currentIndex === totalQ - 1;

    // Header & Trackers
    questionTracker.textContent = `Question ${state.currentIndex + 1} of ${totalQ}`;
    categoryPill.textContent = currentQ.category;
    scorePill.textContent = `Score: ${state.score}`;
    topicTag.textContent = `Topic: ${currentQ.topic}`;

    const progressPercent = Math.round(((state.currentIndex + 1) / totalQ) * 100);
    progressFill.style.width = `${progressPercent}%`;
    progressBarTrack.setAttribute('aria-valuenow', String(progressPercent));

    questionText.textContent = currentQ.question;

    // Hide feedback & reset footer hint
    feedbackBanner.style.display = 'none';
    feedbackBanner.className = 'feedback-banner';
    footerHint.textContent = 'Select an option to lock in your answer';
    footerHint.style.color = '';

    // Next / Finish Button setup
    nextBtn.disabled = true;
    nextBtnText.textContent = isLastQuestion ? 'Finish Quiz' : 'Next Question';

    renderOptions(currentQ);
    startTimer();
  }

  function renderOptions(currentQ) {
    optionsContainer.innerHTML = '';
    const keyLabels = ['A', 'B', 'C', 'D'];

    currentQ.options.forEach((optionText, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-btn';
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', 'false');
      button.setAttribute('data-index', String(index));
      button.id = `option-${state.currentIndex}-${index}`;

      const keySpan = document.createElement('span');
      keySpan.className = 'option-key';
      keySpan.textContent = keyLabels[index];

      const textSpan = document.createElement('span');
      textSpan.className = 'option-text';
      textSpan.textContent = optionText;

      const iconSpan = document.createElement('span');
      iconSpan.className = 'option-icon';
      iconSpan.setAttribute('aria-hidden', 'true');

      button.appendChild(keySpan);
      button.appendChild(textSpan);
      button.appendChild(iconSpan);

      button.addEventListener('click', () => handleOptionSelection(index));
      optionsContainer.appendChild(button);
    });
  }

  function startTimer() {
    clearInterval(state.timerInterval);
    state.timeRemaining = QUESTION_DURATION;
    updateTimerVisuals();

    state.timerInterval = setInterval(() => {
      state.timeRemaining--;

      if (state.timeRemaining <= 0) {
        state.timeRemaining = 0;
        updateTimerVisuals();
        clearInterval(state.timerInterval);
        handleTimerExpiration();
      } else {
        updateTimerVisuals();
      }
    }, 1000);
  }

  function updateTimerVisuals() {
    timerText.textContent = String(state.timeRemaining);
    timerWrapper.setAttribute('aria-label', `Time remaining: ${state.timeRemaining} seconds`);

    // SVG dashoffset calculation
    const offset = CIRCLE_CIRCUMFERENCE - (state.timeRemaining / QUESTION_DURATION) * CIRCLE_CIRCUMFERENCE;
    timerProgressCircle.style.strokeDashoffset = String(offset);

    // Warning alert state for 5 seconds or fewer
    if (state.timeRemaining <= 5 && state.timeRemaining > 0) {
      timerWrapper.classList.add('timer-warning');
    } else {
      timerWrapper.classList.remove('timer-warning');
    }
  }

  function handleOptionSelection(selectedIndex) {
    if (state.isAnswerLocked || state.isTransitioning) return;

    state.isAnswerLocked = true;
    clearInterval(state.timerInterval);

    const currentQ = QUIZ_QUESTIONS[state.currentIndex];
    const isCorrect = selectedIndex === currentQ.correctIndex;

    if (isCorrect) {
      state.score++;
      scorePill.textContent = `Score: ${state.score}`;
    }

    state.answers.push({
      questionId: currentQ.id,
      selectedIndex,
      correctIndex: currentQ.correctIndex,
      isCorrect,
      isUnanswered: false
    });

    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;

      if (idx === selectedIndex) {
        btn.classList.add('selected');
        btn.setAttribute('aria-checked', 'true');
        const icon = btn.querySelector('.option-icon');

        if (isCorrect) {
          btn.classList.add('correct');
          if (icon) icon.textContent = '✓';
        } else {
          btn.classList.add('incorrect');
          if (icon) icon.textContent = '✕';
        }
      }

      // Reveal correct answer if wrong answer was chosen
      if (!isCorrect && idx === currentQ.correctIndex) {
        btn.classList.add('correct');
        const icon = btn.querySelector('.option-icon');
        if (icon) icon.textContent = '✓';
      }
    });

    displayFeedback(isCorrect, false, currentQ.options[currentQ.correctIndex]);
    nextBtn.disabled = false;
    footerHint.textContent = 'Answer locked. Click below to proceed.';
    footerHint.style.color = '#a5b4fc';
    nextBtn.focus();
  }

  function handleTimerExpiration() {
    if (state.isAnswerLocked || state.isTransitioning) return;

    state.isAnswerLocked = true;
    state.isTransitioning = true;

    const currentQ = QUIZ_QUESTIONS[state.currentIndex];

    // Record as unanswered with 0 points
    state.answers.push({
      questionId: currentQ.id,
      selectedIndex: null,
      correctIndex: currentQ.correctIndex,
      isCorrect: false,
      isUnanswered: true
    });

    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === currentQ.correctIndex) {
        btn.classList.add('correct');
        const icon = btn.querySelector('.option-icon');
        if (icon) icon.textContent = '✓';
      }
    });

    displayFeedback(false, true, currentQ.options[currentQ.correctIndex]);
    footerHint.textContent = 'Time expired! Moving to next question...';
    footerHint.style.color = '#f59e0b';

    // Automatic smooth transition after a 2-second timeout review
    setTimeout(() => {
      advanceQuestion();
    }, 2000);
  }

  function displayFeedback(isCorrect, isTimeout, correctAnswerText) {
    feedbackBanner.style.display = 'flex';
    feedbackBanner.className = 'feedback-banner';

    if (isTimeout) {
      feedbackBanner.classList.add('feedback-timeout');
      feedbackIcon.textContent = '⏱';
      feedbackMessage.textContent = `Time's up! Correct answer: ${correctAnswerText}`;
    } else if (isCorrect) {
      feedbackBanner.classList.add('feedback-correct');
      feedbackIcon.textContent = '✓';
      feedbackMessage.textContent = 'Correct! Outstanding work.';
    } else {
      feedbackBanner.classList.add('feedback-incorrect');
      feedbackIcon.textContent = '✕';
      feedbackMessage.textContent = `Incorrect. The correct answer was: ${correctAnswerText}`;
    }
  }

  function handleNextNavigation() {
    if (!state.isAnswerLocked || state.isTransitioning) return;
    advanceQuestion();
  }

  function advanceQuestion() {
    state.isTransitioning = true;
    clearInterval(state.timerInterval);

    if (state.currentIndex + 1 < QUIZ_QUESTIONS.length) {
      state.currentIndex++;
      renderCurrentQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    clearInterval(state.timerInterval);
    quizScreen.style.display = 'none';
    resultsScreen.style.display = 'flex';

    const totalQuestions = QUIZ_QUESTIONS.length;
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    const incorrectCount = state.answers.filter(a => !a.isCorrect && !a.isUnanswered).length;
    const unansweredCount = state.answers.filter(a => a.isUnanswered).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    finalScoreDisplay.textContent = `${correctCount}/${totalQuestions}`;
    percentageDisplay.textContent = `${percentage}%`;
    metricCorrect.textContent = String(correctCount);
    metricIncorrect.textContent = String(incorrectCount);
    metricUnanswered.textContent = String(unansweredCount);
    metricTotal.textContent = String(totalQuestions);

    // Performance tiers and badge icon
    if (percentage === 100) {
      trophyBadge.textContent = '👑';
      performanceMessage.textContent = 'Flawless Masterpiece! You achieved a perfect 100% score!';
    } else if (percentage >= 80) {
      trophyBadge.textContent = '🏆';
      performanceMessage.textContent = 'Outstanding Performance! Excellent mastery of knowledge.';
    } else if (percentage >= 60) {
      trophyBadge.textContent = '🌟';
      performanceMessage.textContent = 'Good Job! Solid effort with a commendable result.';
    } else if (percentage >= 40) {
      trophyBadge.textContent = '📖';
      performanceMessage.textContent = 'Fair Attempt! Review the questions and give it another try.';
    } else {
      trophyBadge.textContent = '💡';
      performanceMessage.textContent = 'Keep Learning! Practice makes perfect — try again!';
    }

    renderReviewSection();
    restartBtn.focus();
  }

  function renderReviewSection() {
    reviewContainer.innerHTML = '';
    reviewContainer.style.display = 'none';
    reviewToggleBtn.setAttribute('aria-expanded', 'false');

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const recorded = state.answers.find(a => a.questionId === q.id);
      const item = document.createElement('div');
      item.className = 'review-item';

      const header = document.createElement('div');
      header.className = 'review-item-header';

      const qNum = document.createElement('span');
      qNum.className = 'review-q-num';
      qNum.textContent = `Question ${idx + 1} • ${q.category}`;

      const badge = document.createElement('span');
      badge.className = 'review-badge';

      if (!recorded || recorded.isUnanswered) {
        badge.classList.add('badge-unanswered');
        badge.textContent = 'Unanswered';
      } else if (recorded.isCorrect) {
        badge.classList.add('badge-correct');
        badge.textContent = 'Correct (+1)';
      } else {
        badge.classList.add('badge-incorrect');
        badge.textContent = 'Incorrect (0)';
      }

      header.appendChild(qNum);
      header.appendChild(badge);

      const qTitle = document.createElement('div');
      qTitle.className = 'review-question';
      qTitle.textContent = q.question;

      const answersDiv = document.createElement('div');
      answersDiv.className = 'review-answers';

      const userAns = document.createElement('div');
      userAns.className = 'review-user-ans';
      if (!recorded || recorded.isUnanswered) {
        userAns.textContent = 'Your Answer: None (Time Expired)';
      } else {
        userAns.textContent = `Your Answer: ${q.options[recorded.selectedIndex]}`;
      }

      const correctAns = document.createElement('div');
      correctAns.className = 'review-correct-ans';
      correctAns.textContent = `Correct Answer: ${q.options[q.correctIndex]}`;

      answersDiv.appendChild(userAns);
      answersDiv.appendChild(correctAns);

      item.appendChild(header);
      item.appendChild(qTitle);
      item.appendChild(answersDiv);

      reviewContainer.appendChild(item);
    });
  }

  function toggleReviewSection() {
    const isExpanded = reviewToggleBtn.getAttribute('aria-expanded') === 'true';
    reviewToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    reviewContainer.style.display = isExpanded ? 'none' : 'flex';
  }

  function resetQuiz() {
    resetState();
    resultsScreen.style.display = 'none';
    quizScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    startBtn.focus();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
