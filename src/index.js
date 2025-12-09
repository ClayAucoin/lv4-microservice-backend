// src/index.js

import express from 'express'
import { config } from "./config.js"

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  // TODO return a JSON object to ensure proof of life of the server.
  res.json({
    message: "This is a service to give you the weather."
  })
});

// input: place, time
app.get("/api/v1/weather/:zip/:year/:month/:day", async (req, res) => {
  const { zip, year, month, day } = req.params

  // const apiKey = 'EJRHR5YF55YQRZQDZ4CNVDG7S';
  const apiKey = config.weather_key
  const startDate = 'next7days';
  const unitGroup = 'us';



  // protected route
  const serviceKey = req.headers["x-service-key"]
  const service_key = config.service_key
  if (serviceKey !== service_key) {
    return res.json({ message: "Not authorized." })
  }

  const fetchUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zip}/${startDate}?unitGroup=${unitGroup}&include=current&contentType=json&key=${apiKey}`;

  const result = await fetch(fetchUrl)
  const data = await result.json()

  // console.log(data)

  // where days.datetime = "2025-12-09"
  res.json({
    temp: "53.0", // currentConditions.temp
    precipitation: "0.0", // currentConditions.precip
    conditions: "clear", // currentConditions.conditions
    icon: "clear-day", // currentConditions.icon
    sunrise: "06:45:34", // currentConditions.sunrise
    sunset: "17:01:18", // currentConditions.sunset
  })
})

const server = app.listen(PORT, () => {
  console.log(`Weather Microservice running on port ${PORT}`);
});

server.on("error", (e) => {
  console.error(e)
})