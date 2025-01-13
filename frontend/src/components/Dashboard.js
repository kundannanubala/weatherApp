import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { username } = useAuth();
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [weatherRequests, setWeatherRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeatherRequests();
  }, []);

  const fetchWeatherRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/crud/read');
      setWeatherRequests(response.data);
    } catch (err) {
      console.error('Error fetching weather requests:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get coordinates
      const locationRes = await axios.get(`http://localhost:8000/location?city=${city}`);
      if (locationRes.data.length === 0) {
        throw new Error('Location not found');
      }
      const { lat, lon } = locationRes.data[0];

      // Get weather data
      const weatherRes = await axios.get(
        `http://localhost:8000/weather/range?lat=${lat}&lon=${lon}&start_date=${startDate}&end_date=${endDate}`
      );
      setWeatherData(weatherRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeather = async () => {
    try {
      await axios.post('http://localhost:8000/crud/create', {
        username,
        location: { city, lat: weatherData.lat, lon: weatherData.lon },
        date_range: { start_date: startDate, end_date: endDate },
        weather_data: weatherData
      });
      fetchWeatherRequests();
      alert('Weather data saved successfully!');
    } catch (err) {
      setError('Error saving weather request');
      console.error('Error saving weather request:', err);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this weather request?')) {
      try {
        await axios.delete(`http://localhost:8000/crud/delete/${requestId}`, {
          data: { username }
        });
        fetchWeatherRequests();
      } catch (err) {
        console.error('Error deleting request:', err);
      }
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      {/* Search Form */}
      <div className="max-w-md mx-auto mb-8">
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
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Weather'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="mt-4">
            <div className="p-4 bg-white rounded shadow">
              <h3 className="text-xl font-bold mb-2">Weather in {city}</h3>
              <p className="mb-2">Period: {startDate} to {endDate}</p>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(weatherData, null, 2)}
              </pre>
            </div>
            <button
              onClick={handleSaveWeather}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Save This Weather Data
            </button>
          </div>
        )}
      </div>

      {/* Weather Request History */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Weather Request History</h2>
        <div className="space-y-4">
          {weatherRequests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{request.location.city}</h3>
                  <p className="text-sm text-gray-600">
                    {request.date_range.start_date} to {request.date_range.end_date}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(request._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="mt-2">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(request.weather_data, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 