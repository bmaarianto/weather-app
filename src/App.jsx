import React, { useState } from 'react';

const API_KEY = '53a85e296d5421f57ecb8ef7c8d0bba7';

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) {
        throw new Error('City not found');
      }
      const data = await res.json();
      setWeather({
        city: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className='container'>
      <h1 className='heading'>React Weather App</h1>
      <input
        className='input'
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="City name"
      />
      <button className='button' onClick={fetchWeather} disabled={loading}>
        {loading ? 'Loading...' : 'Check Weather'}
      </button>
      {weather && (
        <div className='weather-info'>
          <div className='city'>{weather.city}</div>
          <img
            src={weather.icon}
            alt={weather.description}
            className='icon'
          />
          <div className='temp'>{weather.temp}°C</div>
          <div className='description'>{weather.description}</div>
        </div>
      )}
      {error && <div className='error'>{error}</div>}
    </div>
  );
}