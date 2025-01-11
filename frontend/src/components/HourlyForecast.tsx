export default function HourlyForecast({ data }: { data: WeatherData['hourly'] }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">Hourly Forecast</h3>
      <div className="flex gap-4 pb-4">
        {data.slice(0, 24).map((hour) => (
          <div
            key={hour.dt}
            className="flex-shrink-0 w-24 bg-white dark:bg-gray-800 rounded-lg p-4 text-center"
          >
            <p className="text-sm">
              {new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                hour: 'numeric',
              })}
            </p>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/icon?icon_code=${hour.weather[0].icon}`}
              alt={hour.weather[0].description}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-lg font-bold">{Math.round(hour.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
} 