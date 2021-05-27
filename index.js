require('dotenv').config();
const inquirer = require('inquirer');
const chalk = require('chalk');
const axios = require('axios').default;

const weatherKey = process.env.WEATHER_API_KEY

// Open Weather API

async function getWeather() {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=44.79&lon=-95.53&exclude=minutely,daily,alerts&appid=${weatherKey}&units=imperial`);
        let currentTemp = response.data.current.temp
        let chanceOfRain = response.data.hourly[0].pop
        console.log(chalk.bgGreen.black("Current temp is ", currentTemp))
        console.log(chalk.bgGreen.black("Chance of rain ", chanceOfRain,"%"))
    } catch (error) {
        console.error(error);
    }
}

async function getLocationWeather(zipPrompt) {
  let zipcode = zipPrompt
  try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${weatherKey}`)
      let lon = response.data.coord.lon, lat = response.data.coord.lat;
      if (lon) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&appid=${weatherKey}&units=imperial`);
        let currentTemp = response.data.current.temp
        let chanceOfRain = response.data.hourly[0].pop
        console.log(chalk.bgGreen.black("Current temp is ", currentTemp))
        console.log(chalk.bgGreen.black("Chance of rain ", chanceOfRain,"%"))
      }

  } catch (error) {
      console.error(error);
  }
}

// Command Line Logic

inquirer
  .prompt([
    { type: "list",
    message: "Welcome to this simple CMD weather app!\nPlease choose an option",
    name: "welcome",
    choices: ["Check current conditions in Shakopee, MN", "Search by Zipcode" ,"Exit"]
    },

  ])
  .then(answers => {
    if (answers.welcome === "Check current conditions in Shakopee, MN") {
        console.log(chalk.green("Current conditions for Shakopee, MN\n"))
        getWeather();
    }   else if (answers.welcome === "Search by Zipcode") {
        zipWeather();
    }   else if (answers.welcome === "Exit") {
        console.log(chalk.green("Goodbye!"))
    }
  })
  .catch(error => {
    if(error.isTtyError) {
      console.error(error)
    } else {
      console.error("Something else went wrong")
    }
  });

const confirmZipcode = async (input) => {
  if (/^\d{5}(-\d{4})?$/.test(input)) {
    return true;
  }

  return `Please enter a valid US zipcode`;
}

function zipWeather() {
  inquirer.prompt([
    { type: "input",
      message: "Enter the zipcode",
      name: "zipPrompt",
      validate: confirmZipcode
    }
  ])
  .then( ({ zipPrompt }) => {
    getLocationWeather(zipPrompt)
  })
}

