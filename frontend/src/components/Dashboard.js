import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [currentWeather, setCurrentWeather] = useState(null);
  const [savedWeather, setSavedWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [editedWeatherData, setEditedWeatherData] = useState(null);

  useEffect(() => {
    console.log('Current user:', user);
    fetchSavedWeather();
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const locationRes = await axios.get(`http://localhost:8000/location?city=${searchQuery}`);
      if (locationRes.data.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon, name } = locationRes.data[0];
      const weatherRes = await axios.get(
        `http://localhost:8000/weather/range?lat=${lat}&lon=${lon}&start_date=${dateRange.start}&end_date=${dateRange.end}`
      );

      setCurrentWeather({
        ...weatherRes.data,
        name: name,
        lat: lat,
        lon: lon
      });
    } catch (err) {
      setError(err.message || 'Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedWeather = async () => {
    try {
      const response = await axios.get('http://localhost:8000/crud/read');
      setSavedWeather(response.data);
    } catch (err) {
      setError('Error fetching saved weather data');
    }
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    const username = localStorage.getItem('username');
    
    if (!currentWeather || !username) {
      console.log('Missing data:', { 
        currentWeather: !!currentWeather, 
        username: username
      });
      setError('Please login to save weather data');
      return;
    }

    try {
      // Filter only date entries
      const dateEntries = Object.entries(currentWeather).filter(([key]) => 
        key.match(/^\d{4}-\d{2}-\d{2}$/)
      );
      
      // Convert weather_data array to dictionary with dates as keys
      const weatherDataDict = dateEntries.reduce((acc, [date, dayData]) => {
        acc[date] = dayData.data[0];
        return acc;
      }, {});

      // Format data for API
      const requestData = {
        username: username,
        location: {
          name: searchQuery,
          lat: currentWeather.lat,
          lon: currentWeather.lon
        },
        date_range: dateRange,
        weather_data: weatherDataDict  // Now it's a dictionary instead of an array
      };
      
      console.log('Sending request data:', requestData);
      
      const response = await axios.post('http://localhost:8000/crud/create', requestData);
      console.log('Save response:', response);
      
      await fetchSavedWeather();
      setError(null);
    } catch (err) {
      console.error('Save error:', err);
      setError('Error saving forecast: ' + err.message);
    }
  };

  const handleUpdate = (weather) => {
    setSelectedWeather(weather);
    setEditedWeatherData({...weather.weather_data});
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/crud/update`, {
        request_id: selectedWeather._id,
        updates: {
          weather_data: editedWeatherData
        }
      });
      await fetchSavedWeather();
      setIsUpdateModalOpen(false);
      setSelectedWeather(null);
      setEditedWeatherData(null);
      setError(null);
    } catch (err) {
      setError('Error updating weather data: ' + err.message);
    }
  };

  const handleDelete = async (requestId) => {
    try {
        console.log(`Deleting requestId: ${requestId}`);
        await axios.delete(`http://localhost:8000/crud/delete`, {
            params: { request_id: requestId }
        });
        await fetchSavedWeather();
        setError(null);
    } catch (err) {
        setError('Error deleting weather data: ' + err.message);
    }
};


