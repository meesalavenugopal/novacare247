"""
Upload Routes - AWS S3 presigned URL generation for client-side uploads
Best practices:
- Presigned URLs for secure direct-to-S3 uploads
- File validation before generating URLs
- Organized folder structure
- Admin-only endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from app.auth import get_admin_user
from app.models import User
from app.s3_service import s3_service

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])


class PresignedUrlRequest(BaseModel):
    """Request model for generating presigned upload URL"""
    filename: str
    content_type: str
    folder: str = "misc"  # doctors, services, testimonials, blog, gallery, documents, misc
    file_size: int = 0  # Optional: for server-side validation


class PresignedUrlResponse(BaseModel):
    """Response model for presigned URL"""
    upload_url: str
    file_url: str
    key: str
    expires_in: int


class UploadStatusResponse(BaseModel):
    """Response for upload service status"""
    configured: bool
    bucket: Optional[str] = None
    region: Optional[str] = None
    cdn_enabled: bool = False


class DeleteFileRequest(BaseModel):
    """Request model for deleting a file"""
    file_url: str


@router.get("/status", response_model=UploadStatusResponse)
def get_upload_status(admin: User = Depends(get_admin_user)):
    """
    Check if S3 upload service is configured (admin only)
    """
    from app.config import settings
    
    return UploadStatusResponse(
        configured=s3_service.is_configured,
        bucket=settings.S3_BUCKET_NAME if s3_service.is_configured else None,
        region=settings.AWS_REGION if s3_service.is_configured else None,
        cdn_enabled=bool(settings.CLOUDFRONT_DOMAIN)
    )


@router.post("/presigned-url", response_model=PresignedUrlResponse)
def generate_presigned_url(
    request: PresignedUrlRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Generate a presigned URL for direct S3 upload (admin only)
    
    Client workflow:
    1. Call this endpoint to get presigned URL
    2. PUT the file directly to the upload_url with Content-Type header
    3. Use file_url in your database/form
    
    Example client code:
    ```javascript
    // 1. Get presigned URL
    const res = await api.post('/uploads/presigned-url', {
        filename: 'doctor-photo.jpg',
        content_type: 'image/jpeg',
        folder: 'doctors',
        file_size: file.size
    });
    
    // 2. Upload directly to S3
    await fetch(res.data.upload_url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'image/jpeg' }
    });
    
    // 3. Use the file_url
    await api.put('/doctors/1', { profile_image: res.data.file_url });
    ```
    """
    if not s3_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="File upload service is not configured. Please configure AWS S3 credentials."
        )
    
    # Validate folder
    valid_folders = ['doctors', 'services', 'testimonials', 'blog', 'gallery', 'documents', 'misc']
    if request.folder not in valid_folders:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid folder. Must be one of: {', '.join(valid_folders)}"
        )
    
    try:
        result = s3_service.generate_presigned_upload_url(
            original_filename=request.filename,
            content_type=request.content_type,
            folder=request.folder,
            file_size=request.file_size
        )
        
        return PresignedUrlResponse(**result)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/presigned-url/public", response_model=PresignedUrlResponse)
def generate_public_presigned_url(request: PresignedUrlRequest):
    """
    Generate a presigned URL for doctor application uploads (public endpoint)
    Only allows uploads to 'documents' folder for security
    """
    if not s3_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="File upload service is not configured. Please configure AWS S3 credentials."
        )
    
    # Restrict to documents folder only for public uploads
    if request.folder not in ['documents']:
        request.folder = 'documents'  # Force documents folder
    
    try:
        result = s3_service.generate_presigned_upload_url(
            original_filename=request.filename,
            content_type=request.content_type,
            folder=request.folder,
            file_size=request.file_size
        )
        
        return PresignedUrlResponse(**result)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/direct")
async def upload_file_directly(
    file: UploadFile = File(...),
    folder: str = "misc",
    admin: User = Depends(get_admin_user)
):
    """
    Upload file directly through the server (admin only)
    Use this for smaller files when client-side upload isn't feasible
    
    Note: For large files, use presigned URL method instead
    """
    if not s3_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="File upload service is not configured."
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size (max 5MB for direct upload)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Use presigned URL for files over 5MB."
        )
    
    try:
        file_url = s3_service.upload_file_directly(
            file_content=content,
            original_filename=file.filename or "upload",
            content_type=file.content_type or "application/octet-stream",
            folder=folder
        )
        
        return {"file_url": file_url, "filename": file.filename}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/")
def delete_file(
    request: DeleteFileRequest,
    admin: User = Depends(get_admin_user)
):
    """
    Delete a file from S3 (admin only)
    """
    if not s3_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="File upload service is not configured."
        )
    
    success = s3_service.delete_file_by_url(request.file_url)
    
    if success:
        return {"message": "File deleted successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to delete file")


@router.get("/allowed-types")
def get_allowed_file_types():
    """
    Get allowed file types and their max sizes (public endpoint for UI validation)
    """
    return {
        "images": {
            content_type: f"{size / (1024 * 1024)}MB"
            for content_type, size in s3_service.ALLOWED_IMAGE_TYPES.items()
        },
        "documents": {
            content_type: f"{size / (1024 * 1024)}MB"
            for content_type, size in s3_service.ALLOWED_DOCUMENT_TYPES.items()
        },
        "folders": list(s3_service.FOLDERS.keys())
    }
