import { getLocationById, goToUpdateScreen } from "./domHelper.js";
import { geocodeAddress } from "./geoservice.js";




// Fetch location data from the backend
async function fetchLocations() {
    try {
        const response = await fetch('http://localhost:8000/loc');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching locations:', error);
        return []; // Return an empty array in case of error
    }
}

// MapQuest Key
L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

// Initialize the map
var map = L.mapquest.map('map', {
    center: [52.5573155, 13.3729101], // coordinates on load (Berlin)
    layers: L.mapquest.tileLayer('map'),
    zoom: 9 
});

var markers = [];
var locations = {}; // Store fetched locations

async function postLocationToBackend(newLocation) {
    try {
      const response = await fetch('http://localhost:8000/loc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
      });
  
      if (response.ok) {
        return response;
      } else {
        throw new Error('Failed to add location.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  

async function addLocation(newLocation, isNew = false) {
    try {
        let location = newLocation;

        if (isNew) {
            try {
                const response = await postLocationToBackend(newLocation);
                const newLocationWithId = await response.json();
                location = newLocationWithId;
                console.log(location); // Should now have the ID
            } catch (error) {
                alert(error);
                return; // Exit the function, as we couldn't add the location
            }
        }

        //console.log(location); 
        const { name, street, city, state, pollutionLevel, _id } = location;
        
        // let hiddenIdElement = '';
        // if (!isNew) {
        //     hiddenIdElement = `<input type="hidden" class="location-id" value="${newLocation_id}">`;
        // }
        
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
        locations[_id] = locationItem;
        locationItem.dataset.locationId = _id;
        //console.log(locationItem.dataset.locationId)
        const locationsList = document.querySelector('#locations-side-bar ul');
        locationItem.onclick = goToUpdateScreen;
        
        locationsList.appendChild(locationItem);
        addPinpointToMap(location.lat, location.lng, name, _id);

        console.log(locations);

    } catch (error) {
        console.error('Error adding location:', error);
    }
}

function updateLocationListItem(updatedLocationId, newData, oldData) {
    const locationItem = locations[updatedLocationId];
    if (locationItem) {

        locationItem.querySelector('.location-title').textContent = newData.name;
        locationItem.querySelector('.location-street').textContent = newData.street;
        locationItem.querySelector('.location-city').textContent = `${newData.city}, ${newData.state}`;
        locationItem.querySelector('.location-level').textContent = `Pollution level: ${newData.pollutionLevel}/10`;
        
        if (oldData.lat !== newData.lat || oldData.lng !== newData.lng) {
            removeMarkerFromMap(updatedLocationId);
            
            addPinpointToMap(newData.lat, newData.lng, newData.name, updatedLocationId);
        }
    
    }

    console.log(locations);
}

function addPinpointToMap(lat, lng, name, locationId) {
    // Check if latitude and longitude are valid
    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid coordinates for marker: ${name}. Latitude: ${lat}, Longitude: ${lng}`);
        return; 
    }

    //console.log(lat, lng);
    // Create and add the marker to the map
    const marker = L.marker([lat, lng], { id: locationId });
    console.log(marker);
    map.addLayer(marker);
    marker.bindPopup(name);
    marker.on('click', function(e) {
        marker.openPopup();
    });
    markers.push(marker);
}


// Initialize map with locations fetched from backend
async function initializeMap() {
    const locationsList = document.querySelector('#locations-side-bar ul');
    locationsList.replaceChildren();

    const fetchedLocations = await fetchLocations();
    if (fetchedLocations && fetchedLocations.length > 0) {
        for (const location of fetchedLocations) {
            await addLocation(location);
        }
    } else {
        console.error('No locations fetched from backend');
    }
}

function updateLocation(location, newData) {
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].name === location.name) {
            locations[i] = newData;
        }
    }
}

function getLocationByName(locationName) {
    console.log('Searching for location:', locationName);
    console.log('Current locations:', locations);

    for (let i = 0; i < locations.length; i++) {
        if (locations[i].name === locationName) {
            console.log('Location found:', locations[i]);
            return locations[i];
        }
    }
    console.error('Location not found:', locationName);
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

function removeLocationFromList(locationId) {

    if (!locationId) {
        console.error('Location ID not found on clicked element');
        return;
    }

    const locationListItem = locations[locationId];

    if (locationListItem) {
        locationListItem.remove();
        delete locations[locationId];
    } else {
        console.error('List item for location ID not found:', locationId);
    }
}

function removeMarkerFromMap(locationId) {
    console.log("Removing marker for locationId:", locationId);
    for (let i = markers.length - 1; i >= 0; i--) {
        console.log("Checking marker with id:", markers[i].options.id);
        if (markers[i].options.id === locationId) {
            console.log("Found marker to remove:", markers[i]);
            console.log(map.hasLayer(markers[i]))
            map.removeLayer(markers[i])
            markers.splice(i, 1);
            console.log("Marker removed");
            console.log("Is marker still on map? ", map.hasLayer(markers[i]));
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
    removeMarkerFromMap,
    updateLocationListItem
}
