from fastapi import FastAPI
import banco


app = FastAPI()


@app.get("/")
def basic_end_point():
    return {"end point":" #1 "}

@app.on_event("startup")
def startup_event():
    print("Starting up...")

@app.get("/book/{book_id}")
def get_book_page(book_id: int):
    return {"end point":" #3 ", "book_id": book_id}

@app.get("/book/{book_id}/{page}")
def get_book_page(book_id: int, page: int):
    return {"end point":" #4 ", "book_id": book_id, "page": page}