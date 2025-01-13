from typing import Dict, Optional
import httpx
from core.config import Settings
from datetime import datetime, timedelta
import time

settings = Settings()

class WeatherService:
    def __init__(self):
        self.api_key = settings.weatherAPI
        self.base_url = "https://api.openweathermap.org/data/3.0/onecall"
        self.history_url = "https://api.openweathermap.org/data/3.0/onecall/timemachine"

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


    async def get_historical_weather_range(self, lat: float, lon: float, start_date: str, end_date: str) -> Dict:
        """
        Fetch historical weather data for given coordinates and date range
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            start_date (str): Start date in format 'YYYY-MM-DD'
            end_date (str): End date in format 'YYYY-MM-DD'
        
        Returns:
            Dict: Historical weather data for each day in the range
        """
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        result = {}
        if (end - start).days > 5:
            return {"error": "The date range should not be more than 5 days apart."}
        if start > datetime.now():
            return {"error": "The start date should not be a future date."}
        if end > datetime.now():
            return {"error": "The end date should not be a future date."}
        if start > end:
            return {"error": "The start date should not be after the end date."}
        async with httpx.AsyncClient() as client:
            current_date = start
            while current_date <= end:
                timestamp = int(current_date.timestamp())
                params = {
                    "lat": lat,
                    "lon": lon,
                    "dt": timestamp,
                    "appid": self.api_key
                }

                response = await client.get(self.history_url, params=params)
                response.raise_for_status()
                
                date_str = current_date.strftime('%Y-%m-%d')
                result[date_str] = response.json()
                current_date += timedelta(days=1)

        return result


    

