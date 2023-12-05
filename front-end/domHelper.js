import { getLocationByName, updateLocation, updatePinpoint, addLocation } from "./map.js";
import { geocodeAddress } from "./geoservice.js";
import { removeLocationFromList, removeMarkerFromMap } from './map.js';

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
const updateFormSubmitHandler = (event, location, nameElement, streetElement, cityElement, levelElement) => {
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

    // Update the specific list item in the list
    nameElement.textContent = newData.name;
    streetElement.textContent = newData.street;
    cityElement.textContent = `${newData.city}, ${newData.state}`;
    levelElement.textContent = `Pollution level: ${newData.pollutionLevel}`;

    updatePinpoint(location, newData);
};
const deleteLocationHandler = (locationName) => {
    if (role === "admin") {
        removeLocationFromList(locationName);
        removeMarkerFromMap(locationName);
        goToMainScreen(); // Optionally, navigate back to the main screen
    }
};

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

    fillUpdateFormWithData(location);
    // Show or hide buttons based on the user role
    const submitButton = document.getElementById('submit-button');
    const deleteButton = document.getElementById('delete-btn');

    if (role === "admin") {
        // Show submit and delete buttons for admin
        if (submitButton) submitButton.style.display = 'block';
        if (deleteButton) {
            deleteButton.style.display = 'block';
            deleteButton.onclick = () => deleteLocationHandler(locationName);
        }

    } else if (role === "non-admin") {
        // Hide submit and delete buttons for normalo
        if (submitButton) submitButton.style.display = 'none';
        if (deleteButton) deleteButton.style.display = 'none';
    }

    // Remove any existing event listener and add a new one
    const updateForm = document.getElementById('update-location-form');
    updateForm.removeEventListener('submit', updateFormSubmitHandler);
    updateForm.addEventListener('submit', (e) => updateFormSubmitHandler(e, location, nameElement, streetElement, cityElement, levelElement));
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
