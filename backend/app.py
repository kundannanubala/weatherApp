from fastapi import FastAPI
import uvicorn
from api import location, icon, weather, crud, user
from fastapi.middleware.cors import CORSMiddleware

    
app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(weather.router, prefix="/weather", tags=["weather"])
app.include_router(location.router, prefix="/location", tags=["location"])
app.include_router(icon.router, prefix="/icon", tags=["icon"])
app.include_router(crud.router, prefix="/crud", tags=["crud"])
app.include_router(user.router, prefix="/user", tags=["user"])

def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)
