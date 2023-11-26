// spa_functionality.js

// Hide all sections except the login screen on initial page load
function hideAllSections() {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

}

// User credentials
const users = {
    admina: { password: 'password', role: 'admin' },
    normalo: { password: 'password', role: 'user' }
};

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        hideAllSections();
        document.querySelector('section[name="main-screen"]').style.display = 'block';
        handleRoleSpecificFunctionality(username, users[username].role);
    } else {
        alert('Invalid credentials!');
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
        document.querySelector('#add-btn').style.display = 'block';
    } else {
        document.querySelector('#add-btn').style.display = 'none';
    }
}

// Add logout functionality
function logout() {
    hideAllSections();
    document.querySelector('section[name="login-screen"]').style.display = 'flex';
}

// Attach event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    hideAllSections();
    document.querySelector('section[name="login-screen"]').style.display = 'flex';

    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.onsubmit = function(event) {
            event.preventDefault();
            login();
        };
    } else {
        console.error("Login form not found");
    }

    const logoutButton = document.querySelector('.btn.secondary-btn');
    if (logoutButton) {
        logoutButton.onclick = logout;
    } else {
        console.error("Logout button not found");
    }
});
