import { useState } from 'react';
import './App.css';

// Font Awesome CDN for icons
const fontAwesomeLink = (
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    crossOrigin="anonymous"
  />
);

const API_KEY = 'd6e1a3bf4b9c9e2f16da71ed3b5d6398';

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <i className="fas fa-sun weather-icon" style={{ color: '#FFD93D' }}></i>;
      case 'Clouds':
        return <i className="fas fa-cloud weather-icon" style={{ color: '#A3C4F3' }}></i>;
      case 'Rain':
        return <i className="fas fa-cloud-showers-heavy weather-icon" style={{ color: '#4D96FF' }}></i>;
      case 'Drizzle':
        return <i className="fas fa-cloud-rain weather-icon" style={{ color: '#38A3A5' }}></i>;
      case 'Thunderstorm':
        return <i className="fas fa-bolt weather-icon" style={{ color: '#F7B801' }}></i>;
      case 'Snow':
        return <i className="fas fa-snowflake weather-icon" style={{ color: '#B6E0FE' }}></i>;
      case 'Mist':
      case 'Fog':
        return <i className="fas fa-smog weather-icon" style={{ color: '#B0B0B0' }}></i>;
      default:
        return <i className="fas fa-question weather-icon" style={{ color: '#888' }}></i>;
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
    setError('');
    setShake(false);
  };

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please Enter Correct City Name');
      setShake(true);
      setWeather(null);
      return;
    }
    setLoading(true);
    setError('');
    setShake(false);
    setWeather(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError('Please Enter Correct City Name');
        setShake(true);
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Network Error. Please try again.');
      setShake(true);
      setWeather(null);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="weather-app-bg">
      {fontAwesomeLink}
      <div className="weather-container">
        <h1 className="app-title">Weather Checker</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={shake ? 'shake' : ''}
            aria-label="City name"
          />
          <button onClick={handleSearch} className="search-btn" aria-label="Search">
            <i className="fas fa-search"></i>
          </button>
        </div>
        {error && (
          <div className={`error-message${shake ? ' shake' : ''}`}>{error}</div>
        )}
        {loading && <div className="loading">Loading...</div>}
        {weather && (
          <div className="weather-info">
            <h2 className="city-name">{capitalize(weather.name)}</h2>
            <div className="main-weather">
              {getWeatherIcon(weather.weather[0].main)}
              <span className="condition">{capitalize(weather.weather[0].description)}</span>
            </div>
            <div className="temperature">
              <i className="fas fa-thermometer-half temp-icon"></i>
              <span>{Math.round(weather.main.temp)}&deg;C</span>
            </div>
            <div className="details">
              <div className="detail-item">
                <i className="fas fa-wind detail-icon"></i>
                <span>{weather.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-tint detail-icon"></i>
                <span>{weather.main.humidity}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
