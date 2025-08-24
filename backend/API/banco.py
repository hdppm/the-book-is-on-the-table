import sqlite3

def connect_db():
    conn = sqlite3.connect('banco.db')
    return conn

conn = connect_db()
cursor = conn.cursor()

conn.execute("""
             CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER NOT NULL,
                page_number INTEGER NOT NULL,
                text TEXT NOT NULL,
                FOREIGN KEY(book_id) REFERENCES books(id)
)
""")

cursor.execute("CREATE INDEX IF NOT EXISTS idx_pages_book_number ON pages (book_id, page_number)")

conn.commit()

# ------ AUX FUNCS ------ #

def add_book(title, num_pages=0,author=None, description=None, year=None, release_date=None):
    cursor.execute(
        "INSERT INTO books (book_title, book_pages, book_author, book_description, year_of_release, release_date) VALUES (?, ?, ?, ?, ?, ?)",
        (title, num_pages, author, description, year, release_date))
    conn.commit()
    return cursor.lastrowid

def add_page(book_id, page_number, text):
    cursor.execute(
        "INSERT INTO pages (book_id, page_number, text) VALUES (?, ?, ?)",
        (book_id, page_number, text))
    conn.commit()
    
def search_page(book_id, page_number):
    cursor.execute(
        "SELECT text FROM pages WHERE book_id = ? AND page_number = ?",
        (book_id, page_number)
    )
    result = cursor.fetchone()
    if(result):
        return result[0]
    else:
        return None

def list_pages(book_id):
    cursor.execute(
        "SELECT page_number, text FROM pages WHERE book_id = ? ORDER BY page_number",
        (book_id,)
    )
    return cursor.fetchall()

def save_book_image(book_id, image):
    with open(image, 'rb') as file:
        img_bytes = file.read()
        
    cursor.execute(
        "INSERT INTO book_images (book_id, image_data) VALUES (?, ?)",
        (book_id, img_bytes)
    )
    conn.commit()
    return cursor.lastrowid