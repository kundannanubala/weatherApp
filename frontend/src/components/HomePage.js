import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Get coordinates
      const locationRes = await axios.get(`http://localhost:8000/location?city=${city}`);
      if (locationRes.data.length === 0) {
        throw new Error('Location not found');
      }
      const { lat, lon } = locationRes.data[0];

      // Get weather data
      const weatherRes = await axios.get(`http://localhost:8000/weather/current?lat=${lat}&lon=${lon}`);
      setWeatherData(weatherRes.data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Weather Search</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Get Weather
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-2">Weather in {city}</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(weatherData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage; 