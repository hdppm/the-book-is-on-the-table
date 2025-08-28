import aiosqlite, os
from fastapi import Depends, HTTPException

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'db.db')

async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        try:
            yield db
        finally:
            await db.close()

async def get_books(db: aiosqlite.Connection = Depends(get_db)):
    try:
        async with db.execute("SELECT * FROM books") as cursor:
            books = await cursor.fetchall()
            return [dict(book) for book in books]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
async def get_book(book_id: int, db: aiosqlite.Connection = Depends(get_db)):
    try:
        async with db.execute("SELECT * FROM books WHERE id = ?", (book_id,)) as cursor:
            book = await cursor.fetchone()
            if book is None:
                raise HTTPException(status_code=404, detail="Book not found")
            return dict(book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
async def add_book(
    book_name: str,
    book_pages: int,
    book_author: str,
    book_description: str,
    year_of_release: int,
    release_date: str,
    book_image: str,  # Changed from vars to str, assuming it's a file path or URL
    #age_range: str,
):
    async with aiosqlite.connect(DB_PATH) as db:
        try:
        # SQL query to insert a new book
            query = """
            INSERT INTO books 
            (book_name, book_pages, book_author, book_description, year_of_release, release_date, book_image )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """
        #age_range
        # Execute the query with parameters
            await db.execute(query, (
                book_name,
                book_pages,
                book_author,
                book_description,
                year_of_release,
                release_date,
                book_image,
                #age_range
            ))
        
        # Commit the transaction
            await db.commit()
        
            return {"message": "Book added successfully"}
        
        except Exception as e:
            # Rollback in case of error
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error adding book: {str(e)}")
