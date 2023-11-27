L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

var map = L.mapquest.map('map', {
    center: [52.5573155, 13.3729101], // coordinates on load (Berlin)
    layers: L.mapquest.tileLayer('map'),
    zoom: 9 
});

function addLocation(formData) {
    const { name, street, postalCode, city, state, lat, long, pollutionLevel} = formData;

    const locationItem = document.createElement('li');
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

    addPinpointToMap(lat, long, name);
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


export {
    addLocation,
    initializeMap
}
