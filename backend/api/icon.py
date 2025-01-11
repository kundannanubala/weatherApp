from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from services.iconService import IconService
import os

router = APIRouter()

@router.get("/icon")
async def get_icon(icon_code: str, size: str = "2x"):
    icon_service = IconService()
    icon_path = icon_service.download_weather_icon(icon_code, size)
    
    if not os.path.exists(icon_path):
        raise HTTPException(status_code=404, detail="Icon not found")
    
    return FileResponse(icon_path, media_type="image/png")
