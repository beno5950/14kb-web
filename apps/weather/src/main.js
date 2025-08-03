// Weather App JavaScript Module

class WeatherApp {
  constructor() {
    this.elements = {
      form: document.getElementById('weather-form'),
      zipInput: document.getElementById('zipcode'),
      weatherDisplay: document.getElementById('weather-display'),
      errorDisplay: document.getElementById('error-display'),
      loading: document.getElementById('loading'),
      themeToggle: document.getElementById('theme-toggle'),
      retryButton: document.getElementById('retry-button'),
    };

    this.weatherElements = {
      locationName: document.getElementById('location-name'),
      weatherEmoji: document.getElementById('weather-emoji'),
      tempCurrent: document.getElementById('temp-current'),
      tempHigh: document.getElementById('temp-high'),
      tempLow: document.getElementById('temp-low'),
      description: document.getElementById('weather-description'),
      feelsLike: document.getElementById('feels-like'),
      humidity: document.getElementById('humidity'),
      wind: document.getElementById('wind'),
      pressure: document.getElementById('pressure'),
      visibility: document.getElementById('visibility'),
      sunrise: document.getElementById('sunrise'),
      sunset: document.getElementById('sunset'),
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.initTheme();
    this.loadFromStorage();
  }

  bindEvents() {
    this.elements.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    this.elements.retryButton.addEventListener('click', this.handleRetry.bind(this));

    // Auto-format ZIP code input
    this.elements.zipInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const zipcode = this.elements.zipInput.value.trim();
    
    if (!/^\d{5}$/.test(zipcode)) {
      this.showError('Please enter a valid 5-digit ZIP code');
      return;
    }

    await this.fetchWeather(zipcode);
  }

  async handleRetry() {
    const zipcode = this.elements.zipInput.value.trim();
    if (zipcode) {
      await this.fetchWeather(zipcode);
    }
  }

  async fetchWeather(zipcode) {
    this.showLoading();
    
    try {
      const response = await fetch(`/api/weather?zip=${zipcode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }

      this.displayWeather(data);
      this.saveToStorage(zipcode, data);
    } catch (error) {
      this.showError(error.message);
    }
  }

  displayWeather(data) {
    const {
      name,
      main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
      weather: [{ main, description, icon }],
      wind: { speed, deg = 0 },
      visibility,
      sys: { sunrise, sunset },
    } = data;

    // Update weather elements
    this.weatherElements.locationName.textContent = name;
    this.weatherElements.weatherEmoji.textContent = this.getWeatherEmoji(icon);
    this.weatherElements.tempCurrent.textContent = `${Math.round(temp)}°F`;
    this.weatherElements.tempHigh.textContent = `${Math.round(temp_max)}°F`;
    this.weatherElements.tempLow.textContent = `${Math.round(temp_min)}°F`;
    this.weatherElements.description.textContent = description;
    this.weatherElements.feelsLike.textContent = `${Math.round(feels_like)}°F`;
    this.weatherElements.humidity.textContent = `${humidity}%`;
    this.weatherElements.wind.textContent = `${Math.round(speed)} mph ${this.getWindDirection(deg)}`;
    this.weatherElements.pressure.textContent = `${Math.round(pressure * 0.02953)} inHg`;
    this.weatherElements.visibility.textContent = `${Math.round(visibility * 0.000621371)} mi`;
    this.weatherElements.sunrise.textContent = this.formatTime(sunrise);
    this.weatherElements.sunset.textContent = this.formatTime(sunset);

    this.showWeather();
  }

  getWeatherEmoji(iconCode) {
    const emojiMap = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌤️';
  }

  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  }

  formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  showLoading() {
    this.hideAllSections();
    this.elements.loading.style.display = 'block';
  }

  showWeather() {
    this.hideAllSections();
    this.elements.weatherDisplay.style.display = 'block';
  }

  showError(message) {
    this.hideAllSections();
    document.getElementById('error-message').textContent = message;
    this.elements.errorDisplay.style.display = 'block';
  }

  hideAllSections() {
    this.elements.weatherDisplay.style.display = 'none';
    this.elements.errorDisplay.style.display = 'none';
    this.elements.loading.style.display = 'none';
  }

  // Theme management
  initTheme() {
    const savedTheme = localStorage.getItem('weather-theme');
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
    localStorage.setItem('weather-theme', newTheme);
    this.updateThemeToggle();
  }

  updateThemeToggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.elements.themeToggle.textContent = isDark ? '☀️' : '🌙';
    this.elements.themeToggle.setAttribute('aria-label', 
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  // Local storage for caching
  saveToStorage(zipcode, data) {
    const cacheData = {
      zipcode,
      data,
      timestamp: Date.now()
    };
    localStorage.setItem('weather-cache', JSON.stringify(cacheData));
  }

  loadFromStorage() {
    try {
      const cached = localStorage.getItem('weather-cache');
      if (!cached) return;

      const { zipcode, data, timestamp } = JSON.parse(cached);
      
      // Use cached data if less than 10 minutes old
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        this.elements.zipInput.value = zipcode;
        this.displayWeather(data);
      }
    } catch (error) {
      // Ignore cache errors
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
});