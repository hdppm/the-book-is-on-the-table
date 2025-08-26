from fastapi import FastAPI, Depends
from banco import add_book, get_books
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
    name: str
    pages: int
    author: str
    description: str
    year_of_release: int
    release_date: str
    image: str
    age_range: str

@app.post("/books")
async def add_book_endpoint(book: BookCreate):
    return await add_book(
        book_name=book.name,
        book_pages=book.pages,
        book_author=book.author,
        book_description=book.description,
        year_of_release=book.year_of_release,
        release_date=book.release_date,
        book_image=book.image,
        age_range=book.age_range
    )