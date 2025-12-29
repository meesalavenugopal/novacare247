"""
AWS S3 Service for file uploads with best practices:
- Presigned URLs for secure client-side uploads
- File validation (type, size)
- Unique filenames to prevent collisions
- Organized folder structure
- Optional CloudFront CDN integration
"""

import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
import uuid
from datetime import datetime
from typing import Optional, Tuple
import mimetypes
from app.config import settings


class S3Service:
    """AWS S3 service for secure file uploads"""
    
    # Allowed file types and their max sizes (in bytes)
    ALLOWED_IMAGE_TYPES = {
        'image/jpeg': 5 * 1024 * 1024,  # 5MB
        'image/png': 5 * 1024 * 1024,   # 5MB
        'image/webp': 5 * 1024 * 1024,  # 5MB
        'image/gif': 2 * 1024 * 1024,   # 2MB
    }
    
    ALLOWED_DOCUMENT_TYPES = {
        'application/pdf': 10 * 1024 * 1024,  # 10MB
    }
    
    # Folder structure in S3
    FOLDERS = {
        'doctors': 'doctors/',
        'services': 'services/',
        'testimonials': 'testimonials/',
        'blog': 'blog/',
        'gallery': 'gallery/',
        'documents': 'documents/',
        'misc': 'misc/',
    }
    
    def __init__(self):
        self._client = None
        self._is_configured = False
        self._check_configuration()
    
    def _check_configuration(self):
        """Check if AWS credentials are configured"""
        self._is_configured = bool(
            settings.AWS_ACCESS_KEY_ID and 
            settings.AWS_SECRET_ACCESS_KEY and 
            settings.S3_BUCKET_NAME
        )
    
    @property
    def client(self):
        """Lazy initialization of S3 client"""
        if self._client is None and self._is_configured:
            # Configure with retries and timeouts
            config = Config(
                region_name=settings.AWS_REGION,
                signature_version='s3v4',
                s3={
                    'addressing_style': 'virtual'
                },
                retries={
                    'max_attempts': 3,
                    'mode': 'standard'
                }
            )
            self._client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
                endpoint_url=f"https://s3.{settings.AWS_REGION}.amazonaws.com",
                config=config
            )
        return self._client
    
    @property
    def is_configured(self) -> bool:
        """Check if S3 is properly configured"""
        return self._is_configured
    
    def _generate_unique_filename(self, original_filename: str, folder: str) -> str:
        """Generate a unique filename with timestamp and UUID"""
        # Extract extension
        ext = original_filename.rsplit('.', 1)[-1].lower() if '.' in original_filename else 'jpg'
        
        # Generate unique name: folder/YYYY/MM/uuid_timestamp.ext
        now = datetime.utcnow()
        unique_id = uuid.uuid4().hex[:12]
        timestamp = now.strftime('%Y%m%d_%H%M%S')
        
        return f"{folder}{now.year}/{now.month:02d}/{unique_id}_{timestamp}.{ext}"
    
    def validate_file(
        self, 
        content_type: str, 
        file_size: int, 
        file_category: str = 'image'
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate file type and size
        Returns: (is_valid, error_message)
        """
        if file_category == 'image':
            allowed_types = self.ALLOWED_IMAGE_TYPES
        elif file_category == 'document':
            allowed_types = self.ALLOWED_DOCUMENT_TYPES
        else:
            allowed_types = {**self.ALLOWED_IMAGE_TYPES, **self.ALLOWED_DOCUMENT_TYPES}
        
        # Check content type
        if content_type not in allowed_types:
            allowed = ', '.join(allowed_types.keys())
            return False, f"File type '{content_type}' not allowed. Allowed types: {allowed}"
        
        # Check file size
        max_size = allowed_types[content_type]
        if file_size > max_size:
            max_mb = max_size / (1024 * 1024)
            return False, f"File too large. Maximum size for {content_type}: {max_mb}MB"
        
        return True, None
    
    def generate_presigned_upload_url(
        self,
        original_filename: str,
        content_type: str,
        folder: str = 'misc',
        file_size: int = 0
    ) -> dict:
        """
        Generate a presigned URL for client-side upload
        
        Args:
            original_filename: Original name of the file
            content_type: MIME type of the file
            folder: Destination folder (doctors, services, etc.)
            file_size: Size of file in bytes for validation
            
        Returns:
            {
                'upload_url': Presigned PUT URL,
                'file_url': Final URL to access the file,
                'key': S3 object key,
                'expires_in': URL expiry in seconds
            }
        """
        if not self.is_configured:
            raise ValueError("AWS S3 is not configured. Please set AWS credentials in environment.")
        
        # Validate folder
        folder_path = self.FOLDERS.get(folder, self.FOLDERS['misc'])
        
        # Validate file if size provided
        if file_size > 0:
            is_valid, error = self.validate_file(content_type, file_size)
            if not is_valid:
                raise ValueError(error)
        
        # Generate unique key
        key = self._generate_unique_filename(original_filename, folder_path)
        
        try:
            # Generate presigned URL for PUT operation
            presigned_url = self.client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': settings.S3_BUCKET_NAME,
                    'Key': key,
                    'ContentType': content_type,
                },
                ExpiresIn=settings.S3_PRESIGNED_URL_EXPIRY,
                HttpMethod='PUT'
            )
            
            # Build the final file URL
            if settings.CLOUDFRONT_DOMAIN:
                file_url = f"https://{settings.CLOUDFRONT_DOMAIN}/{key}"
            else:
                file_url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            
            return {
                'upload_url': presigned_url,
                'file_url': file_url,
                'key': key,
                'expires_in': settings.S3_PRESIGNED_URL_EXPIRY
            }
            
        except ClientError as e:
            raise ValueError(f"Failed to generate presigned URL: {str(e)}")
    
    def generate_presigned_download_url(self, key: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for private file download"""
        if not self.is_configured:
            raise ValueError("AWS S3 is not configured")
        
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': settings.S3_BUCKET_NAME,
                    'Key': key,
                },
                ExpiresIn=expires_in
            )
            return url
        except ClientError as e:
            raise ValueError(f"Failed to generate download URL: {str(e)}")
    
    def delete_file(self, key: str) -> bool:
        """Delete a file from S3"""
        if not self.is_configured:
            return False
        
        try:
            self.client.delete_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=key
            )
            return True
        except ClientError:
            return False
    
    def delete_file_by_url(self, file_url: str) -> bool:
        """Delete a file from S3 using its full URL"""
        if not file_url or not self.is_configured:
            return False
        
        # Extract key from URL
        key = self._extract_key_from_url(file_url)
        if key:
            return self.delete_file(key)
        return False
    
    def _extract_key_from_url(self, url: str) -> Optional[str]:
        """Extract S3 key from a full URL"""
        if not url:
            return None
        
        # Handle CloudFront URL
        if settings.CLOUDFRONT_DOMAIN and settings.CLOUDFRONT_DOMAIN in url:
            return url.split(settings.CLOUDFRONT_DOMAIN + '/')[1] if settings.CLOUDFRONT_DOMAIN in url else None
        
        # Handle S3 URL
        if settings.S3_BUCKET_NAME in url:
            # Format: https://bucket.s3.region.amazonaws.com/key
            parts = url.split('.amazonaws.com/')
            if len(parts) > 1:
                return parts[1]
        
        return None
    
    def upload_file_directly(
        self,
        file_content: bytes,
        original_filename: str,
        content_type: str,
        folder: str = 'misc'
    ) -> str:
        """
        Upload file directly from server (for smaller files or server-side processing)
        Returns the final file URL
        """
        if not self.is_configured:
            raise ValueError("AWS S3 is not configured")
        
        # Validate file
        is_valid, error = self.validate_file(content_type, len(file_content))
        if not is_valid:
            raise ValueError(error)
        
        folder_path = self.FOLDERS.get(folder, self.FOLDERS['misc'])
        key = self._generate_unique_filename(original_filename, folder_path)
        
        try:
            self.client.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=key,
                Body=file_content,
                ContentType=content_type,
                CacheControl='public, max-age=31536000',  # 1 year cache
            )
            
            if settings.CLOUDFRONT_DOMAIN:
                return f"https://{settings.CLOUDFRONT_DOMAIN}/{key}"
            return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
            
        except ClientError as e:
            raise ValueError(f"Failed to upload file: {str(e)}")


# Singleton instance
s3_service = S3Service()
