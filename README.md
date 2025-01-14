# Weather App

A modern weather application built with Next.js and FastAPI that provides real-time weather information and forecasts with AI-powered weather analysis.

## Features

- Real-time weather data from OpenWeatherMap API
- Current weather conditions and forecasts
- AI-powered weather analysis and suggestions using Groq
- City search functionality
- Responsive design with dark mode support
- Live clock and date display
- Weather data export to Excel
- CRUD operations for saving weather data

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Environment Variables

### Backend
- FastAPI
- Python 3
- MongoDB
- Groq for AI analysis
- python-dotenv for environment management

## Prerequisites

- Node.js (Latest LTS version recommended)
- Python 3.8 or higher
- MongoDB installed and running
- OpenWeatherMap API key
- Groq API key

## API Keys Setup

### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API Keys" section in your account
4. Copy your API key

### Groq API Key
1. Visit [Groq Cloud](https://console.groq.com)
2. Create an account and sign in
3. Navigate to API Keys section
4. Generate a new API key

## Installation

### Backend Setup

1. Clone the repository and navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
```

3. Install the required packages:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:

```bash
weatherAPI=your_openweathermap_api_key
groqAPI=your_groq_api_key
MongoDB_URI=mongodb://localhost:27017
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install the required packages:

```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database Setup

1. Install MongoDB if not already installed
2. Start MongoDB service:

```bash
# Linux/Mac
sudo service mongod start

# Windows
net start MongoDB
```

3. The application will automatically create required collections

## Running the Application

### Start the Backend Server

```bash
cd backend
uvicorn app:app --reload
```

The backend server will start at `http://localhost:8000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

### Frontend
- `/src/app`: Main application pages
- `/src/components`: Reusable React components
- `/src/types`: TypeScript type definitions
- `/public`: Static assets

### Backend
- `/api`: API route handlers
- `/services`: Business logic and external service integrations
- `/core`: Core configuration and settings

## API Endpoints

### Weather Endpoints
- `GET /api/weather`: Get weather data for specific coordinates
  - Parameters: `lat` (float), `lon` (float)
  - Returns current weather and forecasts

### Location Endpoints
- `GET /api/location`: Get coordinates for a city
  - Parameters: 
    - `city` (string, required)
    - `country_code` (string, optional)
    - `state_code` (string, optional)
    - `limit` (int, optional, default=1)

### Icon Endpoints
- `GET /api/icon`: Get weather icon
  - Parameters:
    - `icon_code` (string)
    - `size` (string, optional, default="2x")


## Database Setup

1. Install MongoDB if not already installed
2. Start MongoDB service:

```bash
# Linux/Mac
sudo service mongod start

# Windows
net start MongoDB
```

3. The application will automatically create required collections

## Running the Application

### Start the Backend Server

```bash
cd backend
uvicorn app:app --reload
```

The backend server will start at `http://localhost:8000`

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000`