# JWT Token & Cookie Persistence Fixes

## Issues Fixed

1. **Short Token Expiration**: JWT tokens were expiring after only 7 days
2. **Cookie Configuration**: Cookie settings were too restrictive (`sameSite: "strict"`) causing issues
3. **Missing Cookie Attributes**: Missing `maxAge` and `path` attributes
4. **Environment-Specific Settings**: Cookie settings weren't adapting to development vs production

## Changes Made

### 1. Backend - Token Generation (`Backend/libs/util.js`)

- ✅ Increased JWT expiration from **7 days to 30 days**
- ✅ Changed `sameSite` from `"strict"` to `"lax"` for development (more permissive)
- ✅ Added `maxAge` explicitly (30 days in milliseconds)
- ✅ Added `path: "/"` to ensure cookie is available site-wide
- ✅ Made `secure` flag conditional (only true in production)
- ✅ Set `sameSite: "none"` for production (required for cross-origin cookies)

### 2. Backend - Logout (`Backend/controllers/authcontroller.js`)

- ✅ Updated cookie clearing to match the same settings as cookie creation
- ✅ Ensures consistent cookie handling

### 3. Backend - Auth Middleware (`Backend/middleware/auth.middleware.js`)

- ✅ Improved error handling for expired tokens
- ✅ Better error messages for debugging
- ✅ Specific error codes for different JWT errors

### 4. Frontend - Axios Configuration (`frontend/src/utils/axios.js`)

- ✅ Added request interceptor to ensure `withCredentials` is always true
- ✅ Added support for environment variable `VITE_API_URL`
- ✅ Ensures cookies are sent with every request

## Cookie Settings Explained

### Development (localhost)

```javascript
{
  httpOnly: true,        // Prevents JavaScript access (security)
  secure: false,         // Can use HTTP (not HTTPS)
  sameSite: "lax",      // More permissive for local development
  path: "/",            // Available across entire site
  maxAge: 30 days       // 30 days expiration
}
```

### Production

```javascript
{
  httpOnly: true,        // Prevents JavaScript access (security)
  secure: true,          // Only sent over HTTPS
  sameSite: "none",      // Required for cross-origin cookies
  path: "/",            // Available across entire site
  maxAge: 30 days       // 30 days expiration
}
```

## Testing

1. **Login** - Cookies should now persist for 30 days
2. **Refresh Page** - User should remain logged in
3. **Close Browser** - After reopening, user should still be logged in (within 30 days)
4. **Check Browser DevTools** - Cookie should show expiration date 30 days in the future

## Environment Variables

Make sure your `.env` file has:

```env
NODE_ENV=development  # or "production"
JWT_SECRET=your_secret_key_here
```

For frontend, optionally create `.env` file:

```env
VITE_API_URL=http://localhost:5000  # or your production URL
```

## Troubleshooting

If cookies still don't persist:

1. **Check Browser Settings**: Ensure cookies are enabled
2. **Check Domain**: Make sure frontend and backend are on compatible domains
3. **Check HTTPS**: In production, ensure you're using HTTPS
4. **Clear Old Cookies**: Clear browser cookies and login again
5. **Check Console**: Look for cookie-related errors in browser console

## Next Steps

After these changes:

1. Restart your backend server
2. Clear browser cookies
3. Login again
4. Cookies should now persist for 30 days
