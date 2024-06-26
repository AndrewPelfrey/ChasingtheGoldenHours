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
       
      destinationLatitude = result.routes[0].legs[0].end_location.lat();
      destinationLongitude = result.routes[0].legs[0].end_location.lng();
      time = result.routes[0].legs[0].duration.text;

      // DISPLAY TRAVEL TIME
    const travelTimeElement = document.getElementById("travel-time");
    travelTimeElement.innerHTML = `<h3>Travel Time: ${time}</h3>`;

    const latitude = destinationLatitude;
    const longitude = destinationLongitude;


    getSunsetTime(latitude, longitude);
    displayTomorrowsSunset(latitude, longitude);

    // FUNCTION TO HANDLE FORM SUBMISSION AND LOCATION SEARCH
      let cityInputVal = result.routes[0].legs[0].end_address;
  
      fetchWeatherData(destinationLatitude, destinationLongitude, cityInputVal); // CALLS OPENWEATHER API and CALLS PRINTWEATHER FUNCTION FOR SUNSET CITY

      // CALL FUNCTION TO DISPLAY SEARCH HISTORY
        displaySearchHistory();

    } else {
      alert("Error calculating route. Please check your input locations.");
    }
});
}

// JS FOR BULMA MODAL
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
function getSunsetTime(latitude, longitude) {

    const currentDate = new Date();

    // FORMAT THE DATE TO YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month is zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

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

// FUNCTION TO DISPLAY TOMORROW'S SUNSET TIMES
function displayTomorrowsSunset(latitude, longitude) {

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    // FORMAT THE DATE TO YYYY-MM-DD
    const year = tomorrowDate.getFullYear();
    const month = String(tomorrowDate.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrowDate.getDate()).padStart(2, '0');
    const tDate = `${year}-${month}-${day}`;

  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${tDate}&formatted=0`;

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

// FUNCTION TO FETCH SUNSET WEATHER DATA
function fetchWeatherData(destinationLatitude, destinationLongitude, cityInputVal) {
    const lat = destinationLatitude;
    const lon = destinationLongitude;

    let cityObj = {
        cityname: cityInputVal,
        lat: destinationLatitude,
        lon: destinationLongitude,
    }

    // USING LATITUDE AND LONGITUDE TO GET FORECAST DATA
    let openForecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=289d20f1ae5e1a64488055403d91c79b&units=imperial`

    fetch(openForecastQueryURL)
        .then(function (response) {
            if(!response.ok) {
                throw response.json();
            }
            return response.json();
        })
    
        .then(function (forecastData) {
            renderResults(forecastData); // Calls function to display current weather
            saveToLocalStorage(cityObj); // Save to localStorage
            displaySearchHistory(); // Update search history display
        })
    
        .catch(function (error) {
            alert('Error fetching weather data:', error);
        });
    
    }

// FUNCTION TO PRINT THE CURRENT WEATHER RESULTS TO THE PAGE
function renderResults(resultObj) {

    // UPDATE THE UI DYNAMICALLY WITH THE RETRIEVED WEATHER DATA
    const resultCard = document.createElement('div');
    resultCard.classList.add('card');

    const resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    const icon = resultObj.list[0].weather[0].icon; // DEFINING THE ICON 3 DIGIT CODE TO A VARIBALE

    const resultHeader = document.createElement('h3');
    resultHeader.classList.add('card-header');
    resultHeader.innerHTML = `Todays Weather ${resultObj.city.name} <img src="https://openweathermap.org/img/w/${icon}.png" alt="img"></img>`;

    const weatherContentEl = document.createElement('p');
    weatherContentEl.classList.add('card-para');
    weatherContentEl.innerHTML = `<strong>Weather:</strong> ${resultObj.list[0].weather[0].main}`;

    const tempContentEl =document.createElement('p');
    tempContentEl.classList.add('card-para');
    tempContentEl.innerHTML = `<strong>Temp:</strong> ${resultObj.list[0].main.temp} F`;

    const humidityContentEl = document.createElement('p');
    humidityContentEl.classList.add('card-para');
    humidityContentEl.innerHTML = `<strong>Humidity:</strong> ${resultObj.list[0].main.humidity}%`;

    const windContentEl = document.createElement('p');
    windContentEl.classList.add('card-para');
    windContentEl.innerHTML = `<strong>Wind:</strong> ${resultObj.list[0].wind.speed}mph<br/>`;

    resultBody.append(resultHeader, weatherContentEl, tempContentEl, humidityContentEl, windContentEl);

    // FIND EXISTING RESULT CARD AND REPLACE IT WITH THE NEW ONE
    const existingResultCard = document.querySelector('.card');
    if (existingResultCard) {
        existingResultCard.replaceWith(resultCard);
    } else {
        // IF THERE'S NO EXISTING RESULT CARD, JUST APPEND THE NEW ONE
        currentWeatherEl.appendChild(resultCard);
    }
}


// FUNCTION TO SAVE THE SEARCHED CITY TO LOCALSTORAGE
function saveToLocalStorage(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // ADD THE SEARCHED CITY TO THE SEARCH HISTORY ARRAY
    searchHistory.push(city);

    // CREATED BY CHATGPT: Keep only the last 4 entries in the search history array
    if (searchHistory.length > 4) {
        searchHistory = searchHistory.slice(-4);
    }
    // SAVE THE UPDATED SEARCH HISTORY ARRAY BACK TO LOCALSTORAGE
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// FUNCTION TO DISPLAY SEARCH HISTORY FROM LOCALSTORAGE
function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // CLEAR THE EXISTING SEARCH HISTORY DISPLAYED ON THE PAGE
    searchHistoryEl.innerHTML = '';

    // MAKING THE LOCATIONS UNIQUE
    let uniqueCities = new Set();
    // LOOP THROUGH THE SEARCH HISTORY ARRAY AND CREATE LIST ITEMS TO DISPLAY EACH SEARCH CITY
    
    for (let i = searchHistory.length - 1; i >= 0; i--) {
        const cityItem = searchHistory[i];
        if (!uniqueCities.has(cityItem.cityname)) {
        const listItem = document.createElement(`li`);
        listItem.textContent = cityItem.cityname;
 
        // ADD EVENT LISTENER TO EACH LIST ITEM TO HANDLE CLICK EVENT
        listItem.addEventListener(`click`, () => {
            city.value = cityItem.cityname;
            calcRoute();

            // CALL FETCHWEATHERDATA FUNCTION WITH CLICKED CITY
            fetchWeatherData(cityItem.lat, cityItem.lon, cityItem.cityname);
        });

        // APPEND TO THE SEARCHHISTORYEL
        searchHistoryEl.appendChild(listItem);
        uniqueCities.add(cityItem.cityname);
      }  
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

    initMap(); // CALLS THE MAP FUNCTION ON PAGE LOAD

    displaySearchHistory(); // CALLS THE DISPLAY SEARCH HISTORY FUNCTION ON PAGE LOAD
});

