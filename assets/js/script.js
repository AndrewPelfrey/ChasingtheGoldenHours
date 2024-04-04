// GRABBING ELEMENTS FROM THE DOM
let buttonEl = document.querySelector("#submit");
let searchHistoryEl = document.querySelector("#search-history");
let currentCity = document.querySelector("#current-location-input")
let city = document.querySelector("#desired-location-input");
let map;
let directionsService;
let directionsDisplay;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: { lat: 41.4993, lng: -81.6944 },
    mapId: "Cleveland",
  });

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  const submit = document.getElementById("location-form");
  submit.addEventListener('submit', calcRoute);
}

function calcRoute(event) {
  event.preventDefault();

  const origin = document.getElementById("current-location-input").value;
  const destination = document.getElementById("desired-location-input").value;

  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  };

  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    } else {
      alert("Error calculating route. Please check your input locations.");
    }
  });
}

initMap();


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

// FUNCTION TO HANDLE FORM SUBMISSION AND LOCATION SEARCH
function handleLocationSearch(event) {
  // Implementation to search for a location and retrieve sunset data
}

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
function displayTomorrowsSunset(location, sunsetData) {
  // Implementation to display tomorrow's sunset times
}

// FUNCTION TO DISPLAY SUNSET WEATHER
function fetchWeatherData(city) {
    let openWeatherQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=289d20f1ae5e1a64488055403d91c79b`;
    
    fetch(openWeatherQueryURL)
        .then(function (response) {
            if(!response.ok) {
                throw response.json();
            }
            return response.json();
        })
    
        .then(function (data) {
            console.log(data); // Returns an array object with cities and lat/long coordinates
    
            const lat = data[0].lat;
            const lon = data[0].lon;
    
            console.log(lat);
            console.log(lon);
    
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
            saveToLocalStorage(city);
            // Update search history display
            displaySearchHistory();
        })
    
        .catch(function (error) {
            console.log(error);
            alert('Error fetching weather data:', error);
        });
    
    }

// FUNCTION TO SAVE THE SEARCHED CITY TO LOCALSTORAGE
function saveToLocalStorage(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Add the searched city to the search history array
    searchHistory.push(city);

    // CREATED BY CHATGPT: Keep only the last 8 entries in the search history array
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

    // Loop through the search history array and create list items to display each searched city

    // Add event listener to each list item to handle click event
    
    // Call fetchWeatherData function with the clicked city

    // Need to finish this function to append to the searchHistoryEl
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

// adding current time stamp
const currentTime = dayjs().format(`h:mm A`);
$(`#timeStamp`).text(`Time: ` + currentTime);

// SUBMIT BUTTON EVENT LISTENER
buttonEl.addEventListener('submit', handleLocationSearch());

// CALLING ALL NECESSARY FUNCTIONS ON DOCUMENT PAGE LOAD
$(document).ready(function() {
    // $('<div id="datepicker"></div>').insertAfter('label[for="datepicker"]').datepicker();

    // $('#datepicker').datepicker({
    //     dateFormat: 'yy-mm-dd',
    //     changeMonth: true, 
    //     changeYear: true 
    // });
});

