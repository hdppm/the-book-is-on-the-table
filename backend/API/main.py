from fastapi import FastAPI, Depends
from banco import *
from pydantic import BaseModel

app = FastAPI()

@app.get("/books")
async def books_endpoint(books: list = Depends(get_books)):
    return books

@app.get("/books/{book_id}")
async def book_endpoint(books: list = Depends(get_books), book_id: int = None):
    for book in books:
        if book['id'] == book_id:
            return book
    return {"error": "Book not found"}

class BookCreate(BaseModel):
    book_name: str
    book_pages: int
    book_author: str
    book_description: str
    year_of_release: int
    release_date: str
    book_image: str
    #age_range: str

@app.post("/books")
async def add_book_endpoint(book: BookCreate):
    return await add_book(
        book_name=book.book_name,
        book_pages=book.book_pages,
        book_author=book.book_author,
        book_description=book.book_description,
        year_of_release=book.year_of_release,
        release_date=book.release_date,
        book_image=book.book_image,
        #age_range=book.age_range
    )
