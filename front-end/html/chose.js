document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;
  themeIcon.textContent = body.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  });
});
