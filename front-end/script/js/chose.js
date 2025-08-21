// Configuração da API
const API_BASE_URL = 'http://localhost:3000'; // Altere para a URL da sua API
const BOOKS_ENDPOINT = '/books'; // Altere para o endpoint da sua API

// Elementos da UI
const booksContainer = document.getElementById('books-container');
const loadingElement = document.getElementById('loading');
const emptyStateElement = document.getElementById('empty-state');
const bookCountElement = document.getElementById('book-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const refreshBtn = document.getElementById('refresh-books');
const tryAgainBtn = document.getElementById('try-again');

// Variáveis globais
let books = [];
let filteredBooks = [];
let currentView = 'grid';
let sortAscending = true;
let currentBookId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    setupEventListeners();
    loadBooks();
});

// Configuração do tema
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Configuração dos listeners de eventos
function setupEventListeners() {
    // Controles de visualização
    const viewToggle = document.getElementById('view-toggle');
    viewToggle.addEventListener('click', toggleView);
    
    // Ordenação
    const sortToggle = document.getElementById('sort-toggle');
    sortToggle.addEventListener('click', toggleSort);
    
    // Pesquisa
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBooks();
    });
    
    // Atualizar livros
    refreshBtn.addEventListener('click', loadBooks);
    tryAgainBtn.addEventListener('click', loadBooks);
    
    // Modal de adição/edição
    const addBookBtn = document.getElementById('add-book');
    const bookModal = document.getElementById('book-modal');
    const cancelModalBtn = document.getElementById('cancel-modal');
    const bookForm = document.getElementById('book-form');
    
    addBookBtn.addEventListener('click', () => openBookModal());
    cancelModalBtn.addEventListener('click', () => closeModal('book-modal'));
    bookForm.addEventListener('submit', handleBookSubmit);
    
    // Modal de detalhes
    const detailModal = document.getElementById('detail-modal');
    const closeDetailBtn = document.getElementById('close-detail');
    const editBookBtn = document.getElementById('edit-book');
    const deleteBookBtn = document.getElementById('delete-book');
    
    closeDetailBtn.addEventListener('click', () => closeModal('detail-modal'));
    editBookBtn.addEventListener('click', editBook);
    deleteBookBtn.addEventListener('click', deleteBook);
    
    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Funções para manipulação da API
async function fetchBooks() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}${BOOKS_ENDPOINT}`);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        showError('Falha ao carregar os livros. Verifique sua conexão e tente novamente.');
        return [];
    }
}

async function addBook(bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}${BOOKS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao adicionar livro: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        alert('Falha ao adicionar o livro. Tente novamente.');
        throw error;
    }
}

async function updateBook(bookId, bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}${BOOKS_ENDPOINT}/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao atualizar livro: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        alert('Falha ao atualizar o livro. Tente novamente.');
        throw error;
    }
}

async function deleteBookFromServer(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}${BOOKS_ENDPOINT}/${bookId}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao excluir livro: ${response.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        alert('Falha ao excluir o livro. Tente novamente.');
        throw error;
    }
}

// Funções para manipulação da UI
async function loadBooks() {
    books = await fetchBooks();
    
    if (books.length > 0) {
        filteredBooks = [...books];
        hideEmptyState();
        renderBooks();
        updateBookCount();
    } else {
        showEmptyState();
    }
    
    hideLoading();
}

function renderBooks() {
    booksContainer.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        booksContainer.appendChild(bookElement);
    });
}

function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.className = 'book';
    bookElement.dataset.id = book.id;
    
    const coverContent = book.coverUrl 
        ? `<img src="${book.coverUrl}" alt="${book.title}">`
        : `<div class="book-cover-content" style="background-color: ${book.color || '#4a6fa5'};">${getInitials(book.title)}</div>`;
    
    bookElement.innerHTML = `
        <div class="book-cover">
            ${coverContent}
        </div>
        <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        </div>
    `;
    
    bookElement.addEventListener('click', () => showBookDetails(book));
    
    return bookElement;
}

function getInitials(title) {
    return title.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 3);
}

function showBookDetails(book) {
    const detailModal = document.getElementById('detail-modal');
    const bookDetails = document.getElementById('book-details');
    
    bookDetails.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Título:</span>
            <span class="detail-value">${book.title}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Autor:</span>
            <span class="detail-value">${book.author}</span>
        </div>
        ${book.year ? `
        <div class="detail-row">
            <span class="detail-label">Ano:</span>
            <span class="detail-value">${book.year}</span>
        </div>` : ''}
        ${book.pages ? `
        <div class="detail-row">
            <span class="detail-label">Páginas:</span>
            <span class="detail-value">${book.pages}</span>
        </div>` : ''}
        ${book.description ? `
        <div class="detail-row">
            <span class="detail-label">Descrição:</span>
            <span class="detail-value">${book.description}</span>
        </div>` : ''}
    `;
    
    currentBookId = book.id;
    detailModal.style.display = 'flex';
}

