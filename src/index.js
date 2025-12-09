// src/index.js

import express from 'express'
import { config } from './config.js'
import { validateAPIKey, validateWeatherQuery } from "./middleware/validators.js"

const app = express();
const PORT = config.port;

app.get('/', validateAPIKey, (req, res) => {
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
    format: '/api/v1/weather?zip={zip}&year={year}&month={month}&day={day}',
    example: '/api/v1/weather?zip=70123&year=2024&month=12&day=25'
  })
});

app.get('/api/v1/weather', validateAPIKey, validateWeatherQuery, async (req, res) => {
  const { zip, year, month, day } = req.weatherParams

  console.log(req.weatherParams)

  // retrieve config vars
  const apiKey = config.weather_key

  const startDate = `${year}-${month}-${day}` // or 'next7days'
  // console.log(startDate)

  const fetchUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zip}/${startDate}?unitGroup=us&include=current&contentType=json&key=${apiKey}`;

  try {
    const result = await fetch(fetchUrl)

    const data = await result.json()

    const dayData = data.days && data.days[0]
    const current = data.currentConditions

    if (!dayData && !current) {
      return res.status(404).json({ message: 'No weather data found for that date.' })
    }

    const source = dayData || current

    // days.datetime format = '2025-12-09'
    res.json({
      reqDate: startDate,
      temp: source.temp,
      precipitation: source.precip,
      conditions: source.conditions,
      icon: source.icon,
      sunrise: source.sunrise,
      sunset: source.sunset,
      description: dayData?.description || source.conditions,
      // raw: data,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

const server = app.listen(PORT, () => {
  console.log(`Weather Microservice running on port ${PORT}`);
});

server.on('error', (e) => {
  console.error(e)
})

export function error404(req, res, next) {
  res.status(404).json({
    message: "Route not found",
    details: {
      path: req.path,
      method: req.method
    }
  })
}