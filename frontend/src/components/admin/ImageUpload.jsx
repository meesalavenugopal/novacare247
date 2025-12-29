import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { uploadAPI } from '../../services/api';

/**
 * Reusable Image Upload component with S3 integration
 * 
 * Usage:
 * <ImageUpload
 *   value={formData.profile_image}
 *   onChange={(url) => setFormData({...formData, profile_image: url})}
 *   folder="doctors"
 *   placeholder="Upload doctor photo"
 * />
 */
const ImageUpload = ({ 
  value, 
  onChange, 
  folder = 'misc',
  placeholder = 'Click or drag to upload image',
  className = '',
  aspectRatio = 'square', // square, portrait, landscape, auto
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  disabled = false,
  originalValue = '' // Track original value to detect new uploads
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(''); // Track what we uploaded in this session
  const fileInputRef = useRef(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-video',
    auto: ''
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    setError('');

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Use the S3 upload helper
      const fileUrl = await uploadAPI.uploadToS3(file, folder);
      setUploadedUrl(fileUrl); // Track what we uploaded
      onChange(fileUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      
      // Handle specific error messages
      if (err.response?.status === 503) {
        setError('Upload service not configured. Please add image URL manually.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Cleanup function to delete uploaded image if cancelled
  const cleanupUpload = async () => {
    if (uploadedUrl && uploadedUrl !== originalValue) {
      try {
        await uploadAPI.deleteFile(uploadedUrl);
        console.log('Cleaned up orphaned upload:', uploadedUrl);
      } catch (err) {
        console.error('Failed to cleanup upload:', err);
      }
      setUploadedUrl('');
    }
  };

  // Expose cleanup function via ref or just handle remove
  const handleRemove = async () => {
    // If this is a newly uploaded file (not original), delete it
    if (value && value === uploadedUrl && value !== originalValue) {
      await cleanupUpload();
    }
    setUploadedUrl('');
    onChange('');
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        // Preview with uploaded image
        <div className={`relative rounded-lg overflow-hidden bg-gray-100 ${aspectRatioClasses[aspectRatio]}`}>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Image+Error';
            }}
          />
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Replace image"
              >
                <Upload className="w-5 h-5 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Remove image"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>
      ) : (
        // Upload area
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative rounded-lg border-2 border-dashed transition-all cursor-pointer
            ${aspectRatioClasses[aspectRatio] || 'min-h-[200px]'}
            ${isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 font-medium">{placeholder}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} • Max {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual URL input fallback */}
      {!value && !isUploading && (
        <div className="mt-3">
          <input
            type="url"
            placeholder="Or paste image URL..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
