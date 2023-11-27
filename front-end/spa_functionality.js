import { asAdmin, asNonAdmin, goToLoginScreen, goToAddScreen, goToMainScreen } from "./domHelper.js";

// User credentials
const admina = {username: "admina", password: "password", role:"admin"};
const normalo = {username: "normalo", password: "password", role:"non-admin"};

// Login function
export function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === admina.username && password === admina.password) {
        goToMainScreen();
        handleRoleSpecificFunctionality(username, 'admin');
    } else if (username === normalo.username && password === normalo.password) {
        goToMainScreen();
        handleRoleSpecificFunctionality(username, 'non-admin');
    } else {
        alert('Invalid credentials!')
    }

    return false; // Prevent form submission
}

// Function to handle role-specific functionality
function handleRoleSpecificFunctionality(username, role) {
    const welcomeMessageElement = document.getElementById('main-header').querySelector('h1');
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Welcome, ${username}!`;
    }

    if (role === 'admin') {
        asAdmin();
        document.getElementById('add-btn').onclick = goToAddScreen;
    } else {
        asNonAdmin();
    }
}