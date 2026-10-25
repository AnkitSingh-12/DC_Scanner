"""
DC Scanner - API Keys Endpoints
"""
from fastapi import APIRouter, HTTPException
from ...models.schemas import ApiKeyItem, CreateApiKeyRequest, CreateApiKeyResponse
from ...services.api_key_service import api_key_service

router = APIRouter(prefix="/keys", tags=["API Keys"])

@router.get("", response_model=list[ApiKeyItem])
def list_api_keys():
    """List active developer API keys."""
    return api_key_service.list_keys()

@router.post("", response_model=CreateApiKeyResponse, status_code=201)
def create_api_key(req: CreateApiKeyRequest):
    """Generate a new developer API key."""
    if not req.name.strip():
        raise HTTPException(status_code=400, detail="Key name is required.")
    return api_key_service.create_key(req.name.strip())

@router.delete("/{key_id}")
def revoke_api_key(key_id: str):
    """Revoke an API key."""
    success = api_key_service.revoke_key(key_id)
    if not success:
        raise HTTPException(status_code=404, detail="API key not found")
    return {"message": "API key revoked successfully", "key_id": key_id}
