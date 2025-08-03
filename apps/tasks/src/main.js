// Tasks App JavaScript Module

class TasksApp {
  constructor() {
    this.elements = {
      form: document.getElementById('task-form'),
      titleInput: document.getElementById('task-title'),
      notesInput: document.getElementById('task-notes'),
      prioritySelect: document.getElementById('task-priority'),
      dueInput: document.getElementById('task-due'),
      addBtn: document.getElementById('add-task-btn'),
      cancelBtn: document.getElementById('cancel-edit-btn'),
      tasksList: document.getElementById('tasks-list'),
      emptyState: document.getElementById('empty-state'),
      loading: document.getElementById('loading'),
      errorDisplay: document.getElementById('error-display'),
      errorMessage: document.getElementById('error-message'),
      retryButton: document.getElementById('retry-button'),
      themeToggle: document.getElementById('theme-toggle'),
      sortSelect: document.getElementById('sort-select'),
      filterButtons: document.querySelectorAll('.filter-btn'),
    };

    this.currentFilter = 'all';
    this.currentSort = 'created';
    this.editingTaskId = null;
    this.tasks = [];

    this.init();
  }

  init() {
    this.bindEvents();
    this.initTheme();
    this.loadTasks();
  }

  bindEvents() {
    // Form submission
    this.elements.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.elements.cancelBtn.addEventListener('click', this.cancelEdit.bind(this));
    
    // Theme toggle
    this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    
    // Filter and sort
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', this.handleFilter.bind(this));
    });
    this.elements.sortSelect.addEventListener('change', this.handleSort.bind(this));
    
    // Error retry
    this.elements.retryButton.addEventListener('click', this.loadTasks.bind(this));
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const title = this.elements.titleInput.value.trim();
    const notes = this.elements.notesInput.value.trim();
    const priority = this.elements.prioritySelect.value;
    const dueDate = this.elements.dueInput.value;

    if (!title) {
      this.showError('Task title is required');
      return;
    }

    const taskData = {
      title,
      notes,
      priority,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    try {
      if (this.editingTaskId) {
        await this.updateTask(this.editingTaskId, taskData);
      } else {
        await this.createTask(taskData);
      }
      
      this.clearForm();
      this.loadTasks();
    } catch (error) {
      this.showError(error.message);
    }
  }

  async createTask(taskData) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }

    return response.json();
  }

  async updateTask(id, taskData) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }

    return response.json();
  }

  async deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete task');
    }
  }

  async toggleTaskComplete(id, completed) {
    const response = await fetch(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }

    return response.json();
  }

  async loadTasks() {
    this.showLoading();

    try {
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error('Failed to load tasks');
      }

      this.tasks = await response.json();
      this.renderTasks();
    } catch (error) {
      this.showError(error.message);
    }
  }

  renderTasks() {
    this.hideAllSections();
    
    const filteredTasks = this.filterTasks(this.tasks);
    const sortedTasks = this.sortTasks(filteredTasks);

    if (sortedTasks.length === 0) {
      this.elements.emptyState.style.display = 'block';
      return;
    }

    this.elements.tasksList.innerHTML = '';
    
    sortedTasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.elements.tasksList.appendChild(taskElement);
    });

    document.getElementById('tasks-display').style.display = 'block';
  }

  createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    if (isOverdue) {
      div.classList.add('overdue');
    }

    const dueText = task.dueDate 
      ? this.formatDueDate(task.dueDate, isOverdue)
      : '';

    div.innerHTML = `
      <div class="task-header">
        <div>
          <div class="task-title ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.title)}</div>
          <span class="task-priority ${task.priority}">${task.priority}</span>
        </div>
      </div>
      ${task.notes ? `<div class="task-notes">${this.escapeHtml(task.notes)}</div>` : ''}
      <div class="task-meta">
        <div class="task-created">Created: ${this.formatDate(task.createdAt)}</div>
        ${dueText ? `<div class="task-due ${isOverdue ? 'overdue' : ''}">Due: ${dueText}</div>` : ''}
        <div class="task-actions">
          <button class="btn-complete" onclick="tasksApp.handleToggleComplete(${task.id}, ${!task.completed})">
            ${task.completed ? 'Undo' : 'Complete'}
          </button>
          <button class="btn-edit" onclick="tasksApp.handleEdit(${task.id})">Edit</button>
          <button class="btn-delete" onclick="tasksApp.handleDelete(${task.id})">Delete</button>
        </div>
      </div>
    `;

    return div;
  }

  async handleToggleComplete(id, completed) {
    try {
      await this.toggleTaskComplete(id, completed);
      this.loadTasks();
    } catch (error) {
      this.showError(error.message);
    }
  }

  handleEdit(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.elements.titleInput.value = task.title;
    this.elements.notesInput.value = task.notes || '';
    this.elements.prioritySelect.value = task.priority;
    this.elements.dueInput.value = task.dueDate ? task.dueDate.slice(0, 16) : '';

    this.editingTaskId = id;
    this.elements.addBtn.textContent = 'Update Task';
    this.elements.cancelBtn.style.display = 'inline-block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async handleDelete(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await this.deleteTask(id);
      this.loadTasks();
    } catch (error) {
      this.showError(error.message);
    }
  }

  cancelEdit() {
    this.clearForm();
  }

  clearForm() {
    this.elements.form.reset();
    this.editingTaskId = null;
    this.elements.addBtn.textContent = 'Add Task';
    this.elements.cancelBtn.style.display = 'none';
  }

  handleFilter(e) {
    // Remove active class from all buttons
    this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    this.currentFilter = e.target.dataset.filter;
    this.renderTasks();
  }

  handleSort(e) {
    this.currentSort = e.target.value;
    this.renderTasks();
  }

  filterTasks(tasks) {
    switch (this.currentFilter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'overdue':
        return tasks.filter(task => 
          task.dueDate && 
          new Date(task.dueDate) < new Date() && 
          !task.completed
        );
      default:
        return tasks;
    }
  }

  sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
      switch (this.currentSort) {
        case 'due':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default: // created
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatDueDate(dateString, isOverdue) {
    const date = new Date(dateString);
    const now = new Date();
    const timeDiff = date - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (date.getHours() !== 0 || date.getMinutes() !== 0) {
      formatted += ' ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    if (isOverdue) {
      const overdueDays = Math.abs(daysDiff);
      formatted += ` (${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue)`;
    } else if (daysDiff === 0) {
      formatted += ' (Today)';
    } else if (daysDiff === 1) {
      formatted += ' (Tomorrow)';
    } else if (daysDiff > 0 && daysDiff <= 7) {
      formatted += ` (${daysDiff} day${daysDiff !== 1 ? 's' : ''})`;
    }

    return formatted;
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Theme management
  initTheme() {
    const savedTheme = localStorage.getItem('tasks-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    this.updateThemeToggle();
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('tasks-theme', newTheme);
    this.updateThemeToggle();
  }

  updateThemeToggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.elements.themeToggle.textContent = isDark ? 'Light' : 'Dark';
    this.elements.themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  // UI State Management
  showLoading() {
    this.hideAllSections();
    this.elements.loading.style.display = 'block';
  }

  showError(message) {
    this.hideAllSections();
    this.elements.errorMessage.textContent = message;
    this.elements.errorDisplay.style.display = 'block';
  }

  hideAllSections() {
    this.elements.emptyState.style.display = 'none';
    this.elements.loading.style.display = 'none';
    this.elements.errorDisplay.style.display = 'none';
    document.getElementById('tasks-display').style.display = 'none';
  }
}

// Global instance for event handlers
let tasksApp;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  tasksApp = new TasksApp();
});