from typing import Dict, List, Optional
import httpx
from core.config import Settings

settings = Settings()

class LocationService:
    def __init__(self):
        self.api_key = settings.weatherAPI
        self.direct_url = "http://api.openweathermap.org/geo/1.0/direct"
        self.reverse_url = "http://api.openweathermap.org/geo/1.0/reverse"

    async def get_coordinates(
        self, 
        city: str, 
        state_code: Optional[str] = None, 
        country_code: Optional[str] = None, 
        limit: int = 1
    ) -> List[Dict]:
        """
        Get coordinates for a location using city name
        """
        location = city
        if state_code:
            location += f",{state_code}"
        if country_code:
            location += f",{country_code}"

        params = {
            "q": location,
            "limit": limit,
            "appid": self.api_key
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(self.direct_url, params=params)
            response.raise_for_status()
            return response.json()

    async def get_location_by_coordinates(
        self,
        lat: float,
        lon: float,
        limit: int = 1
    ) -> List[Dict]:
        """
        Get location details using coordinates (reverse geocoding)
        """
        params = {
            "lat": lat,
            "lon": lon,
            "limit": limit,
            "appid": self.api_key
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(self.reverse_url, params=params)
            response.raise_for_status()
            return response.json()
