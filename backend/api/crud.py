from fastapi import APIRouter, HTTPException
from services.crudService import CRUDService
from typing import Optional
from services.userService import UserService

router = APIRouter()

@router.post("/create")
async def create_weather(username: str, location: dict, date_range: dict, weather_data: dict):
    user = await UserService.read_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    request_id = await CRUDService.create_weather_request(username, location, date_range, weather_data)
    return {"message": "Weather request created", "request_id": request_id}
@router.get("/read")
async def read_weather():
    weather_requests = await CRUDService.read_weather_requests()
    if not weather_requests:
        raise HTTPException(status_code=404, detail="No weather requests found")
    return weather_requests

@router.put("/update/{request_id}")
async def update_weather(username: str, request_id: str, updates: dict):
    modified_count = await CRUDService.update_weather_request(username, request_id, updates)
    if not modified_count:
        raise HTTPException(status_code=404, detail="Weather request not found")
    return {"message": "Weather request updated"}

@router.delete("/delete/{request_id}")
async def delete_weather(username: str, request_id: str):
    deleted_count = await CRUDService.delete_weather_request(username, request_id)
    if not deleted_count:
        raise HTTPException(status_code=404, detail="Weather request not found")
    return {"message": "Weather request deleted"}
