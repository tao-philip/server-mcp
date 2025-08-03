import { ApiService } from './ApiService.js';
import { WeatherData, ApiResponse } from '../types/api.js';

export class WeatherService {
  constructor(private apiService: ApiService) {}

  public async getCurrentWeather(location: string, provider: string = 'openweather'): Promise<ApiResponse> {
    try {
      let request;
      
      switch (provider) {
        case 'openweather':
          request = {
            endpoint: 'openweather',
            path: '/weather',
            params: { q: location }
          };
          break;
          
        case 'weatherapi':
          request = {
            endpoint: 'weatherapi',
            path: '/current.json',
            params: { q: location }
          };
          break;
          
        default:
          return {
            success: false,
            error: `Unsupported weather provider: ${provider}`
          };
      }

      const response = await this.apiService.makeRequest(request);
      
      if (!response.success) {
        return response;
      }

      // Transform response to standardized format
      const weatherData = this.transformWeatherData(response.data, provider);
      
      return {
        success: true,
        data: weatherData
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch weather data'
      };
    }
  }

  public async getForecast(location: string, days: number = 5, provider: string = 'openweather'): Promise<ApiResponse> {
    try {
      let request;
      
      switch (provider) {
        case 'openweather':
          request = {
            endpoint: 'openweather',
            path: '/forecast',
            params: { q: location, cnt: days * 8 } // 8 forecasts per day (3-hour intervals)
          };
          break;
          
        case 'weatherapi':
          request = {
            endpoint: 'weatherapi',
            path: '/forecast.json',
            params: { q: location, days: days }
          };
          break;
          
        default:
          return {
            success: false,
            error: `Unsupported weather provider: ${provider}`
          };
      }

      const response = await this.apiService.makeRequest(request);
      
      if (!response.success) {
        return response;
      }

      return {
        success: true,
        data: response.data
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch weather forecast'
      };
    }
  }

  private transformWeatherData(data: any, provider: string): WeatherData {
    switch (provider) {
      case 'openweather':
        return {
          location: data.name,
          temperature: data.main.temp,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          timestamp: new Date().toISOString()
        };
        
      case 'weatherapi':
        return {
          location: data.location.name,
          temperature: data.current.temp_c,
          description: data.current.condition.text,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          timestamp: new Date().toISOString()
        };
        
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}