from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger("uvicorn.info")

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        db = client[settings.DATABASE_NAME]
        
        # Test connection ping
        await client.admin.command('ping')
        logger.info(f"Connected successfully to MongoDB at {settings.MONGODB_URL}, database: {settings.DATABASE_NAME}")
        
        # Ensure unique indexes on email and username
        users_col = db["users"]
        await users_col.create_index("email", unique=True)
        await users_col.create_index("username", unique=True)
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    global client
    if client:
        client.close()
        logger.info("Closed MongoDB connection.")

def get_database():
    return db
