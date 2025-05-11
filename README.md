# MCP Weather Server

A Model Context Protocol (MCP) server that fetches weather data for a location. This server provides weather information through a standardized MCP interface.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/selmernoid/mcp-weather-server.git
   cd mcp-weather-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Get an API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to your `.env` file:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```

5. Start the server:
   ```
   npm start
   ```

## API Usage

The server implements the Model Context Protocol (MCP) pattern, allowing for standardized interactions.

### Endpoint

```
POST /mcp
```

### Request Format

```json
{
  "type": "weather",
  "arguments": {
    "location": "London,UK"
  }
}
```

### Response Format

```json
{
  "type": "weather",
  "data": {
    "location": {
      "name": "London",
      "country": "GB",
      "coordinates": {
        "lat": 51.5074,
        "lon": -0.1278
      }
    },
    "weather": {
      "description": "scattered clouds",
      "temperature": {
        "current": 18.5,
        "feels_like": 17.9,
        "min": 16.8,
        "max": 20.2
      },
      "humidity": 65,
      "wind": {
        "speed": 4.12,
        "direction": 240
      },
      "clouds": 40,
      "timestamp": 1684150800
    }
  }
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes and an error message:

```json
{
  "error": "Error message here"
}
```

## Example Usage with cURL

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "type": "weather",
    "arguments": {
      "location": "New York,US"
    }
  }'
```

## MCP Integration with AI Systems

This server is designed to work with AI systems that implement the Model Context Protocol. When integrated, the AI can request weather data for a specific location, which can be used to enhance responses about weather conditions, travel planning, and more.

## License

MIT
