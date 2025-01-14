import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherReport, setWeatherReport] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    // Will run on initial mount because loading is true
    if (loading) {
      getCurrentLocationWeather();
    }
  }, [loading]);

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setWeatherLoading(true);
          try {
            const { latitude: lat, longitude: lon } = position.coords;
            const locationRes = await axios.get(`http://localhost:8000/location?lat=${lat}&lon=${lon}`);
            
            if (locationRes.data.length > 0) {
              setCityName(locationRes.data[0].name);
              const weatherRes = await axios.get(`http://localhost:8000/weather/current?lat=${lat}&lon=${lon}`);
              setWeatherData(weatherRes.data);

              // Start report generation independently
              getWeatherReport(weatherRes.data);
            }
          } catch (err) {
            setError('Error fetching weather data');
            setWeatherData(null);
          } finally {
            setWeatherLoading(false);
            setLoading(false);
          }
        },
        (err) => {
          setError('Unable to get location. Please enable location services.');
          setWeatherLoading(false);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setWeatherLoading(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setWeatherLoading(true);
    setLoading(false);
    
    try {
      const locationRes = await axios.get(`http://localhost:8000/location?city=${searchQuery}`);
      if (locationRes.data.length === 0) {
        throw new Error('Location not found');
      }
      
      const { lat, lon, name } = locationRes.data[0];
      setCityName(name);
      
      const weatherRes = await axios.get(`http://localhost:8000/weather/current?lat=${lat}&lon=${lon}`);
      setWeatherData(weatherRes.data);

      getWeatherReport(weatherRes.data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherReport = async (weatherData) => {
    setReportLoading(true);
    try {
      // Get report and suggestions independently
      const reportPromise = axios.post('http://localhost:8000/llm', {
        data: weatherData
      });
      
      const reportResponse = await reportPromise;
      setWeatherReport(reportResponse.data);
      
      // Get suggestions once report is ready
      const suggestionsResponse = await axios.post('http://localhost:8000/llm/suggestions', {
        text: reportResponse.data
      });
      setSuggestions(suggestionsResponse.data);
    } catch (err) {
      console.error('Error getting weather analysis:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Weather Report */}
      <div className="fixed left-0 top-0 w-80 h-screen bg-white shadow-lg p-6 overflow-y-auto">
        <h4 className="text-xl font-semibold mb-4 text-gray-800 sticky top-0 bg-white pb-2">
          Weather Analysis
        </h4>
        <div className="text-xs text-gray-500 italic mb-4 sticky top-12 bg-white pb-2">
          This is an AI-generated report. There can be mistakes.
        </div>
        {reportLoading ? (
          <div className="text-center text-gray-600">Generating report...</div>
        ) : weatherReport ? (
          <div className="prose max-w-none">
            {weatherReport.split('\n').map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="flex-1 mx-80 mt-10 p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Weather Forecast</h2>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4 justify-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter city name"
                required
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                disabled={weatherLoading}
              >
                {weatherLoading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {weatherLoading ? (
            <div className="text-center text-gray-600">
              Loading weather data...
            </div>
          ) : weatherData && (
            <div className="space-y-8">
              {/* Current Weather */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{cityName}</h3>
                    <p className="text-gray-600">{formatDate(weatherData.current.dt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-800">
                      {kelvinToCelsius(weatherData.current.temp)}°C
                    </p>
                    <p className="text-gray-600 capitalize">
                      {weatherData.current.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherData.daily.slice(0, 5).map((day) => (
                  <div key={day.dt} className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <p className="font-semibold text-gray-800">{formatDate(day.dt)}</p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                      className="mx-auto w-16 h-16"
                    />
                    <div className="mt-2">
                      <p className="text-lg font-bold text-gray-800">
                        {kelvinToCelsius(day.temp.max)}°C
                      </p>
                      <p className="text-sm text-gray-600">
                        {kelvinToCelsius(day.temp.min)}°C
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 capitalize">
                      {day.weather[0].description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Additional Weather Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Additional Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600">Humidity</p>
                    <p className="text-lg font-semibold">{weatherData.current.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Wind Speed</p>
                    <p className="text-lg font-semibold">{weatherData.current.wind_speed} m/s</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pressure</p>
                    <p className="text-lg font-semibold">{weatherData.current.pressure} hPa</p>
                  </div>
                  <div>
                    <p className="text-gray-600">UV Index</p>
                    <p className="text-lg font-semibold">{weatherData.current.uvi}</p>
                  </div>
                </div>
              </div>

              {/* Weather Report and Suggestions */}
              {weatherReport && suggestions && (
                <div className="space-y-8 mt-8">
                  {/* Weather Report */}
                  {/* <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">Weather Analysis</h4>
                    <div className="prose max-w-none">
                      {weatherReport.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div> */}

                  {/* Weather Suggestions */}
                  {/* <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">Suggestions</h4>
                    <div className="prose max-w-none">
                      {suggestions.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div> */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Suggestions */}
      <div className="fixed right-0 top-0 w-80 h-screen bg-white shadow-lg p-6 overflow-y-auto">
        <h4 className="text-xl font-semibold mb-4 text-gray-800 sticky top-0 bg-white pb-2">
          Suggestions
        </h4>
        <div className="text-xs text-gray-500 italic mb-4 sticky top-12 bg-white pb-2">
          This is an AI-generated suggestion. There can be mistakes.
        </div>
        {reportLoading ? (
          <div className="text-center text-gray-600">Generating suggestions...</div>
        ) : suggestions ? (
          <div className="prose max-w-none">
            {suggestions.split('\n').map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HomePage; 