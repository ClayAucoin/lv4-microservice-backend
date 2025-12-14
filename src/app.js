// src/app.js

import express from 'express'
import cors from "cors"

// utils
import { sendError } from "./utils/sendError.js"
import { config } from "./config.js"

// routes
import rootRouter from "./routes/root.js"
import itemsRouter from "./routes/items.js"

const app = express()

app.use(cors())
app.use(express.json())

// use routes
app.use("/", rootRouter)
app.use("/api/v1/weather", itemsRouter)


// check for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return next(sendError(400, "Invalid JSON body", "INVALID_JSON"))
  }
  next(err)
})

export function globalErrorHandler(err, req, res, next) {

  if (config.nodeEnv !== "test") {
    // console.log("stack:", err.stack || err)
  }

  const status = err.status || 500
  const message = err.message || "Internal Server error"
  const code = err.code || "INTERNAL_ERROR"

  const payload = {
    ok: false,
    error: {
      status,
      message,
      code
    }
  }

  if (err.details) {
    payload.error.details = err.details
  }

  res.status(status).json(payload)
}


// // ---- root route ----
// // app.get('/', validateAPIKey, (req, res) => {
// app.get('/', (req, res) => {
//   console.log('GET /')
//   res.json({
//     message: 'This endpoint returns the weather for a specific date.',
//     requiredParameters: {
//       zip: '5-digit US ZIP code',
//       date: '4-digit year' - '2-digit month (01-12)' - '2-digit day (01-31)'
//     },
//     format: '/api/v1/weather?zip={zip}&year={year-month-day}',
//     example: '/api/v1/weather?zip=70123&date=2024-12-25'
//   })
// })

// // ---- GET /api/v1/weather route ----
// app.get('/api/v1/weather', validateAPIKey, validateWeatherQuery, async (req, res) => {
//   // app.get('/api/v1/weather', validateWeatherQuery, async (req, res) => {
//   console.log('GET /api/v1/weather')
//   const { zip, dateString } = req.weatherParams

//   console.log("date:", dateString)

//   const apiKey = config.weather_key
//   const fetchUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zip}/${dateString}?unitGroup=us&include=current&contentType=json&key=${apiKey}`;

//   try {
//     const result = await fetch(fetchUrl)
//     const data = await result.json()

//     const dayData = data.days && data.days[0]
//     const current = data.currentConditions

//     if (!dayData && !current) {
//       return res.status(404).json({ message: 'No weather data found for that date.' })
//     }
//     const source = dayData || current

//     res.json({
//       reqDate: dateString,
//       temp: source.temp,
//       precipitation: source.precip,
//       conditions: source.conditions,
//       icon: source.icon,
//       sunrise: source.sunrise,
//       sunset: source.sunset,
//       description: dayData?.description || source.conditions,
//       // raw: data,
//     })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// })

export function error404(req, res, next) {
  next(sendError(
    404,
    "Route not found",
    "NOT_FOUND",
    { path: req.path, method: req.method }
  ))
}

// routes error 404
app.use(error404)

// global error handling
app.use(globalErrorHandler)

export default app