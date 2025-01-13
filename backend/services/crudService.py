from models.model import db, WeatherRequest, OperationLog
from bson import ObjectId
import logging

# Configure logging
# logging.basicConfig(
#     filename='app.log',  # Log messages will be written to this file
#     level=logging.INFO,   # Set the logging level to INFO
#     format='%(asctime)s - %(levelname)s - %(message)s'  # Log message format
# )

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
    async def update_weather_request(request_id: str, updates: dict):
        """Update weather request by request_id"""
        result = await db.weather_requests.update_one(
            {"_id": request_id},  # Remove username check
            {"$set": updates}
        )
        return result.modified_count

    @staticmethod
    async def delete_weather_request(request_id: str):
        # logging.info(f"Delete operation initiated for request_id: {request_id}")
        result = await db.weather_requests.delete_one(
            {"_id": request_id}  # Remove username check
        )
        
        # if result.deleted_count:
        #     # Note: You might want to fetch the username before deletion if you need it for logging
        #     await CRUDService.log_operation("system", "DELETE", request_id)
        # else:
        #     logging.error(f"No document found for request_id: {request_id}")
        return result.deleted_count
