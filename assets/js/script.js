// GRABBING ELEMENTS FROM THE DOM
let searchHistoryEl = document.querySelector(".search-history-list");  // SEARCH HISTORY LIST
let currentCity = document.querySelector("#current-location-input") // CURRENT CITY
let city = document.querySelector("#desired-location-input"); // DESIRED SUNSET CITY
let currentWeatherEl = document.querySelector("#current-weather-result"); // CURRENT WEATHER IN SUNSET CITY
let submit = document.getElementById("location-form"); // SUBMIT BUTTON ELEMENT
let map;
let directionsService;
let directionsDisplay;
let duration;
let mapPreset;

// displaying the initial map set as Cleveland for default 
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: { lat: 41.4993, lng: -81.6944 },
    mapId: "Cleveland",
  });

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  const currentLocationInput = document.getElementById("current-location-input");
  const desiredLocationInput = document.getElementById("desired-location-input");

  // auto complete variables 
  const LocationAutocompleteorigin = new google.maps.places.Autocomplete(currentLocationInput);
  const LocationAutocompletedest = new google.maps.places.Autocomplete(desiredLocationInput);
}

function calcRoute(event) {
  // declaring origin and destination as const fromn the HTML input 
  const origin = document.getElementById("current-location-input").value;
  const destination = document.getElementById("desired-location-input").value;

  // request for directions from origin to destination 
  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  };

  // displaying the request onto the map if directions are correct 
  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      
      // getting the long, lat and time from the calcRoute array 
      destinationLatitude = result.routes[0].legs[0].end_location.lat();
      destinationLongitude = result.routes[0].legs[0].end_location.lng();
      time = result.routes[0].legs[0].duration.text;
      
      // console logging the dest long, lat and time for other API 
      console.log(destinationLatitude);
      console.log(destinationLongitude);
      console.log(time);
      console.log(result);

      // FUNCTION TO HANDLE FORM SUBMISSION AND LOCATION SEARCH
      let cityInputVal = result.request.origin.query; // SUNSET CITY INPUT
  
      // CHECKING VALIDATION ON THE SUNSET CITY INPUT
      if (!cityInputVal) {
          console.log('You need a city input to search.');
          return;
      }
  
      fetchWeatherData(cityInputVal); // CALLS OPENWEATHER API and CALLS PRINTWEATHER FUNCTION FOR SUNSET CITY

        // SAVED THE SEARCHED CITY TO LOCAL STORAGE
        //  const desiredLocation = document.getElementById("desired-location-input").value;
        //  saveToLocalStorage(desiredLocation);
        console.log(desiredLocation);
        displaySearchHistory();

    } else {
      alert("Error calculating route. Please check your input locations.");
    }
});
}

// JS for Bulma Modal
const openModalButton = document.getElementById('openModal');
const closeModalButton = document.getElementById('closeModal');
const modal = document.getElementById('myModal');

openModalButton.addEventListener('click', function() {
    modal.classList.add('is-active');
  });

closeModalButton.addEventListener('click', function() {
    modal.classList.remove('is-active');
  });

// FUNCTION TO DISPLAY CURRENT SUNSET TIMES
function getSunsetTime(latitude, longitude, date) {
  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const sunset = new Date(data.results.sunset);
          const dusk = new Date(data.results.civil_twilight_end);
          const goldenHourEnd = new Date(data.results.nautical_twilight_end);

          const options = {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric'
          };

          const sunsetTime = sunset.toLocaleTimeString('en-US', options);
          const duskTime = dusk.toLocaleTimeString('en-US', options);
          const goldenTime = goldenHourEnd.toLocaleTimeString('en-US', options);

          const sunsetElement = document.getElementById('sunset-time');
          sunsetElement.innerHTML = `<h3>Sunset Time: ${sunsetTime}</h3>`;

          const duskElement = document.getElementById('dusk-time');
          duskElement.innerHTML = `<h3>Dusk Time: ${duskTime}</h3>`;

          const goldenElement = document.getElementById('golden-time');
          goldenElement.innerHTML = `<h3>Golden Time: ${goldenTime}</h3>`;
      })
      .catch(error => console.error('Error fetching sunset time:', error));
}

const latitude = 41.4993; // Latitude of Cleveland
const longitude = -81.6944; // Longitude of Cleveland
const date = '2024-04-8'; // Project Due Date

getSunsetTime(latitude, longitude, date);

