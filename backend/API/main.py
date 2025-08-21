from fastapi import FastApi

app = FastApi()

@app.get("/")
def basic_end_point():
    return {"end point":" #1 "}