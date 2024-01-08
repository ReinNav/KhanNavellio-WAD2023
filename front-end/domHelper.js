import { getLocationByName, updateLocationListItem, updatePinpoint, addLocation, initializeMap } from "./map.js";
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
    const addForm = document.getElementById('add-location-form');
    addForm.removeEventListener('submit', submitAddLocationForm);
    addForm.addEventListener('submit', submitAddLocationForm);
}

const goToMainScreen = () => {
     //await initializeMap();
     hideAllSections();   
    document.getElementById('main-screen').style.display = 'block';
}

const goToLoginScreen = () => {
    hideAllSections();
    document.getElementById('login-screen').style.display = 'flex';
}

const updateFormSubmitHandler = async (event) => {
    event.preventDefault();
    const locationId = event.currentTarget.dataset.locationId;
    const location = await getLocationById(locationId)
    var newData = collectFormSubmission("-update");

    try {

        let oldAddress = `${location.street}, ${location.postalCode}, ${location.city}`;
        let newAddress = `${newData.street}, ${newData.postalCode}, ${newData.city}`;

        if (oldAddress !== newAddress || lat === '' || lng === '' || location.lng !== newData.lng 
            || location.lat !== newData.lat ) {
            const latLng = await geocodeAddress(newAddress);
            console.log(latLng);

            newData.lat = latLng.lat;
            newData.lng = latLng.lng;
        }

        const update = await updateLocationBackend(location, newData);
        updateLocationListItem(locationId, newData, location); // update location list item for ul
        goToMainScreen();
    } catch (error) {
        console.error('Error updating location:', error.message);
        alert('Failed to update location. Please try again.');
    }
};

// Function to update location in the backend
const updateLocationBackend = async (location, newData) => {
    console.log(location)

    fetch(`http://localhost:8000/loc/${location._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update location');
        }
        return response;
    })
    .catch(error => {
        console.error('Error updating location:', error);
        throw error;
    });
};


const submitAddLocationForm = async (event) => {
        event.preventDefault();
    
        const locationData = collectFormSubmission("-add");
        const address = `${locationData.street}, ${locationData.postalCode}, ${locationData.city}`;
    
        try {
            const latLng = await geocodeAddress(address);
            console.log(latLng);

            locationData.lat = latLng.lat;
            locationData.lng = latLng.lng;
    
            console.log(locationData);
            await addLocation(locationData, true);
            clearAddForm();
            goToMainScreen();
        } catch (error) {
            console.log(error.message);
            alert('Geocoding failed. Please check and try the input again.');
        }
    };

const deleteLocationHandler = async (locationId) => {
    if (role === "admin" && locationId) {
        try {
            const response = await fetch(`http://localhost:8000/loc/${locationId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                removeLocationFromList(locationId);
                removeMarkerFromMap(locationId);
            } else {
                throw new Error('Deletion failed');
            }
            goToMainScreen();
        } catch (error) {
            console.error('Error deleting location:', error.message);
            alert('Failed to delete location.');
        }
    }
};



const goToUpdateScreen = async (event) => {
    var clickedLi = event.currentTarget;

    var nameElement = clickedLi.querySelector('.location-title');
    // var streetElement = clickedLi.querySelector('.location-street');
    // var cityElement = clickedLi.querySelector('.location-city');
    // var levelElement = clickedLi.querySelector('.location-level');

    var locationName = nameElement.textContent;
    const locationId = event.currentTarget.dataset.locationId;
    const location = await getLocationById(locationId);

    hideAllSections();
    document.getElementById('update-delete-screen').style.display = 'block';

    fillUpdateFormWithData(location);
    // Show or hide buttons based on the user role
    const submitButton = document.getElementById('submit-button');
    const formTitle = document.getElementById('form-title-update');
    const updateForm = document.getElementById('update-location-form')
    const deleteButton = document.getElementById('delete-btn');

    if (role === "admin") {
        // Show submit and delete buttons for admin
        if (submitButton) submitButton.style.display = 'block';

        if (deleteButton) {
            deleteButton.style.display = 'block';
            deleteButton.type = 'button';
            deleteButton.onclick = (event) => {
                event.stopPropagation(); 
                deleteLocationHandler(locationId);
            };
        }

    } else if (role === "non-admin") {
        // Hide submit and delete buttons for normalo
        if (submitButton) submitButton.style.display = 'none';
        if (deleteButton) deleteButton.style.display = 'none';
        if (formTitle) formTitle.textContent = 'Location Info';
        disableFormFields('update-location-form');
        enableCancelButton();        

    }

    updateForm.dataset.locationId = locationId;

    updateForm.removeEventListener('submit', updateFormSubmitHandler);
    updateForm.addEventListener('submit', updateFormSubmitHandler);
}


async function getLocationById(locationId) {
    try {
        const response = await fetch(`http://localhost:8000/loc/${locationId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching location by ID:', error);
        return null; // Return null in case of error
    }
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

function clearAddForm() {
    const addForm = document.getElementById('add-location-form');
    addForm.reset();
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
    collectFormSubmission,
    clearAddForm,
    getLocationById
}
