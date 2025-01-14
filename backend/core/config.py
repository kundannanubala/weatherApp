from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    weatherAPI: str = os.getenv("weatherAPI")
    MongoDB_URI: str = os.getenv("MongoDB_URI")
    groqAPI: str = os.getenv("groqAPI")

    class Config:
        env_file = ".env"
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        os.environ["GROQ_API_KEY"] = self.groqAPI

settings = Settings()

