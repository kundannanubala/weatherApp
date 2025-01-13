from fastapi import APIRouter
from services.locationService import LocationService
from typing import Optional

router = APIRouter()

@router.get("/")
async def get_location(city: str, country_code: Optional[str] = None, state_code: Optional[str] = None, limit: int = 1):
    location_service = LocationService()
    return await location_service.get_coordinates(city, state_code, country_code, limit)