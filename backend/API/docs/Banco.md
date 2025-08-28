# Banco API Documentation

This module provides asynchronous database operations for managing books using FastAPI and aiosqlite.

## Database Path

- **DB_PATH**: Path to the SQLite database file (`db.db`).

---

## Functions

### `get_db()`
**Description:**  
Dependency function for FastAPI routes. Yields an aiosqlite database connection.

**Usage:**  
Used with `Depends(get_db)` in route handlers.

---

### `get_books(db)`
**Description:**  
Fetches all books from the database.

**Parameters:**  
- `db`: aiosqlite connection (injected by FastAPI dependency).

**Returns:**  
- List of dictionaries, each representing a book.

**Errors:**  
- Returns HTTP 500 if a database error occurs.

---

### `get_book(book_id, db)`
**Description:**  
Fetches a single book by its ID.

**Parameters:**  
- `book_id`: Integer, the book's ID.
- `db`: aiosqlite connection (injected by FastAPI dependency).

**Returns:**  
- Dictionary representing the book.

**Errors:**  
- Returns HTTP 404 if the book is not found.
- Returns HTTP 500 if a database error occurs.

---

### `add_book(book_name, book_pages, book_author, book_description, year_of_release, release_date, book_image)`
**Description:**  
Adds a new book to the database.

**Parameters:**  
- `book_name`: String, name of the book.
- `book_pages`: Integer, number of pages.
- `book_author`: String, author name.
- `book_description`: String, description of the book.
- `year_of_release`: Integer, year the book was released.
- `release_date`: String, release date.
- `book_image`: String, image path or URL.

**Returns:**  
- Dictionary with a success message.

**Errors:**  
- Returns HTTP 500 if an error occurs during insertion.

---

## Notes

- All functions are asynchronous.
- Error handling uses FastAPI's `HTTPException`.
- The `age_range` field is currently