from typing import Dict, List, Optional
import httpx
from core.config import Settings

settings = Settings()

class LocationService:
    def __init__(self):
        self.api_key = settings.weatherAPI
        self.base_url = "http://api.openweathermap.org/geo/1.0/direct"

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
            response = await client.get(self.base_url, params=params)
            response.raise_for_status()
            return response.json()
