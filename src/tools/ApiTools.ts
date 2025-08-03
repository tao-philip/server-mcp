import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ApiService } from '../services/ApiService.js';
import { WeatherService } from '../services/WeatherService.js';

export class ApiTools {
  private apiService: ApiService;
  private weatherService: WeatherService;

  constructor() {
    this.apiService = new ApiService();
    this.weatherService = new WeatherService(this.apiService);
  }

  public getTools(): Tool[] {
    return [
      {
        name: 'make_api_request',
        description: 'Make a request to any configured API endpoint',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'The API endpoint key (e.g., openweather, weatherapi, httpbin)',
              enum: Object.keys(this.apiService.getAvailableEndpoints())
            },
            path: {
              type: 'string',
              description: 'The API path (e.g., /weather, /current.json)'
            },
            method: {
              type: 'string',
              description: 'HTTP method',
              enum: ['GET', 'POST', 'PUT', 'DELETE'],
              default: 'GET'
            },
            params: {
              type: 'object',
              description: 'Query parameters',
              additionalProperties: true
            },
            headers: {
              type: 'object',
              description: 'Additional headers',
              additionalProperties: { type: 'string' }
            },
            body: {
              type: 'object',
              description: 'Request body for POST/PUT requests',
              additionalProperties: true
            }
          },
          required: ['endpoint', 'path']
        }
      },
      {
        name: 'get_current_weather',
        description: 'Get current weather for a location',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name, coordinates, or location query'
            },
            provider: {
              type: 'string',
              description: 'Weather data provider',
              enum: ['openweather', 'weatherapi'],
              default: 'openweather'
            }
          },
          required: ['location']
        }
      },
      {
        name: 'get_weather_forecast',
        description: 'Get weather forecast for a location',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name, coordinates, or location query'
            },
            days: {
              type: 'number',
              description: 'Number of forecast days',
              minimum: 1,
              maximum: 10,
              default: 5
            },
            provider: {
              type: 'string',
              description: 'Weather data provider',
              enum: ['openweather', 'weatherapi'],
              default: 'openweather'
            }
          },
          required: ['location']
        }
      },
      {
        name: 'list_api_endpoints',
        description: 'List all available API endpoints and their configurations',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: 'set_api_key',
        description: 'Set API key for an endpoint that requires authentication',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'The API endpoint key',
              enum: Object.keys(this.apiService.getAvailableEndpoints())
            },
            apiKey: {
              type: 'string',
              description: 'The API key'
            }
          },
          required: ['endpoint', 'apiKey']
        }
      }
    ];
  }

  public async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case 'make_api_request':
        return await this.apiService.makeRequest(args);

      case 'get_current_weather':
        return await this.weatherService.getCurrentWeather(args.location, args.provider);

      case 'get_weather_forecast':
        return await this.weatherService.getForecast(args.location, args.days, args.provider);

      case 'list_api_endpoints':
        return {
          success: true,
          data: this.apiService.getAvailableEndpoints()
        };

      case 'set_api_key':
        this.apiService.setApiKey(args.endpoint, args.apiKey);
        return {
          success: true,
          message: `API key set for endpoint: ${args.endpoint}`
        };

      default:
        return {
          success: false,
          error: `Unknown tool: ${name}`
        };
    }
  }
}