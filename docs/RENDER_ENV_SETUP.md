# Render.com Environment Variables Checklist

## ✅ Currently Set (Good!)
- ✅ MONGO_URI
- ✅ JWT_SECRET
- ✅ CLOUDINARY_CLOUD_NAME
- ✅ CLOUDINARY_API_KEY
- ✅ CLOUDINARY_API_SECRET
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_PRO_PRICE_ID
- ✅ STRIPE_PUBLISHABLE_KEY
- ✅ AVIATIONSTACK_APIKEY

## ⚠️ CRITICAL: Missing Variables (Must Add!)

### 1. NODE_ENV (REQUIRED)
**Value:** `production`
**Why:** 
- Sets cookies to use `secure: true` and `sameSite: "none"` for cross-origin
- Affects error handling and CORS behavior
- Critical for production deployment

### 2. FRONTEND_URL (REQUIRED)
**Value:** `https://go-buddy-alpha.vercel.app`
**Why:**
- Used by Socket.io for CORS configuration
- Allows real-time connections from your frontend
- Without this, Socket.io connections will fail

### 3. STRIPE_WEBHOOK_SECRET (Optional but Recommended)
**Value:** Your Stripe webhook secret
**Why:**
- Needed if you're using Stripe webhooks for subscription updates
- Get it from Stripe Dashboard → Webhooks → Your webhook → Signing secret

## 📋 Complete Environment Variables List

Add these to your Render dashboard:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://surya:honetechaviation@companion-fly.xrukyux.mongodb.net/

# Authentication
JWT_SECRET=gobuddywebusersecretkey123456789_HoneTechrealtimeflycompanion_mernstackdss

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRO_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_webhook_secret (optional)

# Flight API
AVIATIONSTACK_APIKEY=e74a5fb5ca211843d1ec0e1a8b7dd732

# Frontend URL (for Socket.io CORS)
FRONTEND_URL=https://go-buddy-alpha.vercel.app
```

## 🚨 Action Items

1. **Add NODE_ENV=production** - This is CRITICAL!
2. **Add FRONTEND_URL=https://go-buddy-alpha.vercel.app** - Required for Socket.io
3. **Add STRIPE_WEBHOOK_SECRET** (if using Stripe webhooks)

## After Adding Variables

1. Click "Save and rebuild" in Render
2. Wait for deployment to complete
3. Test your frontend connection

## Notes

- PORT is usually set automatically by Render (don't need to set it manually)
- Make sure your frontend URL matches exactly: `https://go-buddy-alpha.vercel.app`
- NODE_ENV must be exactly `production` (lowercase)

