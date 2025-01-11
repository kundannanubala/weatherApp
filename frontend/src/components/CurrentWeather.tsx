export default function CurrentWeather({ data }: { data: WeatherData['current'] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold">{Math.round(data.temp)}°C</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Feels like {Math.round(data.feels_like)}°C
          </p>
          <p className="text-lg mt-2">{data.weather[0].description}</p>
        </div>
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/icon?icon_code=${data.weather[0].icon}`}
          alt={data.weather[0].description}
          className="w-24 h-24"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Humidity</p>
          <p className="text-xl">{data.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Wind Speed</p>
          <p className="text-xl">{data.wind_speed} m/s</p>
        </div>
      </div>
    </div>
  );
} 