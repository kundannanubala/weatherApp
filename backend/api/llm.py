from fastapi import APIRouter
from services.llmServices import WeatherReportService
from typing import Dict, Any
from pydantic import BaseModel

class WeatherRequest(BaseModel):
    data: Dict[str, Any]

class WeatherReport(BaseModel):
    report: str

class WeatherReportText(BaseModel):
    text: str  # Simple text field for the report

llm = WeatherReportService()
router = APIRouter()

@router.post("/")
def get_weather_report(request: WeatherRequest):
    return llm.generate_report(request.data)

@router.post("/suggestions")
async def get_weather_suggestions(report: WeatherReportText):
    """
    Accepts a plain text weather report and generates suggestions
    Example input:
    {
        "text": "Here's a concise weather report..."
    }
    """
    return llm.generate_suggestions(report.text)

@router.post("/complete")
def get_complete_response(request: WeatherRequest):
    return llm.generate_complete_response(request.data)