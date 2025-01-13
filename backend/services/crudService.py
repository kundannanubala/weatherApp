from models.model import db, WeatherRequest, OperationLog
from bson import ObjectId

class CRUDService:
    @staticmethod
    async def log_operation(username, operation, record_id):
        log_entry = OperationLog(username=username, operation=operation, record_id=record_id)
        await db.operation_logs.insert_one(log_entry.dict(by_alias=True))

    @staticmethod
    async def create_weather_request(username, location, date_range, weather_data):
        record = WeatherRequest(username=username, location=location, date_range=date_range, weather_data=weather_data)
        result = await db.weather_requests.insert_one(record.dict(by_alias=True))
        record_id = str(result.inserted_id)
        await CRUDService.log_operation(username, "CREATE", record_id)
        return record_id

    @staticmethod
    async def read_weather_requests():
        """Fetch all weather requests from database"""
        return await db.weather_requests.find().to_list(None)

    @staticmethod
    async def update_weather_request(username: str, request_id: str, updates: dict):
        """Update weather request by username and request_id"""
        result = await db.weather_requests.update_one(
            {"username": username, "_id": ObjectId(request_id)}, 
            {"$set": updates}
        )
        return result.modified_count

    @staticmethod
    async def delete_weather_request(username: str, request_id: str):
        """Delete weather request by username and request_id"""
        result = await db.weather_requests.delete_one(
            {"username": username, "_id": ObjectId(request_id)}
        )
        if result.deleted_count:
            await CRUDService.log_operation(username, "DELETE", request_id)
        return result.deleted_count
