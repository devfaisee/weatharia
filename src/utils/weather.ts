import axios from 'axios';

const API_KEY = 'e7fc3b54c08ce779fe20813b1d1c313e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (city: string) => {
  const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
  return response.data;
};