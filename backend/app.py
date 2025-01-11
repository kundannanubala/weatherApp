from fastapi import FastAPI
import uvicorn
from api import basic, location, icon
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(basic.router, prefix="/api")
app.include_router(location.router, prefix="/api")
app.include_router(icon.router, prefix="/api")

def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)