const exportToExcel = () => {
    try {
      // Prepare data for Excel: Flatten the savedWeather data
      const formattedData = savedWeather.flatMap((weather) => {
        return Object.entries(weather.weather_data).map(([date, dayData]) => ({
          City: weather.location.name,
          StartDate: weather.date_range.start,
          EndDate: weather.date_range.end,
          Date: date,
          Temperature: (dayData.temp - 273.15).toFixed(1) + '°C',
          Weather: dayData.weather?.[0]?.description || 'N/A',
          Humidity: dayData.humidity + '%',
          WindSpeed: dayData.wind_speed + ' m/s',
          AddedBy: weather.username,
        }));
      });
  
      // Convert the formatted data to a worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData);
  
      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Weather Data");
  
      // Write the workbook and trigger download
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, 'weather_data.xlsx');
  
      console.log("Export successful!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError('Failed to export data.');
    }
  };
  

  const formatTemperature = (weatherData) => {
    try {
      if (weatherData?.current?.temp) {
        return `${(weatherData.current.temp - 273.15).toFixed(1)}°C`;
      }
      return 'N/A';
    } catch (err) {
      return 'N/A';
    }
  };

  const getWeatherDescription = (weatherData) => {
    try {
      return weatherData?.current?.weather?.[0]?.description || 'N/A';
    } catch (err) {
      return 'N/A';
    }
  };

  const getHumidity = (weatherData) => {
    try {
      return weatherData?.current?.humidity ? `${weatherData.current.humidity}%` : 'N/A';
    } catch (err) {
      return 'N/A';
    }
  };

  const getWindSpeed = (weatherData) => {
    try {
      return weatherData?.current?.wind_speed ? `${weatherData.current.wind_speed} m/s` : 'N/A';
    } catch (err) {
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Weather Dashboard</h2>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter city name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Current Weather Section */}
      {currentWeather && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Weather Forecast</h3>
            <button
              type="button"
              onClick={handleSave}
              disabled={!currentWeather || loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : 'Save Forecast'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Temperature</th>
                  <th className="px-4 py-2">Weather</th>
                  <th className="px-4 py-2">Humidity</th>
                  <th className="px-4 py-2">Wind Speed</th>
                  <th className="px-4 py-2">Pressure</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentWeather).map(([date, dayData]) => (
                  dayData?.data?.[0] && (
                    <tr key={date} className="border-b">
                      <td className="px-4 py-2">{date}</td>
                      <td className="px-4 py-2">{(dayData.data[0].temp - 273.15).toFixed(1)}°C</td>
                      <td className="px-4 py-2">{dayData.data[0].weather?.[0]?.description || 'N/A'}</td>
                      <td className="px-4 py-2">{dayData.data[0].humidity || 'N/A'}%</td>
                      <td className="px-4 py-2">{dayData.data[0].wind_speed || 'N/A'} m/s</td>
                      <td className="px-4 py-2">{dayData.data[0].pressure || 'N/A'} hPa</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Saved Weather Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Saved Forecasts</h3>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={!savedWeather?.length}
          >
            Export to Excel
          </button>
        </div>
        {savedWeather.map((weather) => (
          <div key={weather._id} className="mb-8 border-b pb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-medium">
                  {weather.location.name} - {new Date(weather.date_range.start).toLocaleDateString()} to {new Date(weather.date_range.end).toLocaleDateString()}
                </h4>
                <p className="text-sm text-gray-600">Added by: {weather.username}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdate(weather)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(weather._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Temperature</th>
                    <th className="px-4 py-2">Weather</th>
                    <th className="px-4 py-2">Humidity</th>
                    <th className="px-4 py-2">Wind Speed</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(weather.weather_data).map(([date, day]) => (
                    <tr key={date} className="border-b">
                      <td className="px-4 py-2">{date}</td>
                      <td className="px-4 py-2">{(day.temp - 273.15).toFixed(1)}°C</td>
                      <td className="px-4 py-2">{day.weather[0].description}</td>
                      <td className="px-4 py-2">{day.humidity}%</td>
                      <td className="px-4 py-2">{day.wind_speed} m/s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {(!savedWeather || savedWeather.length === 0) && (
          <div className="text-center text-gray-500 py-4">
            No saved forecasts available
          </div>
        )}
      </div>

      {isUpdateModalOpen && selectedWeather && editedWeatherData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Update Weather Data for {selectedWeather.location.name}
              </h3>
              <button
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedWeather(null);
                  setEditedWeatherData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Temperature (°C)</th>
                    <th className="px-4 py-2">Weather</th>
                    <th className="px-4 py-2">Humidity (%)</th>
                    <th className="px-4 py-2">Wind Speed (m/s)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(editedWeatherData).map(([date, day]) => (
                    <tr key={date} className="border-b">
                      <td className="px-4 py-2">{date}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={(day.temp - 273.15).toFixed(1)}
                          onChange={(e) => {
                            const newTemp = parseFloat(e.target.value) + 273.15;
                            setEditedWeatherData(prev => ({
                              ...prev,
                              [date]: {
                                ...prev[date],
                                temp: newTemp
                              }
                            }));
                          }}
                          className="w-24 p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={day.weather[0].description}
                          onChange={(e) => {
                            setEditedWeatherData(prev => ({
                              ...prev,
                              [date]: {
                                ...prev[date],
                                weather: [{
                                  ...prev[date].weather[0],
                                  description: e.target.value
                                }]
                              }
                            }));
                          }}
                          className="w-32 p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={day.humidity}
                          onChange={(e) => {
                            setEditedWeatherData(prev => ({
                              ...prev,
                              [date]: {
                                ...prev[date],
                                humidity: parseInt(e.target.value)
                              }
                            }));
                          }}
                          className="w-24 p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={day.wind_speed}
                          onChange={(e) => {
                            setEditedWeatherData(prev => ({
                              ...prev,
                              [date]: {
                                ...prev[date],
                                wind_speed: parseFloat(e.target.value)
                              }
                            }));
                          }}
                          className="w-24 p-1 border rounded"
                          step="0.1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedWeather(null);
                  setEditedWeatherData(null);
                }}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export default Dashboard; 