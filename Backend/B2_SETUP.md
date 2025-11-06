# Backblaze B2 Configuration

Add these environment variables to your `.env` file:

```env
# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_application_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_NAME=your_bucket_name
B2_ENDPOINT=backblazeb2.com
B2_DOWNLOAD_URL=https://your-bucket-name.s3.us-west-000.backblazeb2.com
```

## Setup Instructions

1. **Create a Backblaze B2 Account**

   - Go to https://www.backblaze.com/b2/sign-up.html
   - Sign up for an account

2. **Create a Bucket**

   - Go to B2 Cloud Storage → Buckets
   - Click "Create a Bucket"
   - Choose a unique bucket name
   - Set bucket type to "Public" if you want public file access
   - Note your bucket name

3. **Create Application Keys**

   - Go to App Keys → Add a New Application Key
   - Give it a name (e.g., "go-buddy-messages")
   - Select your bucket
   - Give it "Read and Write" capabilities
   - Copy the `keyID` and `applicationKey`

4. **Get Your Download URL**

   - For public buckets: `https://f{fileId}.{endpoint}/file/{bucketName}/{fileName}`
   - Or use a custom domain/CDN if configured
   - The download URL format depends on your B2 setup

5. **Add to .env**
   - Add all the variables above with your actual values

## File Structure in B2

Files are stored in the `messages/` folder in your bucket:

- Original files: `messages/{timestamp}-{random}.{ext}`
- Image thumbnails: `messages/thumb-{timestamp}-{random}.jpg`

## Features

- ✅ Automatic image thumbnail generation
- ✅ Direct upload to B2 (no local storage)
- ✅ File IDs stored for easy deletion
- ✅ Public URLs stored in database
- ✅ Supports images and documents
