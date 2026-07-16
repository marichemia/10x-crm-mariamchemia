import {redirectIfNotAuthenticated} from './guard.js';
import {clearSession, getUsers} from './storage.js';

const session = redirectIfNotAuthenticated();

//display current user name
if (session) {
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    
    if(user) {
        const firstName = user.fullName.split(' ')[0]; //first name only from current session
        const name = document.getElementById('user-name'); //html span that holds the user name
        name.textContent = firstName;
    }
}

//display time and date
const dateElement = document.getElementById('current-date');
const timeElement = document.getElementById('current-time');

function displayDateTime() {
    const currentDate = new Date();

    dateElement.textContent = currentDate.toLocaleDateString();
    timeElement.textContent = currentDate.toLocaleTimeString();
}

displayDateTime();
setInterval(displayDateTime, 1000); //update every sec


//logout and clear session
document.getElementById('logout-button').addEventListener('click', () => {
    clearSession();
    window.location.href = './index.html';
});