from typing import Dict, Optional
import httpx
from core.config import Settings

settings = Settings()

class WeatherService:
    def __init__(self):
        self.api_key = settings.weatherAPI
        self.base_url = "https://api.openweathermap.org/data/3.0/onecall"

    async def get_weather_data(self, lat: float, lon: float, exclude: Optional[str] = None) -> Dict:
        """
        Fetch weather data for given coordinates
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            exclude (str, optional): Comma-separated parts to exclude from response
        
        Returns:
            Dict: Weather data response
        """
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key
        }
        
        if exclude:
            params["exclude"] = exclude

        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            response.raise_for_status()
            return response.json()
