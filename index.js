require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Use JSON parser middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MCP Weather Server is running' });
});

// MCP request handler
app.post('/mcp', async (req, res) => {
  try {
    const { type, arguments: args } = req.body;
    
    if (type !== 'weather') {
      return res.status(400).json({ error: 'Unsupported request type' });
    }
    
    if (!args || !args.location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    const location = args.location;
    
    // Call weather API
    const weatherData = await getWeatherData(location);
    
    // Return the response in MCP format
    res.json({
      type: 'weather',
      data: weatherData
    });
  } catch (error) {
    console.error('Error processing MCP request:', error.message);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

async function getWeatherData(location) {
  try {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key is not configured');
    }
    
    // Using OpenWeatherMap API
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: location,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    const data = response.data;
    
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      weather: {
        description: data.weather[0].description,
        temperature: {
          current: data.main.temp,
          feels_like: data.main.feels_like,
          min: data.main.temp_min,
          max: data.main.temp_max
        },
        humidity: data.main.humidity,
        wind: {
          speed: data.wind.speed,
          direction: data.wind.deg
        },
        clouds: data.clouds.all,
        timestamp: data.dt
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw new Error(`Failed to fetch weather data for ${location}`);
  }
}

app.listen(PORT, () => {
  console.log(`MCP Weather Server running on port ${PORT}`);
});