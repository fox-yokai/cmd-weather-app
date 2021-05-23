require('dotenv').config();
const inquirer = require('inquirer');
const chalk = require('chalk');
const axios = require('axios').default;

const weatherKey = process.env.WEATHER_API_KEY

async function getWeather() {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=44.79&lon=-95.53&exclude=minutely,daily,alerts&appid=${weatherKey}&units=imperial`);
        let currentTemp = response.data.current.temp
        let chanceOfRain = response.data.hourly[0].pop
        console.log("Current temp: ", currentTemp, "Chance of rain: ", chanceOfRain);
    } catch (error) {
        console.error(error);
    }
}
