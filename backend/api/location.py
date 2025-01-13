from fastapi import APIRouter
from services.locationService import LocationService
from typing import Optional

router = APIRouter()

@router.get("/")
async def get_location(
    city: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    country_code: Optional[str] = None,
    state_code: Optional[str] = None,
    limit: int = 1
):
    location_service = LocationService()
    if city:
        return await location_service.get_coordinates(city, state_code, country_code, limit)
    elif lat is not None and lon is not None:
        return await location_service.get_location_by_coordinates(lat, lon, limit)
    else:
        return {"error": "Either city or coordinates (lat, lon) must be provided"}