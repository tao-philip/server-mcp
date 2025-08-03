export interface ApiEndpoint {
  name: string;
  description: string;
  baseUrl: string;
  requiresAuth: boolean;
  authType?: 'apiKey' | 'bearer' | 'basic';
  authHeader?: string;
  defaultParams?: Record<string, any>;
}

export interface ApiRequest {
  endpoint: string;
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
}

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}