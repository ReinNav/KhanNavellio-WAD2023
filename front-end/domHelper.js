import { getLocationByName, updateLocation, updatePinpoint, addLocation } from "./map.js";
import { geocodeAddress } from "./geoservice.js";
import { removeLocationFromList, removeMarkerFromMap } from './map.js';

var role = "";

// Utility functions for showing/hiding elements
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

// Role-based UI adjustments
const asAdmin = () => {
    showElement('add-btn');
    role = "admin";
}

const asNonAdmin = () => {
    hideElement('add-btn');
    role = "non-admin";
}

// Navigation functions
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

// Form submission handlers
const updateFormSubmitHandler = (event, location, nameElement, streetElement, cityElement, levelElement) => {
    event.preventDefault();
    var newData = collectFormSubmission("-update");
    console.log(newData);

    // If latitude or longitude is empty, use geocoding service to get them
    if (newData.lat === "" || newData.lng === "") {
        const fullAddress = `${newData.street}, ${newData.postalCode}, ${newData.city}`;
        geocodeAddress(fullAddress)
            .then(latLng => {
                newData.lat = String(latLng.lat);
                newData.lng = String(latLng.lng);  
                updateLocationBackend(location, newData); // Update location in backend
                goToMainScreen();
            })
            .catch(error => {
                console.log(error.message);
                alert('Geocoding failed. Please check and try the input again.');
            });
    } else {
        updateLocationBackend(location, newData); // Update location in backend
        goToMainScreen();
    }

    // Update the UI with new location data
    nameElement.textContent = newData.name;
    streetElement.textContent = newData.street;
    cityElement.textContent = `${newData.city}, ${newData.state}`;
    levelElement.textContent = `Pollution level: ${newData.pollutionLevel}`;
    updatePinpoint(location, newData);
};

// Function to update location in the backend
const updateLocationBackend = (location, newData) => {
    fetch(`http://localhost:8000/loc/${location._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })
    .then(response => response.json())
    .then(updatedLocation => {
        console.log('Location updated successfully:', updatedLocation);
        // Optionally update the frontend here
    })
    .catch(error => console.error('Error updating location:', error));
};

// Function to add a new location
const submitAddLocationForm = (event) => {
    event.preventDefault();
    const locationData = collectFormSubmission(""); // Assuming this collects add form data

    fetch('http://localhost:8000/loc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
    })
    .then(response => response.json())
    .then(addedLocation => {
        addLocation(addedLocation); // Add the location to the map
        goToMainScreen();
    })
    .catch(error => {
        console.error('Error adding location:', error);
        alert('Failed to add location.');
    });
};

// Function to delete a location from the backend
const deleteLocationHandler = (locationName) => {
    if (role === "admin") {
        const location = getLocationByName(locationName);
        if (location && location._id) {
            fetch(`http://localhost:8000/loc/${location._id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    removeLocationFromList(locationName);
                    removeMarkerFromMap(locationName);
                    goToMainScreen(); 
                } else {
                    throw new Error('Deletion failed');
                }
            })
            .catch(error => {
                console.error('Error deleting location:', error);
                alert('Failed to delete location.');
            });
        }
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
    const formTitle = document.getElementById('form-title-update');


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
        if (formTitle) formTitle.textContent = 'Location Info';
        disableFormFields('update-location-form');
        enableCancelButton();        

    }

    // Remove any existing event listener and add a new one
    const updateForm = document.getElementById('update-location-form');
    updateForm.removeEventListener('submit', updateFormSubmitHandler);
    updateForm.addEventListener('submit', (e) => updateFormSubmitHandler(e, location, nameElement, streetElement, cityElement, levelElement));
}

const collectFormSubmission = (identifier) => {
    var formData = {
        name: document.getElementById('fname' + identifier).value,
        desc: document.getElementById('fdesc' + identifier).value,
        street: document.getElementById('fstreet' + identifier).value,
        postalCode: String(document.getElementById('fpostal' + identifier).value),
        city: document.getElementById('fcity' + identifier).value,
        state: document.getElementById('fstate' + identifier).value,
        // Convert latitude and longitude to float
        lat: parseFloat(document.getElementById('flatitude' + identifier).value),
        lng: parseFloat(document.getElementById('flongitude' + identifier).value),
        pollutionLevel: String(document.getElementById('fpollution-level' + identifier).value),
    }
    return formData;
}


const fillUpdateFormWithData = (location) => {
    // Check if the location object is null
    if (!location) {
        console.error('Location data is null');
        alert('Location data not found.');
        return; // Exit the function if location is null
    }

    document.getElementById('fname-update').value = location.name || '';
    document.getElementById('fdesc-update').value = location.desc || '';
    document.getElementById('fstreet-update').value = location.street || '';
    document.getElementById('fpostal-update').value = location.postalCode || '';
    document.getElementById('fcity-update').value = location.city || '';
    document.getElementById('fstate-update').value = location.state || '';
    document.getElementById('flatitude-update').value = location.lat || '';
    document.getElementById('flongitude-update').value = location.lng || '';
    document.getElementById('fpollution-level-update').value = location.pollutionLevel || '';
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
