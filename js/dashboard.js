import {redirectIfNotAuthenticated} from './guard.js';
import {clearSession, getUsers} from './storage.js';

const session = redirectIfNotAuthenticated();

if (session) {
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    
    if(user) {
        const firstName = user.fullName.split(' ')[0]; //first name only from current session
        const name = document.getElementById('user-name'); //html span that holds the user name
        name.textContent = firstName;
    }
}


document.getElementById('logout-button').addEventListener('click', () => {
    clearSession();
    window.location.href = './index.html';
});