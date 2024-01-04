import { login } from './spa_functionality.js';
import { goToLoginScreen, goToUpdateScreen, goToMainScreen, collectFormSubmission } from './domHelper.js';
import { initializeMap, addLocation } from "./map.js";
import { geocodeAddress } from './geoservice.js';

document.addEventListener('DOMContentLoaded', function() {
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

    document.getElementById('add-location-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        var formData = collectFormSubmission("-add");

        if (validateAndProcessFormData(formData)) {
            try {
                const response = await postLocationToBackend(formData);
                if (response.ok) {
                    addLocation(formData, true); // true indicates it's a new location
                    goToMainScreen();
                    clearAddForm();
                } else {
                    throw new Error('Failed to add location.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
            }
        }
    });
});

function clearAddForm() {
    const addForm = document.getElementById('add-location-form');
    addForm.reset();
}

function validateAndProcessFormData(formData) {
    formData.lat = formData.lat ? parseFloat(formData.lat) : null;
    formData.lng = formData.lng ? parseFloat(formData.lng) : null;

    if (isNaN(formData.lat) || isNaN(formData.lng)) {
        console.error('Invalid coordinates:', formData.lat, formData.lng);
        alert('Invalid coordinates. Please enter valid latitude and longitude values.');
        return false;
    }
    return true;
}

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