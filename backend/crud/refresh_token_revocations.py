from config import settings
from motor.motor_asyncio import AsyncIOMotorCollection
from db import get_refresh_token_revocations_collection
from datetime import datetime, timezone
class RefreshTokenRevocationCRUD:
    """CRUD for revoked refresh tokens."""

    @staticmethod
    async def revoke(token: str, expires_at: int) -> None:
        col = get_refresh_token_revocations_collection()
        await col.insert_one({
            "token": token,
            "expires_at": expires_at,
            "revoked_at": datetime.now(timezone.utc)
        })

    @staticmethod
    async def is_revoked(token: str) -> bool:
        col = get_refresh_token_revocations_collection()
        doc = await col.find_one({"token": token})
        return doc is not None

    @staticmethod
    async def cleanup_expired(now_ts: int) -> None:
        col = get_refresh_token_revocations_collection()
        await col.delete_many({"expires_at": {"$lt": now_ts}})
