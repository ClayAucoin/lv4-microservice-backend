// src/config.js

import dotenv from "dotenv"

dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  weather_key: process.env.WEATHER_KEY || "",
  api_key: process.env.API_KEY || "",
}