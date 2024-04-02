let buttonEl = document.querySelector("#submit");


// adding google maps API 
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
          ({key: "AIzaSyCV-KxEPg8JUzGUCcmCjBZv3hS5woEOVoM", v: "weekly"});

// variable declaration
let map;

async function initMap() {
// cleveland cords 
  const position = { lat: 41.4993, lng: -81.6944 };

// importing map libraries
  const { Map } = await google.maps.importLibrary("maps");

//   Map centering on Cleveland, declared by ID map 
  map = new Map(document.getElementById("map"), {
    zoom: 11,
    center: position,
    mapId: "Cleveland",
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

// Function to handle form submission and location search
function handleLocationSearch(event) {
  // Implementation to search for a location and retrieve sunset data
}

// Function to display current and future sunset times
function getSunsetTime(latitude, longitude, date) {
  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const sunset = new Date(data.results.sunset);

          const options = {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric'
          };

          const sunsetTime = sunset.toLocaleTimeString('en-US', options);

          const sunsetElement = document.getElementById('sunset-time');
          sunsetElement.innerHTML = `<p>Sunset time (Eastern Time): ${sunsetTime}</p>`;
      })
      .catch(error => console.error('Error fetching sunset time:', error));
}

const latitude = 41.4993; // Latitude of Cleveland
const longitude = -81.6944; // Longitude of Cleveland
const date = '2024-04-02'; // Date

getSunsetTime(latitude, longitude, date);

// Function to display tomorrow's sunset times
function displayTomorrowsSunset(location, sunsetData) {
  // Implementation to display tomorrow's sunset times
}

// Function to display sunset calendar
function displaySunsetCalendar(location, sunsetCalendarData) {
  // Implementation to display sunset calendar for the next 45 days
}

// Function to toggle between light and dark mode
const themeSwitcher = document.getElementById("theme-switcher");
    themeSwitcher.addEventListener("change", function() {
        if (this.checked) {
            document.documentElement.classList.add("dark-theme");
        } else {
            document.documentElement.classList.remove("dark-theme");
        }
    });

initMap();


// adding current time stamp
const currentTime = dayjs().format(`h:mm A`);
$(`#timeStamp`).text(`Current Time: ` + currentTime);
// console.log(currentTime);

// adding a calendar modal
// $(document).ready(function() {
//   $('#datepicker').datepicker({
//     dateFormat: 'mm-dd', 
//     changeMonth: true,  
//   });
// });
$(document).ready(function() {
  $('<div id="datepicker"></div>').insertAfter('label[for="datepicker"]').datepicker();
});

// $(document).ready(function() {
//   $('#datepickerContainer').datepicker();
// });

$(document).ready(function() {
    $('#datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      changeMonth: true, 
      changeYear: true 
    });
});


// SUBMIT BUTTON EVENT LISTENER
buttonEl.addEventListener('submit', handleLocationSearch());