function editBook() {
    closeModal('detail-modal');
    
    const book = books.find(b => b.id === currentBookId);
    if (book) {
        openBookModal(book);
    }
}

async function deleteBook() {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        try {
            await deleteBookFromServer(currentBookId);
            closeModal('detail-modal');
            loadBooks(); // Recarregar a lista de livros
        } catch (error) {
            console.error('Erro ao excluir livro:', error);
        }
    }
}

function openBookModal(book = null) {
    const modal = document.getElementById('book-modal');
    const modalTitle = document.getElementById('modal-title');
    const bookForm = document.getElementById('book-form');
    const bookId = document.getElementById('book-id');
    const bookTitle = document.getElementById('book-title');
    const bookAuthor = document.getElementById('book-author');
    const bookYear = document.getElementById('book-year');
    const bookPages = document.getElementById('book-pages');
    const bookDescription = document.getElementById('book-description');
    const bookCover = document.getElementById('book-cover');
    const bookColor = document.getElementById('book-color');
    
    if (book) {
        // Modo edição
        modalTitle.textContent = 'Editar Livro';
        bookId.value = book.id;
        bookTitle.value = book.title;
        bookAuthor.value = book.author;
        bookYear.value = book.year || '';
        bookPages.value = book.pages || '';
        bookDescription.value = book.description || '';
        bookCover.value = book.coverUrl || '';
        bookColor.value = book.color || '#4a6fa5';
    } else {
        // Modo adição
        modalTitle.textContent = 'Adicionar Novo Livro';
        bookForm.reset();
        bookId.value = '';
        bookColor.value = '#4a6fa5';
    }
    
    modal.style.display = 'flex';
}

async function handleBookSubmit(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('book-id').value;
    const bookData = {
        title: document.getElementById('book-title').value,
        author: document.getElementById('book-author').value,
        year: document.getElementById('book-year').value || undefined,
        pages: document.getElementById('book-pages').value || undefined,
        description: document.getElementById('book-description').value || undefined,
        coverUrl: document.getElementById('book-cover').value || undefined,
        color: document.getElementById('book-color').value,
    };
    
    try {
        if (bookId) {
            // Editar livro existente
            await updateBook(bookId, bookData);
        } else {
            // Adicionar novo livro
            await addBook(bookData);
        }
        
        closeModal('book-modal');
        loadBooks(); // Recarregar a lista de livros
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleView() {
    const viewToggle = document.getElementById('view-toggle');
    
    if (booksContainer.classList.contains('books-grid')) {
        booksContainer.classList.remove('books-grid');
        booksContainer.classList.add('books-list');
        viewToggle.textContent = '⧅';
        currentView = 'list';
    } else {
        booksContainer.classList.remove('books-list');
        booksContainer.classList.add('books-grid');
        viewToggle.textContent = '⧄';
        currentView = 'grid';
    }
    
    localStorage.setItem('view', currentView);
}

function toggleSort() {
    sortAscending = !sortAscending;
    
    filteredBooks.sort((a, b) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        
        if (sortAscending) {
            return titleA.localeCompare(titleB);
        } else {
            return titleB.localeCompare(titleA);
        }
    });
    
    renderBooks();
}

function searchBooks() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredBooks = [...books];
    } else {
        filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            (book.description && book.description.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filteredBooks.length === 0) {
        showEmptyState();
    } else {
        hideEmptyState();
        renderBooks();
    }
    
    updateBookCount();
}

function updateBookCount() {
    bookCountElement.textContent = filteredBooks.length;
}

function showLoading() {
    loadingElement.style.display = 'flex';
    booksContainer.style.display = 'none';
    emptyStateElement.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
    booksContainer.style.display = currentView === 'grid' ? 'grid' : 'flex';
}

function showEmptyState() {
    emptyStateElement.style.display = 'flex';
    booksContainer.style.display = 'none';
    loadingElement.style.display = 'none';
}

function hideEmptyState() {
    emptyStateElement.style.display = 'none';
    booksContainer.style.display = currentView === 'grid' ? 'grid' : 'flex';
}

function showError(message) {
    // Implementar exibição de erro para o usuário
    console.error(message);
}