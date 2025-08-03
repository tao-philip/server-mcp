# MCP API Server

A Model Context Protocol (MCP) server that exposes REST API endpoints with support for both public and authenticated APIs. Built with TypeScript and designed for easy extensibility.

## Features

- **MCP Protocol Support**: Full stdio transport support for MCP clients
- **Multiple API Support**: Pre-configured for weather APIs (OpenWeatherMap, WeatherAPI) and public testing APIs
- **Authentication Handling**: Support for API key, Bearer token, and Basic authentication
- **Extensible Architecture**: Easy to add new API endpoints and services
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Error Handling**: Robust error handling and response formatting

## Installation

```bash
npm install
```

## Configuration

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Add your API keys to the `.env` file:
```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
WEATHERAPI_API_KEY=your_weatherapi_api_key_here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## MCP Client Configuration

### VS Code / Trae Configuration

To use this MCP server with VS Code or Trae, you need to configure it in your MCP client settings.

#### For Production (after building):
Use the `mcp-server-config.json` file:

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "c:\\Users\\taoph\\repos\\mcp\\mcp-api",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### For Development:
Use the `mcp-server-config.dev.json` file:

```json
{
  "mcpServers": {
    "mcp-api-server-dev": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "c:\\Users\\taoph\\repos\\mcp\\mcp-api",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

#### Setup Steps:

1. **Build the project** (for production config):
   ```bash
   npm run build
   ```

2. **Configure your MCP client**:
   - Copy the contents of `mcp-server-config.json` (or `mcp-server-config.dev.json` for development)
   - Add it to your VS Code/Trae MCP configuration
   - Update the `cwd` path to match your actual project location

3. **Restart your MCP client** to load the new server configuration

#### Alternative Configuration Methods:

**Option 1: Direct command configuration**
```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "npm",
      "args": ["start"],
      "cwd": "c:\\Users\\taoph\\repos\\mcp\\mcp-api"
    }
  }
}
```

**Option 2: Using npx for development**
```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "c:\\Users\\taoph\\repos\\mcp\\mcp-api"
    }
  }
}
```

## Available Tools

### 1. `make_api_request`
Make a request to any configured API endpoint.

**Parameters:**
- `endpoint` (required): API endpoint key (openweather, weatherapi, httpbin, jsonplaceholder)
- `path` (required): API path (e.g., /weather, /current.json)
- `method` (optional): HTTP method (GET, POST, PUT, DELETE)
- `params` (optional): Query parameters
- `headers` (optional): Additional headers
- `body` (optional): Request body for POST/PUT requests

### 2. `get_current_weather`
Get current weather for a location.

**Parameters:**
- `location` (required): City name, coordinates, or location query
- `provider` (optional): Weather data provider (openweather, weatherapi)

### 3. `get_weather_forecast`
Get weather forecast for a location.

**Parameters:**
- `location` (required): City name, coordinates, or location query
- `days` (optional): Number of forecast days (1-10, default: 5)
- `provider` (optional): Weather data provider (openweather, weatherapi)

### 4. `list_api_endpoints`
List all available API endpoints and their configurations.

### 5. `set_api_key`
Set API key for an endpoint that requires authentication.

**Parameters:**
- `endpoint` (required): API endpoint key
- `apiKey` (required): The API key

## Adding New APIs

### 1. Add Endpoint Configuration

Edit `src/config/endpoints.ts`:

```typescript
export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
  // ... existing endpoints
  newapi: {
    name: 'New API',
    description: 'Description of the new API',
    baseUrl: 'https://api.example.com',
    requiresAuth: true,
    authType: 'apiKey',
    authHeader: 'X-API-Key',
    defaultParams: {
      format: 'json'
    }
  }
};
```

### 2. Add Environment Variable

Add to `.env`:
```env
NEWAPI_API_KEY=your_api_key_here
```

### 3. Create Service (Optional)

For complex APIs, create a dedicated service in `src/services/`:

```typescript
export class NewApiService {
  constructor(private apiService: ApiService) {}

  public async getData(params: any): Promise<ApiResponse> {
    return await this.apiService.makeRequest({
      endpoint: 'newapi',
      path: '/data',
      params
    });
  }
}
```

### 4. Add Tools (Optional)

Add specific tools in `src/tools/ApiTools.ts` for better user experience.

## Architecture