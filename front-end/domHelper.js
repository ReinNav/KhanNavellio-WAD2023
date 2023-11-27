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

const asAdmin = () => {
    showElement('add-btn');
}

const asNonAdmin = () => {
    hideElement('add-btn');
}

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

const collectFormSubmission = () => {

    var formData = {
        name: document.getElementById('fname').value,
        street: document.getElementById('fstreet').value,
        postalCode: document.getElementById('fpostal').value,
        city: document.getElementById('fcity').value,
        state: document.getElementById('fstate').value,
        lat: document.getElementById('flatitude').value,
        lng: document.getElementById('flongitude').value,
        pollutionLevel: document.getElementById('fpollution-level').value,
    }

    console.log(formData);
    return formData;
}

export {
    asAdmin,
    asNonAdmin,
    goToAddScreen,
    goToMainScreen,
    goToLoginScreen,
    hideAllSections,
    collectFormSubmission
}
