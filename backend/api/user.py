from fastapi import APIRouter, HTTPException
from services.userService import UserService

router = APIRouter()

@router.post("/create")
async def create_user(username: str, email: str, password: str):
    try:
        username = await UserService.create_user(username, email, password)
        return {"message": "User created", "username": username}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/read/{username}")
async def read_user(username: str):
    user = await UserService.read_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/update/{username}")
async def update_user(username: str, updates: dict):
    modified_count = await UserService.update_user(username, updates)
    if not modified_count:
        raise HTTPException(status_code=404, detail="User not found or no changes made")
    return {"message": "User updated"}

@router.delete("/delete/{username}")
async def delete_user(username: str):
    deleted_count = await UserService.delete_user(username)
    if not deleted_count:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
