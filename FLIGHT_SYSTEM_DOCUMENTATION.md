# Flight System Documentation - Go Buddy

## Table of Contents
1. [Overview](#overview)
2. [Flight Fetching Architecture](#flight-fetching-architecture)
3. [Libraries and Dependencies](#libraries-and-dependencies)
4. [Flight Fetching Workflows](#flight-fetching-workflows)
5. [Helper and Help Seeker Storage](#helper-and-help-seeker-storage)
6. [Matching System](#matching-system)
7. [API Endpoints](#api-endpoints)
8. [Data Flow Diagrams](#data-flow-diagrams)

---

## Overview

Go Buddy is a travel companion matching platform that connects passengers who need assistance (Help Seekers) with those who can provide assistance (Helpers) on the same flights. The system fetches real-time flight data from Aviation Stack API and matches users based on flight IATA codes and dates.

**Key Concepts:**
- **Helper**: A passenger who can assist others during the flight (may be paid or volunteer)
- **Help Seeker**: A passenger who needs assistance (e.g., medical conditions, language barriers, mobility issues)
- **Flight Matching**: Users are matched based on `flight_iata` and `flight_date`

---

## Flight Fetching Architecture

### System Components

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Backend API   │
│   (Express.js)  │
└────────┬────────┘
         │
         ├──► Flight Controllers
         │
         ▼
┌─────────────────┐
│ Aviation Service│
│   (Axios)       │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│ Aviation Stack  │
│   External API  │
└─────────────────┘
```

### Technology Stack

**Backend:**
- **Express.js** - Web framework
- **Axios** - HTTP client for API calls
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variable management

**Frontend:**
- **React 19** - UI framework
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation
- **Framer Motion** - Animations

**External APIs:**
- **Aviation Stack API** - Real-time flight data provider

---

## Libraries and Dependencies

### Backend Libraries

#### 1. **Axios** (`axios@^1.9.0`)
**Purpose**: HTTP client for making requests to Aviation Stack API

**Usage:**
```javascript
// services/aviationservice.js
import axios from "axios";

const response = await axios.get(AVIATION_BASEURL, {
  params: {
    access_key: Aviation_key,
    dep_iata: dep_iata,
    arr_iata: arr_iata,
  },
});
```

**Key Features:**
- Promise-based HTTP client
- Automatic JSON parsing
- Request/response interceptors
- Error handling

#### 2. **Mongoose** (`mongoose@^8.13.3`)
**Purpose**: MongoDB object modeling tool

**Usage:**
```javascript
// models/Helper.model.js
import mongoose from "mongoose";

export const HelperRequest = mongoose.model(
  "HelperRequest",
  companionBaseSchema,
  "Helpers"  // Collection name
);
```

**Key Features:**
- Schema validation
- Data modeling
- Query building
- Middleware support

#### 3. **dotenv** (`dotenv@^16.5.0`)
**Purpose**: Environment variable management

**Usage:**
```javascript
// Backend/.env
MONGO_URI=mongodb://localhost:27017/gobuddy
AVIATIONSTACK_APIKEY=your_api_key_here
JWT_SECRET=your_secret_key
PORT=5000
```

### Frontend Libraries

#### 1. **Zustand** (`zustand@^5.0.3`)
**Purpose**: Lightweight state management

**Usage:**
```javascript
// store/useflightstore.js
import { create } from "zustand";

const useFlightStore = create((set, get) => ({
  available_flights: [],
  isloadingflights: false,
  fetchFlights: async (data) => {
    set({ isloadingflights: true });
    const response = await axiosInstance.post("/flights", data);
    set({ available_flights: response.data, isloadingflights: false });
  },
}));
```

**Key Features:**
- Simple API
- No boilerplate
- React hooks integration
- TypeScript support

#### 2. **React Hook Form** (`react-hook-form@^7.56.1`)
**Purpose**: Form state management and validation

**Usage:**
```javascript
// components/flightsearchform.jsx
const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("dep_iata", { required: "From location is required" })} />
</form>
```

---

## Flight Fetching Workflows

### Workflow 1: Search Flights by Route and Date

**Frontend Flow:**

```
1. User fills search form (dep_iata, arr_iata, flight_date)
   ↓
2. FlightSearchForm component calls fetchFlights(data)
   ↓
3. useFlightStore.fetchFlights() makes POST request
   ↓
4. Backend receives request at /flights endpoint
   ↓
5. flightcontroller.fetchFlightsByRouteAndDate() processes request
   ↓
6. Calls aviationservice.getFlightsByRouteAndDate()
   ↓
7. Axios GET request to Aviation Stack API
   ↓
8. Response filtered and returned to frontend
   ↓
9. Flights displayed in FlightCard components
```

**Code Flow:**

```javascript
// 1. Frontend: User submits form
// components/flightsearchform.jsx
const onSubmit = (data) => {
  fetchFlights(data);  // { dep_iata: "JFK", arr_iata: "LAX", flight_date: "2024-01-15" }
};

// 2. Store: Make API call
// store/useflightstore.js
fetchFlights: async (data) => {
  set({ isloadingflights: true });
  const response = await axiosInstance.post("/flights", data);
  set({ available_flights: response.data, isloadingflights: false });
}

// 3. Backend: Route handler
// routes/flightRoutes.js
router.post("/", fetchFlightsByRouteAndDate);

// 4. Controller: Process request
// controllers/flightcontroller.js
export async function fetchFlightsByRouteAndDate(req, res) {
  const { dep_iata, arr_iata, flight_date } = req.body;
  const data = await getFlightsByRouteAndDate(dep_iata, arr_iata, flight_date);
  res.json(data);
}

// 5. Service: Call Aviation Stack API
// services/aviationservice.js
async function getFlightsByRouteAndDate(dep_iata, arr_iata, flight_date) {
  const response = await axios.get(AVIATION_BASEURL, {
    params: {
      access_key: Aviation_key,
      dep_iata: dep_iata,
      arr_iata: arr_iata,
    },
  });
  return response.data.data;  // Array of flight objects
}
```

**Aviation Stack API Request:**
```http
GET https://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&dep_iata=JFK&arr_iata=LAX
```

**Response Structure:**
```json
{
  "data": [
    {
      "flight_date": "2024-01-15",
      "flight_status": "scheduled",
      "departure": {
        "airport": "John F Kennedy International",
        "iata": "JFK",
        "scheduled": "2024-01-15T10:00:00+00:00",
        "timezone": "America/New_York"
      },
      "arrival": {
        "airport": "Los Angeles International",
        "iata": "LAX",
        "scheduled": "2024-01-15T13:30:00+00:00",
        "timezone": "America/Los_Angeles"
      },
      "airline": {
        "name": "American Airlines",
        "iata": "AA"
      },
      "flight": {
        "number": "1234",
        "iata": "AA1234"
      }
    }
  ]
}
```

### Workflow 2: Get Flight Details by IATA and Date

**Purpose**: Fetch specific flight details when user wants to join a flight

**Flow:**
```
1. User clicks "Join Flight" on a FlightCard
   ↓
2. Navigate to /flightjoin/:iata/:date
   ↓
3. FlightJoinpage component mounts
   ↓
4. useEffect calls get_joinflight(iata, date)
   ↓
5. GET /flights/flightjoin/:iata/:date
   ↓
6. Backend fetches all flights with matching IATA
   ↓
7. Filters by flight_date
   ↓
8. Returns filtered flight data
```

**Code Implementation:**

```javascript
// Frontend: FlightJoinpage.jsx
useEffect(() => {
  if (!iata || !date) return;
  get_joinflight(iata, date);
}, [iata, date]);

// Store: useflightstore.js
get_joinflight: async (iata, date) => {
  const response = await axiosInstance.get(`/flights/flightjoin/${iata}/${date}`);
  set({ join_flight: response.data });
}

// Backend: Controller
export async function fetchflightby_iata_and_Date(req, res) {
  const { iata, date } = req.params;
  const data = await getflightby_iata_and_Date(iata, date);
  
  // Filter by exact date match
  const filteredData = data.filter(
    (flight) => flight.flight_date === date && flight.flight.iata === iata
  );
  
  res.json(filteredData);
}

// Service: aviationiata.js
async function getflightby_iata_and_Date(flight_iata, flight_date) {
  const response = await axios.get(AVIATION_BASEURL, {
    params: {
      access_key: Aviation_key,
      flight_iata: flight_iata,  // e.g., "AA1234"
    },
  });
  return response.data.data;
}
```

---

## Helper and Help Seeker Storage

### Database Schema

The system uses **MongoDB** with two collections:
- **Helpers** - Stores helper requests
- **Helpseekers** - Stores help seeker requests

Both collections use the same base schema but are stored in separate collections for easier querying and filtering.

### Base Schema (CompanionRequest.model.js)

```javascript
{
  flight_date: Date,           // Required: Date of the flight
  flight_iata: String,         // Required: Flight IATA code (e.g., "AA1234")
  name: String,                // Required: Passenger name
  age: Number,                 // Required: Must be >= 18
  languages: [String],         // Required: Array of languages spoken
  phonenumber: String,         // Required: Contact phone
  email: String,              // Optional: Contact email
  country: String,            // Required: Country of origin
  seatNumber: String,         // Optional: Seat assignment
  description: String,        // Optional: Medical conditions or description
  passenger_role: String,     // Required: "helper" or "seeker"
  isPaidHelper: Boolean,      // Default: false
  helperPrice: Number,         // Optional: Price if paid helper
  emergencyPhone: String,     // Optional: Emergency contact
  timestamps: true            // Auto: createdAt, updatedAt
}
```

### Model Implementation

```javascript
// models/CompanionRequest.model.js
const companionRequestSchema = new mongoose.Schema(
  {
    flight_date: { type: Date, required: true },
    flight_iata: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    languages: { type: [String], required: true },
    phonenumber: { type: String, required: true },
    email: { type: String },
    country: { type: String, required: true },
    seatNumber: { type: String },
    description: { type: String },
    passenger_role: { 
      type: String, 
      required: true, 
      enum: ["helper", "seeker"] 
    },
    isPaidHelper: { type: Boolean, default: false },
    helperPrice: { type: Number },
    emergencyPhone: { type: String },
  },
  { timestamps: true }
);

// models/Helper.model.js
export const HelperRequest = mongoose.model(
  "HelperRequest",
  companionBaseSchema,
  "Helpers"  // Collection name in MongoDB
);

// models/Helpseekers.model.js
export const HelpSeekerRequest = mongoose.model(
  "HelpSeekerRequest",
  companionBaseSchema,
  "Helpseekers"  // Collection name in MongoDB
);
```

### Storage Workflow

**Creating a Companion Request:**

```
1. User fills "Join Flight" form (Helpfrom component)
   ↓
2. Submits with passenger_role: "helper" or "seeker"
   ↓
3. POST /companions
   ↓
4. Controller checks passenger_role
   ↓
5a. If "helper" → Save to HelperRequest (Helpers collection)
5b. If "seeker" → Save to HelpSeekerRequest (Helpseekers collection)
   ↓
6. Return saved document
```

**Code Implementation:**

```javascript
// Frontend: components/helpfrom.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    name: formData.name,
    age: Number(formData.age),
    languages: formData.languages.split(",").map(l => l.trim()),
    email: formData.email,
    country: formData.country,
    phonenumber: formData.phonenumber,
    seatNumber: formData.seatNumber,
    description: formData.description,
    passenger_role: formData.passenger_role,  // "helper" or "seeker"
    isPaidHelper: formData.isPaidHelper,
    helperPrice: formData.helperPrice,
    flight_iata: formData.flight_iata,
    flight_date: formData.flight_date,
    emergencyPhone: formData.emergencyPhone,
  };
  
  await joinFlightasCompanion(payload);
};

// Backend: controllers/companioncontroller.js
export const createCompanion = (req, res) => {
  const companion = req.body;
  
  if (companion.passenger_role == "helper") {
    const helper = new HelperRequest(companion);
    helper.save()
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({ error: err.message }));
  } 
  else if (companion.passenger_role == "seeker") {
    const helpseeker = new HelpSeekerRequest(companion);
    helpseeker.save()
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({ error: err.message }));
  }
};
```

**Example Document in MongoDB:**

```json
{
  "_id": ObjectId("..."),
  "flight_date": ISODate("2024-01-15T00:00:00.000Z"),
  "flight_iata": "AA1234",
  "name": "John Doe",
  "age": 35,
  "languages": ["English", "Spanish"],
  "phonenumber": "+1234567890",
  "email": "john@example.com",
  "country": "United States",
  "seatNumber": "12A",
  "description": "Mobility assistance needed",
  "passenger_role": "seeker",
  "emergencyPhone": "+1987654321",
  "createdAt": ISODate("2024-01-10T10:00:00.000Z"),
  "updatedAt": ISODate("2024-01-10T10:00:00.000Z")
}
```

---

## Matching System

### Matching Logic

Users are matched based on **two primary criteria**:
1. **Flight IATA Code** (`flight_iata`)
2. **Flight Date** (`flight_date`)

### Matching Workflow

```
1. User joins a flight as Helper or Seeker
   ↓
2. System stores request in appropriate collection
   ↓
3. User views flight details page (/flightjoin/:iata/:date)
   ↓
4. System fetches all companions for that flight
   ↓
5. Displays both Helpers and Seekers
   ↓
6. Users can filter by role (helper/seeker)
   ↓
7. Users contact each other via displayed information
```

### Matching Implementation

**Fetching Companions for a Flight:**

```javascript
// Backend: controllers/companioncontroller.js
export const getOtherCompanions = async (req, res) => {
  const { flight_iata, flight_date } = req.params;
  
  // Parallel queries to both collections
  const [helpers, seekers] = await Promise.all([
    HelperRequest.find({ flight_iata, flight_date }),
    HelpSeekerRequest.find({ flight_iata, flight_date }),
  ]);
  
  // Combine into single array
  const allCompanions = [...helpers, ...seekers];
  
  res.status(200).json(allCompanions);
};
```

**Frontend Display:**

```javascript
// Frontend: components/flightcompanioncard.jsx
const Flightcompanioncard = () => {
  const { OtherCompanions } = useFlightStore();
  const [filter_users, setFilter] = useState("all");
  
  // Filter companions by role
  const filteredCompanions = OtherCompanions?.filter((companion) => {
    if (filter_users === "all") return true;
    return companion.passenger_role === filter_users;
  }) || [];
  
  return (
    <div>
      {/* Filter buttons */}
      <button onClick={() => setFilter("helper")}>Helpers</button>
      <button onClick={() => setFilter("seeker")}>Help Seekers</button>
      
      {/* Display companions */}
      {filteredCompanions.map((companion) => (
        <CompanionCard key={companion._id} companion={companion} />
      ))}
    </div>
  );
};
```

### Matching Criteria Details

**Current Matching:**
- ✅ Same `flight_iata` (e.g., "AA1234")
- ✅ Same `flight_date` (e.g., "2024-01-15")
- ✅ Any role combination (Helper ↔ Seeker, Helper ↔ Helper, etc.)

**Displayed Information:**
- Name and age
- Languages spoken
- Contact information (phone, email)
- Seat number (if provided)
- Description/medical conditions
- Helper price (if paid helper)
- Emergency contact (for seekers)

**User Interaction:**
- Users see all matched companions
- Can filter by role (Helpers / Help Seekers)
- Contact information is visible for direct communication
- No automatic matching algorithm - users make connections manually

### Future Enhancement Opportunities

Potential improvements for matching:
1. **Language Matching**: Match users who speak common languages
2. **Seat Proximity**: Prioritize users in nearby seats
3. **Age Compatibility**: Match users of similar age groups
4. **Medical Expertise**: Match helpers with medical training to seekers with medical needs
5. **Price Filtering**: Filter paid helpers by price range
6. **Rating System**: Show helper ratings/reviews

---

## API Endpoints

### Flight Endpoints

#### 1. Search Flights by Route
```http
POST /flights
Content-Type: application/json

{
  "dep_iata": "JFK",
  "arr_iata": "LAX",
  "flight_date": "2024-01-15"
}
```

**Response:**
```json
[
  {
    "flight_date": "2024-01-15",
    "flight_status": "scheduled",
    "departure": { ... },
    "arrival": { ... },
    "airline": { ... },
    "flight": { ... }
  }
]
```

#### 2. Get Flight by IATA and Date
```http
GET /flights/flightjoin/:iata/:date

Example: GET /flights/flightjoin/AA1234/2024-01-15
```

**Response:**
```json
[
  {
    "flight_date": "2024-01-15",
    "flight": { "iata": "AA1234" },
    ...
  }
]
```

### Companion Endpoints

#### 3. Create Companion Request
```http
POST /companions
Content-Type: application/json

{
  "flight_iata": "AA1234",
  "flight_date": "2024-01-15",
  "name": "John Doe",
  "age": 35,
  "languages": ["English", "Spanish"],
  "phonenumber": "+1234567890",
  "email": "john@example.com",
  "country": "United States",
  "passenger_role": "seeker",
  "description": "Mobility assistance needed",
  "emergencyPhone": "+1987654321"
}
```

**Response:**
```json
{
  "_id": "...",
  "flight_iata": "AA1234",
  "flight_date": "2024-01-15",
  ...
}
```

#### 4. Get Companions for Flight
```http
GET /companions/:flight_iata/:flight_date

Example: GET /companions/AA1234/2024-01-15
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "John Doe",
    "passenger_role": "seeker",
    ...
  },
  {
    "_id": "...",
    "name": "Jane Smith",
    "passenger_role": "helper",
    "isPaidHelper": true,
    "helperPrice": 50,
    ...
  }
]
```

#### 5. Get User Bookings
```http
GET /companions/:UserMail

Example: GET /companions/john@example.com
```

**Response:**
```json
[
  {
    "_id": "...",
    "flight_iata": "AA1234",
    "flight_date": "2024-01-15",
    "passenger_role": "seeker",
    ...
  }
]
```

---

## Data Flow Diagrams

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY FLOW                         │
└─────────────────────────────────────────────────────────────┘

1. SEARCH FLIGHTS
   User → Frontend Form → POST /flights
   → Backend Controller → Aviation Service → Aviation Stack API
   → Response → Frontend Store → Display Flight Cards

2. SELECT FLIGHT
   User clicks "Join Flight" → Navigate to /flightjoin/:iata/:date
   → GET /flights/flightjoin/:iata/:date
   → Backend → Aviation Service → Filtered Flight Data
   → Display Flight Details

3. JOIN AS COMPANION
   User fills form → POST /companions
   → Backend checks passenger_role
   → Save to Helpers OR Helpseekers collection
   → Success Response

4. VIEW MATCHES
   Page loads → GET /companions/:flight_iata/:flight_date
   → Backend queries both collections in parallel
   → Returns combined array
   → Frontend displays with filters (Helper/Seeker)

5. CONTACT MATCH
   User views companion card → Sees contact info
   → Direct communication (outside app)
```

### Database Query Flow

```
┌─────────────────────────────────────────────────────────────┐
│              DATABASE QUERY FLOW                              │
└─────────────────────────────────────────────────────────────┘

GET /companions/:flight_iata/:flight_date

┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Controller: getOtherCompanions  │
└──────┬──────────────────────────┘
       │
       ├─────────────────┬─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Promise.all │  │  Helper     │  │  HelpSeeker  │
│   (parallel)│  │  Collection  │  │  Collection  │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                 │                 │
       │  find({         │                 │
       │    flight_iata, │                 │
       │    flight_date  │                 │
       │  })             │                 │
       │                 │                 │
       ├─────────────────┴─────────────────┤
       │                                   │
       ▼                                   ▼
┌─────────────────────────────────────────────┐
│      Combine: [...helpers, ...seekers]      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌──────────────────────────┐
│    JSON Response Array   │
└──────────────────────────┘
```

---

## Key Configuration

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb://localhost:27017/gobuddy
AVIATIONSTACK_APIKEY=your_api_key_here
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Aviation Stack API Setup

1. **Get API Key:**
   - Sign up at https://aviationstack.com/
   - Free tier: 1,000 requests/month
   - Paid plans available for higher limits

2. **API Endpoints Used:**
   - `GET https://api.aviationstack.com/v1/flights`
   - Parameters: `access_key`, `dep_iata`, `arr_iata`, `flight_iata`

3. **Rate Limits:**
   - Free: 1,000 requests/month
   - Professional: 10,000 requests/month
   - Business: 100,000+ requests/month

---

## Error Handling

### Common Error Scenarios

1. **No Flights Found:**
   ```javascript
   if (!response.data.data || !response.data.data.length) {
     console.error("No flight data found");
     return [];
   }
   ```

2. **Invalid Flight IATA:**
   ```javascript
   if (!iata || iata === "undefined" || iata === "null") {
     return res.status(400).json({ error: "flight_iata is required" });
   }
   ```

3. **Database Connection Error:**
   ```javascript
   connectDB()
     .then(() => app.listen(PORT))
     .catch((err) => {
       console.error("Database connection failed", err);
       process.exit(1);
     });
   ```

4. **API Key Missing:**
   ```javascript
   if (!process.env.AVIATIONSTACK_APIKEY) {
     throw new Error("AVIATIONSTACK_APIKEY is not defined");
   }
   ```

---

## Summary

### Flight Fetching
- Uses **Aviation Stack API** via **Axios** for real-time flight data
- Two main workflows: search by route and get by IATA+date
- Data is filtered and formatted before returning to frontend

### Storage
- **MongoDB** with two collections: `Helpers` and `Helpseekers`
- Same schema, different collections for role-based querying
- Stores flight IATA, date, passenger info, and role

### Matching
- Matches users by **flight_iata** and **flight_date**
- Displays both Helpers and Seekers on flight detail page
- Users filter by role and contact each other directly
- No automatic algorithm - manual connections

### Libraries
- **Axios**: HTTP client for API calls
- **Mongoose**: MongoDB ODM
- **Zustand**: Frontend state management
- **React Hook Form**: Form handling
- **Aviation Stack**: External flight data API

---

## Future Enhancements

1. **Smart Matching Algorithm**
   - Language compatibility scoring
   - Seat proximity matching
   - Age and preference matching

2. **In-App Messaging**
   - Real-time chat between matched users
   - Notification system

3. **Rating System**
   - Helper ratings and reviews
   - Trust score for users

4. **Advanced Filters**
   - Price range filtering
   - Medical expertise matching
   - Language preference matching

5. **Caching**
   - Cache flight data to reduce API calls
   - Redis for frequently accessed flights

---

*Last Updated: January 2024*