// FUNCTION TO DISPLAY TOMORROW'S SUNSET TIMES
function displayTomorrowsSunset(tLatitude, tLongitude, tDate) {
  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${tLatitude}&lng=${tLongitude}&date=${tDate}&formatted=0`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(tData => {
          const tSunset = new Date(tData.results.sunset);
          const tDusk = new Date(tData.results.civil_twilight_end);
          const tGoldenHourEnd = new Date(tData.results.nautical_twilight_end);
console.log(tSunset);
          const options = {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric'
          };

          const tSunsetTime = tSunset.toLocaleTimeString('en-US', options);
          const tDuskTime = tDusk.toLocaleTimeString('en-US', options);
          const tGoldenTime = tGoldenHourEnd.toLocaleTimeString('en-US', options);

          const tSunsetElement = document.getElementById('tom-sunset-time');
          tSunsetElement.innerHTML = `<h3>Sunset Time: ${tSunsetTime}</h3>`;

          const tDuskElement = document.getElementById('tom-dusk-time');
          tDuskElement.innerHTML = `<h3>Dusk Time: ${tDuskTime}</h3>`;

          const tGoldenElement = document.getElementById('tom-golden-time');
          tGoldenElement.innerHTML = `<h3>Golden Time: ${tGoldenTime}</h3>`;
      })
      .catch(error => console.error('Error fetching sunset time:', error));
}

const tLatitude = 41.4993; // Latitude of Tomorrow Location
const tLongitude = -81.6944; // Longitude of Tomorrow Location
const tDate = '2024-04-9'; // Tomorrow

displayTomorrowsSunset(tLatitude, tLongitude, tDate);

// FUNCTION TO FETCH SUNSET WEATHER DATA
function fetchWeatherData(cityInputVal) {
    let openWeatherQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInputVal}&limit=1&appid=289d20f1ae5e1a64488055403d91c79b`;
    
    fetch(openWeatherQueryURL)
        .then(function (response) {
            if(!response.ok) {
                throw response.json();
            }
            return response.json();
        })
    
        .then(function (data) {
            console.log(data); // Returns an array object with cities and lat/long coordinates
    
            // Correct Version for Final Use
            const lat = data[0].lat;
            const lon = data[0].lon;
    
            // Using latitude and longitude to get forcast data
            let openForecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=289d20f1ae5e1a64488055403d91c79b&units=imperial`
    
            return fetch(openForecastQueryURL)
        })
                
        .then(function (response) {
            if(!response.ok) {
                throw alert('Error fecthing forecast data:')
            }
            return response.json();
        })
    
        .then(function (forecastData) {
            console.log(forecastData.list[0].main.temp);
    
            renderResults(forecastData); // Calls function to display current weather
            // Save to localStorage
            saveToLocalStorage(cityInputVal);
            // Update search history display
            displaySearchHistory();
        })
    
        .catch(function (error) {
            console.log(error);
            alert('Error fetching weather data:', error);
        });
    
    }

// FUNCTION TO PRINT THE CURRENT WEATHER RESULTS TO THE PAGE
function renderResults(resultObj) {
    console.log(resultObj);

    // Update the UI dynamically with the retrieved weather data.
    const resultCard = document.createElement('div');
    resultCard.classList.add('card');

    const resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    const icon = resultObj.list[0].weather[0].icon; // DEFINING THE ICON 3 DIGIT CODE TO A VARIBALE

    const resultHeader = document.createElement('h3');
    resultHeader.classList.add('card-header');
    resultHeader.innerHTML = `Todays Weather ${resultObj.city.name} <img src="http://openweathermap.org/img/w/${icon}.png" alt="img"></img>`;

    const dateContentEl = document.createElement('p');
    dateContentEl.innerHTML = `<strong>Date:</strong> ${resultObj.list[0].dt_txt}`;

    const tempContentEl =document.createElement('p');
    tempContentEl.innerHTML = `<strong>Temp:</strong> ${resultObj.list[0].main.temp} F`;

    const humidityContentEl = document.createElement('p');
    humidityContentEl.innerHTML = `<strong>Humidity:</strong> ${resultObj.list[0].main.humidity}%`;

    const windContentEl = document.createElement('p');
    windContentEl.innerHTML = `<strong>Wind:</strong> ${resultObj.list[0].wind.speed}mph<br/>`;

    resultBody.append(resultHeader, dateContentEl, tempContentEl, humidityContentEl, windContentEl);

    // Find existing result card and replace it with the new one
    const existingResultCard = document.querySelector('.card');
    if (existingResultCard) {
        existingResultCard.replaceWith(resultCard);
    } else {
        // If there's no existing result card, just append the new one
        console.log(currentWeatherEl);
        currentWeatherEl.appendChild(resultCard);
    }
}


// FUNCTION TO SAVE THE SEARCHED CITY TO LOCALSTORAGE
function saveToLocalStorage(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Add the searched city to the search history array
    searchHistory.push(city);

    // CREATED BY CHATGPT: Keep only the last 4 entries in the search history array
    if (searchHistory.length > 4) {
        searchHistory = searchHistory.slice(-4);
    }
    // Save the updated search history array back to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to display search history from localStorage
function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Clear the existing search history displayed on the page
    searchHistoryEl.innerHTML = '';

    // LOOP THROUGH THE SEARCH HISTORY ARRAY AND CREATE LIST ITEMS TO DISPLAY EACH SEARCH CITY
    for (let i = searchHistory.length - 1; i >= 0; i--) {
        const city = searchHistory[i];
 
        const listItem = document.createElement(`li`);
        listItem.textContent = city;
 
        // ADD EVENT LISTENER TO EACH LIST ITEM TO HANDLE CLICK EVENT
        listItem.addEventListener(`click`, () => {
            city.value = city;
            submit.click();
            // CALL FETCHWEATHERDATA FUNCTION WITH CLICKED CITY
            fetchWeatherData(city);
        });

        // APPEND TO THE SEARCHHISTORYEL
        searchHistoryEl.appendChild(listItem)
    }
}


// FUNCTION TO TOGGLE BETWEEN LIGHT AND DARK MODE
const themeSwitcher = document.getElementById("theme-switcher");
    themeSwitcher.addEventListener("change", function() {
        if (this.checked) {
            document.documentElement.classList.add("dark-theme");
        } else {
            document.documentElement.classList.remove("dark-theme");
        }
    });

// ADDING CURRENT TIMESTAMP
const currentTime = dayjs().format(`h:mm A`);
$(`#timeStamp`).text(`Time: ` + currentTime);


// CALLING ALL NECESSARY FUNCTIONS ON DOCUMENT PAGE LOAD
$(document).ready(function() {
    // SUBMIT BUTTON EVENT LISTENER TO CALL CALCROUTE AND SEARCH FUNCTIONS
    submit.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        calcRoute(); // CALL FUNCTION TO CALCULATE DIRECTION AND CURRENT WEATHER
    });
    localStorage.removeItem(`searchHistory`);

    initMap(); // CALLS THE MAP FUNCTION ON PAGE LOAD
});

