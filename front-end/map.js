import { goToUpdateScreen } from "./domHelper.js";

let zigarettenfabrik = {
    name: "Zigarettenfabrik",
    desc: "A factory that produces harmful products with harmful chemical processes to the environment.", 
    street: "Rietzer Berg 28",
    postalCode: "14797", 
    city: "Kloster Lenin",
    state: "brandenburg",
    lat: "52.38300635",
    lng: "12.610102564424093",
    pollutionLevel: "7"
   };

   let teslagigafactory = {
    name: "Tesla Giga Factory",
    desc: "A factory that causes water waste", 
    street: "Tesla Straße 1",
    postalCode: "15537", 
    city: "Berlin",
    state: "brandenburg",
    lat: "52.581400",
    lng: "13.440460",
    pollutionLevel: "5"
};

let kiez_in_der_Schwedenstraße = {
    name: "Kiez in der Schwedenstraße",
    desc: "A factory that causes water waste", 
    street: "Schwedenstraße",
    postalCode: "13359", 
    city: "Berlin",
    state: "berlin",
    lat: "52.540220",
    lng: "13.295390",
    pollutionLevel: "8"
};
  

var locations = [zigarettenfabrik];
var locations = [teslagigafactory];
var locations = [kiez_in_der_Schwedenstraße];


L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

var map = L.mapquest.map('map', {
    center: [52.5573155, 13.3729101], // coordinates on load (Berlin)
    layers: L.mapquest.tileLayer('map'),
    zoom: 9 
});

var markers = [];

function addLocation(newLocation) {
    const { name, street, postalCode, city, state, lat, lng, pollutionLevel} = newLocation;

    const locationItem = document.createElement('li');
    locationItem.className = "location-li-item";
    locationItem.innerHTML = `
        <div class="flex-row location-container">
            <div class="flex-column location-info">
                <p class="location-title">${name}</p>
                <p class="location-street">${street}</p>
                <p class="location-city">${city}, ${state}</p>
                <p class="location-level">Pollution level: ${pollutionLevel}/10</p>
            </div>
            <div class="location-img-container">
                <image src="res/location_images/factory_stock_photo.jpeg" alt="${name}"></image>
            </div>
        </div>
    `;

    // Append the new location to the sidebar
    const locationsList = document.querySelector('#locations-side-bar ul');
    locationItem.onclick = goToUpdateScreen;
    locationsList.appendChild(locationItem);

    addPinpointToMap(parseFloat(lat), parseFloat(lng), name);
    locations.push(newLocation);
}

function addPinpointToMap(lat, lng, name) {
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(name)
    marker.on('click', function(e) {
        marker.openPopup();
    });
    markers.push(marker);
}

function initializeMap() {
    addLocation(zigarettenfabrik);
    addLocation(teslagigafactory);
    addLocation(kiez_in_der_Schwedenstraße);
    // addPinpointToMap(52.38300635, 12.610102564424093, 'Zigarettenfabrik');
    // addPinpointToMap(52.392, 13.7892, 'Tesla Giga Factory');
}

function updateLocation(location, newData) {
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].name === location.name) {
            locations[i] = newData;
        }
    }
}

function getLocationByName(locationName) {
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].name === locationName) {
            return locations[i];
        }
    }
    return null;
}

function updatePinpoint(oldData, newData) {
    for (let i = 0; i < markers.length; i++) {
        
        let markerLat = markers[i].getLatLng().lat;
        let markerLng = markers[i].getLatLng().lng;
        let markerName = markers[i].getPopup().getContent();

        // Check if the marker matches the old data
        if (markerLat === parseFloat(oldData.lat) && markerLng === parseFloat(oldData.lng) && markerName === oldData.name) {
            // Update the marker's position and name
            markers[i].setLatLng([parseFloat(newData.lat), parseFloat(newData.lng)]);
            markers[i].bindPopup(newData.name);

            // Refresh the popup if it's open
            if (markers[i].isPopupOpen()) {
                markers[i].openPopup();
            }
            break; // Exit the loop once the marker is found
        }
    }
}
function removeLocationFromList(locationName) {
    // Remove location from array
    locations = locations.filter(location => location.name !== locationName);

    // Remove corresponding list item from DOM
    const locationsList = document.querySelector('#locations-side-bar ul');
    const locationItems = locationsList.querySelectorAll('.location-li-item');
    locationItems.forEach(item => {
        if (item.querySelector('.location-title').textContent === locationName) {
            locationsList.removeChild(item);
        }
    });
}
function removeMarkerFromMap(locationName) {
    for (let i = 0; i < markers.length; i++) {
        let markerName = markers[i].getPopup().getContent();
        if (markerName === locationName) {
            map.removeLayer(markers[i]);
            markers.splice(i, 1);
            break;
        }
    }
}



export {
    addLocation,
    initializeMap,
    getLocationByName,
    updateLocation,
    updatePinpoint,
    removeLocationFromList,
    removeMarkerFromMap
}
