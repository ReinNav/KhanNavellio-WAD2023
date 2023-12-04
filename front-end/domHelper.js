import { getLocationByName, updateLocation, updatePinpoint, addLocation } from "./map.js";
import { geocodeAddress } from "./geoservice.js";

var role = "";

const hideAllSections = () => {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
}

const hideElement = (id) => {
    document.getElementById(id).style.display = 'none';
}

const showElement = (id) => {
    document.getElementById(id).style.display = 'block';
}

const asAdmin = () => {
    showElement('add-btn');
    role = "admin";
}

const asNonAdmin = () => {
    hideElement('add-btn');
    role = "non-admin";
}

const goToAddScreen = () => {
    hideAllSections();
    document.getElementById('add-screen').style.display = 'block';
}

const goToMainScreen = () => {
    hideAllSections();
    document.getElementById('main-screen').style.display = 'block';
}

const goToLoginScreen = () => {
    hideAllSections();
    document.getElementById('login-screen').style.display = 'flex';
}

const goToUpdateScreen = (event) => {
    var clickedLi = event.currentTarget;

    var nameElement = clickedLi.querySelector('.location-title');
    var streetElement = clickedLi.querySelector('.location-street');
    var cityElement = clickedLi.querySelector('.location-city');
    var levelElement = clickedLi.querySelector('.location-level');

    var locationName = nameElement.textContent;
    const location = getLocationByName(locationName);

    console.log(location);
    console.log(locationName);

    hideAllSections();
    document.getElementById('update-delete-screen').style.display = 'block';

    //TODO
    // if (role == "admin") {

    // } else {

    // }

    fillUpdateFormWithData(location);


    document.getElementById('update-location-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var newData = collectFormSubmission("-update");
        console.log(newData);
        if (newData.lat === "" || newData.lng === "") {
        const fullAddress = `${newData.street}, ${newData.postalCode}, ${newData.city}`;

        geocodeAddress(fullAddress)
            .then(latLng => {
            newData.lat = String(latLng.lat);
            newData.lng = String(latLng.lng);  
            updateLocation(location, newData);
            goToMainScreen();
            })
            .catch(error => {
            console.log(error.message);
            alert('Geocoding failed. Please check and try the input again.');
            });
        } else {
            updateLocation(location, newData);
            goToMainScreen();
        }
        // Set data values for a location item in list
        nameElement.textContent = newData.name;
        streetElement.textContent = newData.street;
        cityElement.textContent = `${newData.city}, ${newData.state}`;
        levelElement.textContent = `Pollution level: ${newData.pollutionLevel}`;


        updatePinpoint(location, newData);
        
    });
}

const collectFormSubmission = (identifier) => {

    var formData = {
        name: document.getElementById('fname' +identifier).value,
        desc: document.getElementById('fdesc' +identifier).value,
        street: document.getElementById('fstreet' +identifier).value,
        postalCode: String(document.getElementById('fpostal' +identifier).value),
        city: document.getElementById('fcity' +identifier).value,
        state: document.getElementById('fstate' +identifier).value,
        lat: String(document.getElementById('flatitude' +identifier).value),
        lng: String(document.getElementById('flongitude' +identifier).value),
        pollutionLevel: String(document.getElementById('fpollution-level' +identifier).value),
    }
    return formData;
}

const fillUpdateFormWithData = (location) => {

    document.getElementById('fname-update').value = location.name;
    document.getElementById('fdesc-update').value = location.desc;
    document.getElementById('fstreet-update').value = location.street;
    document.getElementById('fpostal-update').value = location.postalCode;
    document.getElementById('fcity-update').value = location.city;
    document.getElementById('fstate-update').value = location.state;
    document.getElementById('flatitude-update').value = location.lat;
    document.getElementById('flongitude-update').value = location.lng;
    document.getElementById('fpollution-level-update').value = location.pollutionLevel;
}

var cancelButtons = document.querySelectorAll('#cancel-btn');
cancelButtons.forEach(function(cancelButton) {
    cancelButton.onclick = goToMainScreen;
});

export {
    asAdmin,
    asNonAdmin,
    goToAddScreen,
    goToMainScreen,
    goToLoginScreen,
    goToUpdateScreen,
    hideAllSections,
    collectFormSubmission
}
