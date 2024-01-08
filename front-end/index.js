import { login } from './spa_functionality.js';
import { goToLoginScreen } from './domHelper.js';
import { initializeMap } from "./map.js";

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
});