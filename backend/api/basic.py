from fastapi import APIRouter
from services.basicService import WeatherService

router = APIRouter()

@router.get("/weather")
async def get_weather(lat: float, lon: float):
    weather_service = WeatherService()
    weather_data = await weather_service.get_weather_data(lat, lon) 
    return weather_data
