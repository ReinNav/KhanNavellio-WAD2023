import { login, logout } from './spa_functionality.js';
import { collectFormSubmission, hideAllSections } from './domHelper.js';
import { geocodeAddress } from './geoservice.js';
import { addLocation, initializeMap } from "./map.js";

document.addEventListener('DOMContentLoaded', function() {
    // Hide all sections except login
    initializeMap();
    hideAllSections();
    document.querySelector('section[name="login-screen"]').style.display = 'flex';

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
        logoutButton.onclick = logout;
    }

    document.getElementById('add-location-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = collectFormSubmission();
        const fullAddress = `${formData.street}, ${formData.postalCode}, ${formData.city}`;

        geocodeAddress(fullAddress)
            .then(latLng => {
              formData.lat = latLng.lat;
              formData.lng = latLng.lng  
              addLocation(formData)
              hideAllSections();
              document.querySelector('section[name="main-screen"]').style.display = 'block';
            })
            .catch(error => {
              alert('Geocoding failed. Please check and try the input again.');
            });
    });
});