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

var locations = [zigarettenfabrik];

L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

var map = L.mapquest.map('map', {
    center: [52.5573155, 13.3729101], // coordinates on load (Berlin)
    layers: L.mapquest.tileLayer('map'),
    zoom: 9 
});

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
    locationsList.appendChild(locationItem);

    addPinpointToMap(lat, lng, name);
    locations.push(newLocation);
}

function addPinpointToMap(lat, lng, name) {
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(name)
    marker.on('click', function(e) {
        marker.openPopup();
    });
}

function initializeMap() {
    addPinpointToMap(52.5573155, 13.3729101, 'Kiez in der Schwedenstraße');
    addPinpointToMap(52.38300635, 12.610102564424093, 'Zigarettenfabrik');
    addPinpointToMap(52.392, 13.7892, 'Tesla Giga Factory');
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


export {
    addLocation,
    initializeMap,
    getLocationByName,
    updateLocation
}
