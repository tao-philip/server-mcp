import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiEndpoint, ApiRequest, ApiResponse } from '../types/api.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

export class ApiService {
  private clients: Map<string, AxiosInstance> = new Map();
  private apiKeys: Map<string, string> = new Map();

  constructor() {
    this.initializeClients();
    this.loadApiKeys();
  }

  private initializeClients(): void {
    Object.entries(API_ENDPOINTS).forEach(([key, endpoint]) => {
      const client = axios.create({
        baseURL: endpoint.baseUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MCP-API-Server/1.0.0'
        }
      });

      this.clients.set(key, client);
    });
  }

  private loadApiKeys(): void {
    // Load API keys from environment variables
    Object.entries(API_ENDPOINTS).forEach(([key, endpoint]) => {
      if (endpoint.requiresAuth) {
        const envKey = `${key.toUpperCase()}_API_KEY`;
        const apiKey = process.env[envKey];
        if (apiKey) {
          this.apiKeys.set(key, apiKey);
        }
      }
    });
  }

  public setApiKey(endpointKey: string, apiKey: string): void {
    this.apiKeys.set(endpointKey, apiKey);
  }

  public async makeRequest(request: ApiRequest): Promise<ApiResponse> {
    try {
      const endpoint = API_ENDPOINTS[request.endpoint];
      if (!endpoint) {
        return {
          success: false,
          error: `Unknown endpoint: ${request.endpoint}`
        };
      }

      const client = this.clients.get(request.endpoint);
      if (!client) {
        return {
          success: false,
          error: `Client not initialized for endpoint: ${request.endpoint}`
        };
      }

      // Prepare request configuration
      const config: AxiosRequestConfig = {
        method: request.method || 'GET',
        url: request.path,
        params: { ...endpoint.defaultParams, ...request.params },
        headers: { ...request.headers }
      };

      // Add authentication if required
      if (endpoint.requiresAuth) {
        const apiKey = this.apiKeys.get(request.endpoint);
        if (!apiKey) {
          return {
            success: false,
            error: `API key required for endpoint: ${request.endpoint}`
          };
        }

        switch (endpoint.authType) {
          case 'apiKey':
            if (endpoint.authHeader) {
              config.params = config.params || {};
              config.params[endpoint.authHeader] = apiKey;
            }
            break;
          case 'bearer':
            config.headers!['Authorization'] = `Bearer ${apiKey}`;
            break;
          case 'basic':
            config.headers!['Authorization'] = `Basic ${apiKey}`;
            break;
        }
      }

      // Add request body for POST/PUT requests
      if (request.body && (request.method === 'POST' || request.method === 'PUT')) {
        config.data = request.body;
      }

      const response = await client.request(config);

      return {
        success: true,
        data: response.data,
        statusCode: response.status
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Unknown error',
        statusCode: error.response?.status
      };
    }
  }

  public getAvailableEndpoints(): Record<string, ApiEndpoint> {
    return API_ENDPOINTS;
  }

  public getEndpointInfo(endpointKey: string): ApiEndpoint | null {
    return API_ENDPOINTS[endpointKey] || null;
  }
}