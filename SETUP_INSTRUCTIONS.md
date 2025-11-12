# Go Buddy - Setup Instructions

## Project Overview
Go Buddy is a full-stack application that helps users find travel companions for flights. It consists of:
- **Backend**: Node.js/Express API (Port 5000)
- **Frontend**: React/Vite application (Port 5173 by default)
- **Database**: MongoDB

## Prerequisites
1. **Node.js** (v20.x required) - [Download here](https://nodejs.org/)
2. **MongoDB** - Either:
   - Local MongoDB installation, or
   - MongoDB Atlas account (cloud database)
3. **Aviation Stack API Key** - [Get free API key](https://aviationstack.com/)

## Setup Steps

### 1. Install Node.js
- Download and install Node.js v20.x from https://nodejs.org/
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

### 2. Backend Setup

#### Navigate to Backend directory:
```powershell
cd Go_buddy/Backend
```

#### Install dependencies:
```powershell
npm install
```

#### Create `.env` file:
Create a file named `.env` in the `Go_buddy/Backend/` directory with:

```env
MONGO_URI=mongodb://localhost:27017/gobuddy
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gobuddy

JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters

PORT=5000

AVIATIONSTACK_APIKEY=your_aviationstack_api_key
```

**Important**: 
- Replace `MONGO_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a secure random string (at least 32 characters)
- Get your Aviation Stack API key from https://aviationstack.com/

#### Start Backend Server:
```powershell
npm start
# OR for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend directory (in a new terminal):
```powershell
cd Go_buddy/frontend
```

#### Install dependencies:
```powershell
npm install
```

#### Update API Configuration:
The frontend currently points to production API. For local development, you need to update:

**File**: `Go_buddy/frontend/src/utils/axios.js`
Change:
```javascript
baseURL: "", //"http://localhost:5000/",
```
To:
```javascript
baseURL: "http://localhost:5000/",
```

**File**: `Go_buddy/frontend/src/store/useAuthstore.js`
Replace all production URLs (`https://go-buddy-1-3scd.onrender.com`) with empty strings to use the axios baseURL, or directly use `http://localhost:5000`.

#### Start Frontend Development Server:
```powershell
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

## Application Structure

### Backend Routes:
- `/user` - Authentication (signup, login, logout, profile)
- `/companions` - Companion requests management
- `/flights` - Flight search and data

### Frontend Pages:
- `/` - Homepage
- `/login` - Login page
- `/signup` - Signup page
- `/profile` - User profile (protected)
- `/search` - Flight search (protected)
- `/bookings` - User bookings (protected)
- `/flightjoin/:iata/:date` - Join a flight (protected)
- `/housing` - Housing page
- `/about` - About page

## Key Features:
1. User authentication with JWT cookies
2. Flight search using Aviation Stack API
3. Companion request system
4. User profile management
5. Flight booking system

## Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB is running (if using local installation)
- Check your `MONGO_URI` is correct
- Verify network access for MongoDB Atlas

### Port Already in Use:
- Change `PORT` in backend `.env` file
- Update CORS allowed origins in `server.js` if needed
- Update frontend axios baseURL if backend port changes

### API Errors:
- Verify Aviation Stack API key is valid
- Check API rate limits
- Ensure backend is running before starting frontend

## Development Notes:
- Backend uses ES6 modules (`type: "module"`)
- Frontend uses React 19, Vite, Tailwind CSS
- Authentication uses HTTP-only cookies for security
- CORS is configured for specific origins

