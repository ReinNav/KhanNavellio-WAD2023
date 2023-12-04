import { login } from './spa_functionality.js';
import { goToLoginScreen, goToUpdateScreen, goToMainScreen, collectFormSubmission } from './domHelper.js';
import { initializeMap, addLocation } from "./map.js";
import { geocodeAddress } from './geoservice.js';

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

    var locations = document.querySelectorAll('.location-li-item');
    locations.forEach(function(location) {
        location.onclick = goToUpdateScreen;
    });

    document.getElementById('add-location-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = collectFormSubmission("-add");
        console.log(formData);
        if (formData.lat === "" || formData.lng === "") {
            const fullAddress = `${formData.street}, ${formData.postalCode}, ${formData.city}`;

            geocodeAddress(fullAddress)
                .then(latLng => {
                formData.lat = String(latLng.lat);
                formData.lng = String(latLng.lng);
                addLocation(formData);
                goToMainScreen();  
                })
                .catch(error => {
                console.log(error.message);
                alert('Geocoding failed. Please check and try the input again.');
                });
        } else {
            addLocation(formData);
            goToMainScreen();
        }
    });
});