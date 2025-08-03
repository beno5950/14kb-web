// Simple analytics and performance monitoring
// Track page load performance
document.addEventListener('DOMContentLoaded', () => {
  // Measure and log performance metrics
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      // Only log in development
      if (location.hostname === 'localhost') {
        console.log(`Page loaded in ${loadTime}ms`);
      }
    });
  }

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Progressive enhancement: add reading time estimates
  document.querySelectorAll('.post-preview p').forEach(description => {
    const wordCount = description.textContent.split(' ').length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
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