import {redirectIfNotAuthenticated} from './guard.js';
import {clearSession} from './storage.js';

redirectIfNotAuthenticated();

document.getElementById('logout-button').addEventListener('click', () => {
    clearSession();
    window.location.href = './index.html';
});