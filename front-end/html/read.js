document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const fontDecrease = document.getElementById('font-decrease');
  const fontReset = document.getElementById('font-reset');
  const fontIncrease = document.getElementById('font-increase');
  const progressBar = document.getElementById('progress');
  const bookContent = document.getElementById('book-content');
  const bookTitle = document.getElementById('book-title');

  const livros = {
    1: {
      title: "Livro Um",
      content: [
        "Era uma vez, em um reino distante, uma pequena vila...",
        "No centro da vila, havia uma grande praça...",
        "Entre os moradores, vivia um jovem chamado Lucas..."
      ]
    },
    2: {
      title: "Livro Dois",
      content: [
        "Em um mundo repleto de aventuras, um herói se levantou...",
        "Ele enfrentou desafios que mudariam sua vida para sempre...",
        "E descobriu que a verdadeira coragem vem do coração."
      ]
    },
    3: {
      title: "Livro Três",
      content: [
        "A história começa em uma floresta encantada e etc...",
        "Criaturas mágicas habitavam o lugar, misteriosas e belasdadsada...",
        "Um segredo antigo estava prestes a ser revelado blalalalla.."
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('book') || 1;
  const livro = livros[bookId];

  bookTitle.textContent = livro.title;
  bookContent.innerHTML = livro.content.map(p => `<p>${p}</p>`).join('');


  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') || 'light';
    body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  });

  const baseFontSize = 16;
  let currentFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  fontDecrease.addEventListener('click', () => {
    currentFontSize = Math.max(baseFontSize * 0.8, currentFontSize - 2);
    document.documentElement.style.fontSize = `${currentFontSize}px`;
  });
  fontReset.addEventListener('click', () => {
    currentFontSize = baseFontSize;
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  });
  fontIncrease.addEventListener('click', () => {
    currentFontSize = Math.min(baseFontSize * 1.5, currentFontSize + 2);
    document.documentElement.style.fontSize = `${currentFontSize}px`;
  });

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });
});
