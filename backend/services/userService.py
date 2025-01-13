from models.model import db, User
from bson import ObjectId

class UserService:
    @staticmethod
    async def create_user(username: str, email: str, password: str):
        # Check if username already exists
        existing_user = await db.users.find_one({"username": username})
        if existing_user:
            raise ValueError("Username already exists")
            
        hashed_password = User.hash_password(password)
        user = User(username=username, email=email, hashed_password=hashed_password)
        result = await db.users.insert_one(user.dict(by_alias=True))
        return username

    @staticmethod
    async def read_user(username: str):
        if username:
            user = await db.users.find_one({"username": username})
            return user
        return await db.users.find().to_list(None)

    @staticmethod
    async def update_user(username: str, updates: dict):
        if "password" in updates:
            updates["hashed_password"] = User.hash_password(updates.pop("password"))
        result = await db.users.update_one({"username": username}, {"$set": updates})
        return result.modified_count

    @staticmethod
    async def delete_user(username: str):
        result = await db.users.delete_one({"username": username})
        return result.deleted_count
