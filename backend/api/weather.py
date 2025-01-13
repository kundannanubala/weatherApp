from fastapi import APIRouter
from services.getWeatherService import *

router = APIRouter()

@router.get("/current")
async def get_weather(lat: float, lon: float):
    weather_service = WeatherService()
    weather_data = await weather_service.get_weather_data(lat, lon) 
    return weather_data

@router.get("/range")
async def get_historical_weather_range(lat: float, lon: float, start_date: str, end_date: str):
    weather_service = WeatherService()
    weather_data = await weather_service.get_historical_weather_range(lat, lon, start_date, end_date)
    return weather_data


