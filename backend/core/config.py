from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    weatherAPI: str = os.getenv("weatherAPI")
    MongoDB_URI: str = os.getenv("MongoDB_URI")

    class Config:
        env_file = ".env"

settings = Settings()

