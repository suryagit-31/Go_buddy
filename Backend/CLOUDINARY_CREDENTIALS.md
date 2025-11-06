# Environment Variables for Cloudinary

Add these **3 credentials** to your `.env` file in the `Backend` folder:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## How to Get Your Cloudinary Credentials:

### Step 1: Sign Up for Cloudinary

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account (no credit card required)
3. Free tier includes: 25GB storage, 25GB bandwidth/month

### Step 2: Get Your Credentials

After signing up, you'll be taken to your Dashboard. You'll see:

**Dashboard URL:** https://console.cloudinary.com/console

On the Dashboard, you'll see a box showing:

- **Cloud Name** (e.g., `dxyz123abc`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 3: Copy to Your .env File

Create or edit your `.env` file in the `Backend` folder:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**⚠️ Important:**

- Replace the example values above with your actual credentials
- Never commit your `.env` file to Git (it should be in `.gitignore`)
- Keep your API Secret secure - don't share it publicly

### Example .env File Structure

If you have other environment variables, your `.env` file might look like:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret

# Cloudinary (NEW - Add these)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (if you're using it)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRO_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Testing Your Setup

After adding the credentials, restart your backend server:

```bash
npm run dev
```

If configured correctly, you should see no errors. You can test by:

1. Uploading a profile picture via `POST /user/upload-profile-picture`
2. Sending a message with an image attachment

## Troubleshooting

If you get errors:

- ✅ Make sure all 3 variables are set
- ✅ Check for typos in variable names (they're case-sensitive)
- ✅ Verify your credentials are correct in Cloudinary Dashboard
- ✅ Restart your server after adding the variables
