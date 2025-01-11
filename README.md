# Weather App

A modern weather application built with Next.js and FastAPI that provides real-time weather information and forecasts.

## Features

- Real-time weather data from OpenWeatherMap API
- Current weather conditions
- Hourly forecast (24 hours)
- City search functionality
- Responsive design with dark mode support
- Live clock and date display

## Tech Stack

### Frontend
- Next.js 15.1
- React 19
- TypeScript
- Tailwind CSS
- Environment Variables

### Backend
- FastAPI
- Python 3
- httpx for async HTTP requests
- python-dotenv for environment management

## Prerequisites

- Node.js (Latest LTS version recommended)
- Python 3.8 or higher
- OpenWeatherMap API key

## Installation

### Backend Setup

1. Navigate to the backend directory:

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

## Environment Variables

### Backend (.env)
