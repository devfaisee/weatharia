'use client';
import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = 'e7fc3b54c08ce779fe20813b1d1c313e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

const Weather: React.FC = () => {
  const [city, setCity] = useState('');
  interface Suggestion {
    name: string;
    country: string;
  }
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  interface WeatherData {
    name: string;
    weather: { description: string }[];
    main: { temp: number };
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Function to fetch weather data
  const fetchWeather = async (cityName: string) => {
    try {
      const response = await axios.get(`${BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`);
      if (response.status === 200) {
        setWeather(response.data);
      } else {
        console.error('Error fetching weather data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Function to fetch suggestions for city names
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${GEO_URL}?q=${query}&limit=5&appid=${API_KEY}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle input change for city name
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCity(query);
    await fetchSuggestions(query);
  };

  // Handle selection of a suggestion
  const handleSelectSuggestion = (suggestion: any) => {
    const cityName = suggestion.name;
    setCity(cityName);
    fetchWeather(cityName);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-blue-800 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Weatharia</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={handleInputChange}
        className="p-3 border rounded w-full max-w-md mb-4 text-black"
      />
      {suggestions.length > 0 && (
        <ul className="w-full max-w-md border rounded bg-white text-black">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => fetchWeather(city)}
        className="mt-4 p-3 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition duration-300"
      >
        Get Weather
      </button>
      {weather && (
        <div className="mt-6 p-6 bg-white text-black rounded shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-lg">{weather.weather[0].description}</p>
          <p className="text-lg">{weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
