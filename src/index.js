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

// input: place, time
app.get("/api/v1/weather/:place/:year/:month/:day", async (req, res) => {
  const { place, year, month, day } = req.params
  // const place = req.params.place
  // const year = req.params.year
  // const month = req.params.month
  // const day = req.params.day

  console.log("place:", place)
  console.log("year:", year)
  console.log("month:", month)
  console.log("day:", day)

  const fetchUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/New%20Orleans%2CLA?unitGroup=us&include=hours,events,current&contentType=json&key=EJRHR5YF55YQRZQDZ4CNVDG7S"

  const result = await fetch(fetchUrl)
  const data = await result.json()

  console.log(data)

  // fetch(fetchUrl, {
  //   method: 'GET',
  //   headers: {}
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw response;
  //     }
  //     return response.json();
  //   })
  //   .then(weatherData => {
  //     console.log("Weather data for New Orleans, LA:", weatherData);
  //     // You can process weatherData here to display or analyze it
  //   })
  //   .catch(errorResponse => {
  //     if (errorResponse.text) {
  //       errorResponse.text().then(errorMessage => {
  //         console.error("Error retrieving weather data:", errorMessage);
  //       });
  //     } else {
  //       console.error("Unknown error occurred");
  //     }
  //   });

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