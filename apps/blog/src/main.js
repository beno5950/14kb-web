/* global performance, location */
// Simple analytics and performance monitoring
// Track page load performance
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('blog-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const updateToggle = () => {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  };

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('blog-theme', next);
    updateToggle();
  });
  updateToggle();

  // Measure and log performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      if (location.hostname === 'localhost') {
        console.log(`Page loaded in ${loadTime}ms`);
      }
    });
  }

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Progressive enhancement: add reading time estimates
  document.querySelectorAll('.post-preview p').forEach((description) => {
    const wordCount = description.textContent.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200);
    if (readingTime > 1) {
      const timeSpan = document.createElement('span');
      timeSpan.textContent = ` • ${readingTime} min read`;
      timeSpan.className = 'reading-time';
      timeSpan.style.color = 'var(--color-text-muted)';
      timeSpan.style.fontSize = '0.875rem';
      description.appendChild(timeSpan);
    }
  });
});
