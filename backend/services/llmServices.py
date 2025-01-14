from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage
import json
from core.config import settings

class WeatherReportService:
    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=5999
        )
        
        self.weather_prompt = """You are a weather analysis expert. Analyze the provided weather data JSON and create a clear, 
        concise weather report. Focus on:
        - Current conditions (temperature in Celsius, weather, wind)
        - Notable weather patterns in the next 24 hours
        - Any weather warnings or significant changes
        - Daily forecast summary
        
        Convert temperatures from Kelvin to Celsius (K - 273.15).
        Keep the report brief but informative, using natural language."""

        self.suggestion_prompt = """You are a friendly weather lifestyle advisor. Based on the weather report, 
        create engaging and helpful suggestions. Your suggestions should:
        - Be positive and actionable
        - Include specific time-based recommendations (e.g., "Perfect morning for a jog!")
        - Suggest indoor alternatives during bad weather
        - Include practical tips (e.g., "Don't forget sunscreen" or "Take an umbrella at 2 PM")
        - Recommend suitable activities (parks, beaches, indoor venues)
        
        Keep your tone conversational and friendly. Provide 2-3 specific suggestions."""
        
    def _truncate_json(self, weather_data: dict) -> dict:
        # Keep current and daily forecast, limit hourly to 24 hours
        truncated_data = {
            "lat": weather_data.get("lat"),
            "lon": weather_data.get("lon"),
            "timezone": weather_data.get("timezone"),
            "current": weather_data.get("current"),
            "daily": weather_data.get("daily", [])[:3],  # Keep 3 days forecast
            "hourly": weather_data.get("hourly", [])[:24]  # Keep 24 hours
        }
        return truncated_data
        
    def generate_report(self, weather_data: dict) -> str:
        truncated_data = self._truncate_json(weather_data)
        weather_json = json.dumps(truncated_data, indent=2)
        
        messages = [
            SystemMessage(content=self.weather_prompt),
            HumanMessage(content=f"Please analyze this weather data and provide a concise report:\n\nWeather Data:\n{weather_json}")
        ]
        
        response = self.llm.invoke(messages)
        return str(response.content)

    def generate_suggestions(self, weather_report: str) -> str:
        messages = [
            SystemMessage(content=self.suggestion_prompt),
            HumanMessage(content=f"Based on this weather report, what would you suggest?\n\n{weather_report}")
        ]
        
        response = self.llm.invoke(messages)
        return str(response.content)

    def generate_complete_response(self, weather_data: dict) -> dict:
        report = self.generate_report(weather_data)
        suggestions = self.generate_suggestions(report)
        return {
            "report": report,
            "suggestions": suggestions
        }
