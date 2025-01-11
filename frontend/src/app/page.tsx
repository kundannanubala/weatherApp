'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CurrentWeather from '@/components/CurrentWeather';
import HourlyForecast from '@/components/HourlyForecast';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      // Get coordinates
      const locationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/location?city=${city}`
      );
      const locationData = await locationResponse.json();

      if (locationData.length > 0) {
        // Get weather data
        const weatherResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/weather?lat=${locationData[0].lat}&lon=${locationData[0].lon}`
        );
        const weatherData = await weatherResponse.json();
        setWeatherData(weatherData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 p-2 border rounded dark:bg-gray-800"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {weatherData && (
        <>
          <Header location={city} />
          <CurrentWeather data={weatherData.current} />
          <HourlyForecast data={weatherData.hourly} />
        </>
      )}
    </main>
  );
}
