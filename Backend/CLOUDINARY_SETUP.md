# Cloudinary Configuration

This project uses Cloudinary for image and file storage instead of Backblaze B2.

## Setup Instructions

1. **Create a Cloudinary Account**

   - Go to https://cloudinary.com/users/register/free
   - Sign up for a free account (includes 25GB storage and 25GB bandwidth)

2. **Get Your Credentials**

   - After signing up, go to your Dashboard
   - You'll find your credentials:
     - Cloud Name
     - API Key
     - API Secret

3. **Add Environment Variables**
   Add these to your `.env` file:

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Install Dependencies**
   ```bash
   npm install cloudinary
   ```

## Features

### Message Image Uploads

- Images uploaded to `messages/` folder in Cloudinary
- Automatic thumbnail generation (300x300px)
- Optimized delivery with automatic format conversion

### Profile Picture Uploads

- Images uploaded to `profiles/` folder in Cloudinary
- Automatic face detection and cropping (400x400px)
- Optimized quality and format

### File Uploads

- Supports images, PDFs, documents, and other file types
- Files uploaded to `messages/` folder
- Maximum file size: 10MB

## API Endpoints

### Upload Profile Picture

```
POST /user/upload-profile-picture
Content-Type: multipart/form-data
Body: profilePicture (file)
```

### Upload Message File/Image

```
POST /messages/upload
Content-Type: multipart/form-data
Body:
  - connectionId (string)
  - file (file)
```

## Cloudinary Features Used

- **Automatic Format Conversion**: Images are automatically converted to the best format (WebP, AVIF, etc.)
- **On-the-fly Transformations**: Thumbnails are generated using URL transformations
- **Face Detection**: Profile pictures use face detection for better cropping
- **Optimization**: Automatic quality optimization for faster loading

## Migration from Backblaze B2

If you were previously using Backblaze B2:

1. Old files in B2 will remain accessible via their stored URLs
2. New uploads will use Cloudinary
3. To migrate existing files, you would need to download from B2 and re-upload to Cloudinary

## Security Notes

- Never commit your API Secret to version control
- Use environment variables for all credentials
- Cloudinary URLs are public by default - ensure proper access controls if needed
- Consider using signed URLs for private content if required
