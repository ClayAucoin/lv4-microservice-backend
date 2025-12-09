// src/index.js

import express from 'express';

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  // TODO return a JSON object to ensure proof of life of the server.
  res.json({
    message: "This is a service to give you the weather."
  })
});

app.get("/api/v1/weather", (req, res) => {


  res.json({
    precipitation_percent: "80%",
    conditions: "Cloudy",
    temp: "44"
  })
})

const server = app.listen(PORT, () => {
  console.log(`Weather Microservice running on port ${PORT}`);
});

server.on("error", (e) => {
  console.error(e)
})