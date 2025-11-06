# How to Build and Run Frontend & Backend

## Development Mode (Auto-reload)

### Backend (Development with Auto-reload)

```bash
# Navigate to backend directory
cd Backend

# Install dependencies (if not already installed)
npm install

# Run in development mode (auto-reloads on file changes)
npm run dev
```

The backend will run on `http://localhost:5000` (or PORT from .env)

### Frontend (Development with Hot Reload)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Run development server (hot reload enabled)
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default port)

---

## Production Mode

### Backend (Production)

```bash
# Navigate to backend directory
cd Backend

# Run in production mode
npm start
```

### Frontend (Production Build)

```bash
# Navigate to frontend directory
cd frontend

# Build for production
npm run build

# Preview production build locally (optional)
npm run preview
```

The build output will be in `frontend/dist/` directory.

---

## Running Both Simultaneously

### Option 1: Two Terminal Windows

**Terminal 1 (Backend):**

```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

### Option 2: Using npm-run-all (if installed)

Create a script in root `package.json`:

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:backend": "cd Backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

Then run: `npm run dev` from root directory.

---

## Important Notes

1. **Environment Variables**: Make sure you have a `.env` file in the Backend directory with:

   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `AVIATIONSTACK_APIKEY` - API key for flight data

2. **Database**: Ensure MongoDB is running and accessible

3. **CORS**: The backend is configured to allow requests from:

   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` and `http://localhost:3001`
   - Your production domains

4. **Auto-reload**:
   - Backend: Uses `nodemon` - automatically restarts on file changes
   - Frontend: Uses Vite HMR (Hot Module Replacement) - updates without full page reload

---

## Troubleshooting

### Backend won't start:

- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is already in use
- Run `npm install` to ensure dependencies are installed

### Frontend won't start:

- Check if port 5173 is already in use
- Run `npm install` to ensure dependencies are installed
- Clear node_modules and reinstall if needed: `rm -rf node_modules && npm install`

### Connection issues:

- Verify backend is running on correct port
- Check CORS configuration in `Backend/server.js`
- Ensure API URLs in frontend match backend URL
