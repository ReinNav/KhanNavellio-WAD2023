import { asAdmin, asNonAdmin, goToUpdateScreen, goToAddScreen, goToMainScreen } from "./domHelper.js";

var role;

// spa_functionality.js
export function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid credentials!');
        }
    })
    .then(userData => {
    
        goToMainScreen();
        handleRoleSpecificFunctionality(userData.firstname, userData.role);
    })
    .catch(error => {
        alert(error.message);
    });

    return false; // Prevent form submission
}


// Function to handle role-specific functionality
function handleRoleSpecificFunctionality(firstname, role) {
    const welcomeMessageElement = document.getElementById('main-header').querySelector('h1');
    
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Welcome, ${firstname}!`;
    }

    if (role === 'admin') {
        asAdmin();
        document.getElementById('add-btn').onclick = goToAddScreen;
    } else {
        asNonAdmin();
    }
}

function getCurrentRole() {
    return role;
}

export {
    getCurrentRole
}