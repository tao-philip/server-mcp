import { ApiEndpoint } from '../types/api.js';

export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
  openweather: {
    name: 'OpenWeatherMap',
    description: 'Weather data from OpenWeatherMap API',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    requiresAuth: true,
    authType: 'apiKey',
    authHeader: 'appid',
    defaultParams: {
      units: 'metric'
    }
  },
  weatherapi: {
    name: 'WeatherAPI',
    description: 'Weather data from WeatherAPI.com',
    baseUrl: 'https://api.weatherapi.com/v1',
    requiresAuth: true,
    authType: 'apiKey',
    authHeader: 'key'
  },
  httpbin: {
    name: 'HTTPBin',
    description: 'Public HTTP testing service',
    baseUrl: 'https://httpbin.org',
    requiresAuth: false
  },
  jsonplaceholder: {
    name: 'JSONPlaceholder',
    description: 'Fake REST API for testing',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    requiresAuth: false
  }
};