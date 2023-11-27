import { login } from './spa_functionality.js';
import { collectFormSubmission, goToLoginScreen, goToMainScreen } from './domHelper.js';
import { geocodeAddress } from './geoservice.js';
import { addLocation, initializeMap } from "./map.js";

document.addEventListener('DOMContentLoaded', function() {
    // Hide all sections except login
    initializeMap();
    goToLoginScreen();

    // Setup login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.onsubmit = function(event) {
            event.preventDefault();
            login();
        };
    }

    const logoutButton = document.querySelector('.btn.secondary-btn');
    if (logoutButton) {
        logoutButton.onclick = goToLoginScreen;
    }

    document.getElementById('add-location-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = collectFormSubmission();
        const fullAddress = `${formData.street}, ${formData.postalCode}, ${formData.city}`;

        geocodeAddress(fullAddress)
            .then(latLng => {
              formData.lat = latLng.lat;
              formData.lng = latLng.lng;  
              addLocation(formData);
              goToMainScreen();
            })
            .catch(error => {
                console.log(error.message);
              alert('Geocoding failed. Please check and try the input again.');
            });
    });
});