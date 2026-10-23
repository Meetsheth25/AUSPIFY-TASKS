/**
 * To-Do List Application
 * Academic Assignment - Task 2
 * Built with pure Vanilla JavaScript and Browser Local Storage
 */

// Storage key used to persist tasks in the browser's localStorage
const STORAGE_KEY = 'todoTasks';

// In-memory array storing all task objects
let tasks = [];

// Cache DOM element references
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasksCount = document.getElementById('totalTasksCount');
const completedTasksCount = document.getElementById('completedTasksCount');
const remainingTasksCount = document.getElementById('remainingTasksCount');

/**
 * Generates a unique identifier for each task.
 * Uses crypto.randomUUID() when available, falling back to timestamp + random string.
 * @returns {string} Unique identifier
 */
function generateUniqueId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Loads tasks from the browser's Local Storage.
 * Safely parses JSON and falls back to an empty array if data is missing or corrupted.
 */
function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that the parsed data is an array
      if (Array.isArray(parsed)) {
        tasks = parsed;
      } else {
        tasks = [];
      }
    } else {
      tasks = [];
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    tasks = [];
  }
}

/**
 * Saves the current tasks array to the browser's Local Storage.
 * Handles storage quota or security errors gracefully.
 */
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

/**
 * Updates the summary statistics:
 * - Total tasks
 * - Completed tasks
 * - Remaining (pending) tasks
 */
function updateTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = total - completed;

  if (totalTasksCount) totalTasksCount.textContent = total;
  if (completedTasksCount) completedTasksCount.textContent = completed;
  if (remainingTasksCount) remainingTasksCount.textContent = remaining;
}

/**
 * Creates and renders all task items into the DOM.
 * Also toggles the empty state message when no tasks exist.
 */
function renderTasks() {
  // Clear the existing list before re-rendering
  if (!taskList) return;
  taskList.innerHTML = '';

  // Show empty state if there are no tasks; hide it when tasks exist
  if (emptyState) {
    if (tasks.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }

  // Build each task element dynamically using safe DOM methods
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);

    // 1. Completion Checkbox
    const label = document.createElement('label');
    label.className = 'task-checkbox-label';
    label.setAttribute('aria-label', `Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute('aria-label', `Status for task: ${task.text}`);

    label.appendChild(checkbox);

    // 2. Task Description Text (safe textContent to prevent XSS)
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    // 3. Delete Button with Accessible SVG Icon
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.innerHTML = `
      <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;

    // Assemble the list item
    li.appendChild(label);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Append to list container
    taskList.appendChild(li);
  });

  // Keep summary counters updated
  updateTaskStats();
}

/**
 * Validates the user input and adds a new task to the array.
 */
function addTask() {
  if (!taskInput) return;

  const rawText = taskInput.value;
  const trimmedText = rawText.trim();

  // Reject empty or whitespace-only tasks
  if (trimmedText === '') {
    taskInput.focus();
    return;
  }

  // Create new task object
  const newTask = {
    id: generateUniqueId(),
    text: trimmedText,
    completed: false,
    createdAt: Date.now()
  };

  // Add task to array
  tasks.push(newTask);

  // Save changes to Local Storage
  saveTasks();

  // Re-render task list and update counters
  renderTasks();

  // Clear input field and restore focus
  taskInput.value = '';
  taskInput.focus();
}

/**
 * Toggles a task's completion status.
 * @param {string} id - The unique ID of the task to toggle
 */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  // Toggle boolean status
  task.completed = !task.completed;

  // Persist updated state
  saveTasks();

  // Re-render display and update statistics
  renderTasks();
}

/**
 * Removes a task from the list by its unique ID.
 * @param {string} id - The unique ID of the task to delete
 */
function deleteTask(id) {
  // Filter out the selected task
  tasks = tasks.filter((t) => t.id !== id);

  // Persist updated list
  saveTasks();

  // Re-render display and update statistics
  renderTasks();
}

/**
 * Sets up all application event listeners.
 */
function setupEventListeners() {
  // Add task when submitting the form (handles both Add button click & Enter key)
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addTask();
    });
  }

  // Event delegation on the task list for checkbox toggle and delete actions
  if (taskList) {
    taskList.addEventListener('click', (e) => {
      // Find parent li element with the data-id
      const item = e.target.closest('.task-item');
      if (!item) return;

      const taskId = item.getAttribute('data-id');
      if (!taskId) return;

      // Handle delete button click
      const deleteButton = e.target.closest('.delete-btn');
      if (deleteButton) {
        deleteTask(taskId);
        return;
      }
    });

    // Handle checkbox change (toggle completion)
    taskList.addEventListener('change', (e) => {
      if (e.target.classList.contains('task-checkbox')) {
        const item = e.target.closest('.task-item');
        if (!item) return;

        const taskId = item.getAttribute('data-id');
        if (taskId) {
          toggleTask(taskId);
        }
      }
    });
  }
}

/**
 * Application initialization:
 * 1. Load saved tasks from Local Storage
 * 2. Attach DOM event listeners
 * 3. Render tasks and update stats
 */
function initApp() {
  loadTasks();
  setupEventListeners();
  renderTasks();
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
