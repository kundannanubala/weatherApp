from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel
from services.crudService import CRUDService
from typing import Dict, Any
import logging

router = APIRouter()

class WeatherRequestBody(BaseModel):
    username: str
    location: dict
    date_range: dict
    weather_data: Dict[str, dict]

class UpdateWeatherRequest(BaseModel):
    request_id: str
    updates: Dict[str, Any]

@router.post("/create")
async def create_weather(request: WeatherRequestBody):
    try:
        request_id = await CRUDService.create_weather_request(
            request.username, 
            request.location, 
            request.date_range, 
            request.weather_data
        )
        return {"message": "Weather request created", "request_id": request_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/read")
async def read_weather():
    try:
        weather_requests = await CRUDService.read_weather_requests()
        if not weather_requests:
            return []
        return weather_requests
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/update")
async def update_weather(request: UpdateWeatherRequest):
    try:
        modified_count = await CRUDService.update_weather_request(request.request_id, request.updates)
        if not modified_count:
            raise HTTPException(status_code=404, detail="Weather request not found")
        return {"message": "Weather request updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete")
async def delete_weather(
    request_id: str
):
    logging.info(f"Delete request received for request_id: {request_id}")
    try:
        deleted_count = await CRUDService.delete_weather_request(request_id)
        if not deleted_count:
            raise HTTPException(status_code=404, detail="Weather request not found")
        return {"message": "Weather request deleted"}
    except Exception as e:
        logging.error(f"Error deleting weather request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
