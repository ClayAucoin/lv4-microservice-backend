// src/index.js

import express from 'express'
import { config } from './config.js'

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  // TODO return a JSON object to ensure proof of life of the server.
  const outputMessage = 'Required parameters: '
  res.json({
    message: 'This endpoint returns the weather for a specific date.',
    requiredParameters: {
      zip: '5-digit US ZIP code',
      year: '4-digit year',
      month: '1-12',
      day: '1-31'
    },
    format: '/api/v1/weather/{zip}/{year}/{month}/{day}',
    example: '/api/v1/weather/70119/2024/12/25'
  })
});

// input: place, time
app.get('/api/v1/weather/:zip/:year/:month/:day', async (req, res) => {
  const { zip, year, month, day } = req.params

  const apiKey = config.weather_key
  // const startDate = 'next7days';
  const startDate = year + '-' + month + '-' + day  // 'next7days'
  const unitGroup = 'us';



  // protected route
  const serviceKey = req.headers['x-service-key']
  const service_key = config.service_key
  if (serviceKey !== service_key) {
    return res.json({ message: 'Not authorized.' })
  }

  const fetchUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zip}/${startDate}?unitGroup=${unitGroup}&include=current&contentType=json&key=${apiKey}`;

  const result = await fetch(fetchUrl)
  const data = await result.json()
  const current = data.currentConditions

  // console.log(data)

  // where days.datetime = '2025-12-09'
  res.json({
    temp: current.temp,
    precipitation: current.precip,
    conditions: current.conditions,
    icon: current.icon,
    sunrise: current.sunrise,
    sunset: current.sunset,
    description: data.days[0].description,
    // data: data,
  })
})

const server = app.listen(PORT, () => {
  console.log(`Weather Microservice running on port ${PORT}`);
});

server.on('error', (e) => {
  console.error(e)
})