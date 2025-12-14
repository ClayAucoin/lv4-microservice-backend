// src/routes/read.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import { validateAPIKey, validateWeatherQuery } from "../middleware/validators.js"
import { config } from "../config.js"

const router = express.Router()

// ---- GET /api/v1/weather route ----
router.get('/', validateAPIKey, validateWeatherQuery, async (req, res) => {
  // app.get('/api/v1/weather', validateWeatherQuery, async (req, res) => {
  console.log('GET /api/v1/weather')
  const { zip, dateString } = req.weatherParams

  console.log("date:", dateString)

  const apiKey = config.weather_key
  const baseUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zip}/${dateString}`;
  const fetchUrl = `${baseUrl}?unitGroup=us&include=current&contentType=json&key=${apiKey}`;

  try {
    const result = await fetch(fetchUrl)
    const data = await result.json()

    const dayData = data.days && data.days[0]
    const current = data.currentConditions

    if (!dayData && !current) {
      return res.status(404).json({ message: 'No weather data found for that date.' })
    }
    const source = dayData || current

    res.json({
      reqDate: dateString,
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

export default router