import {redirectIfNotAuthenticated} from './guard.js';
import {clearSession, getUsers, getTheme, saveTheme, getClients} from './storage.js';
import {initializeClients} from "./clientsData.js";

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
setInterval(displayDateTime, 1000); 

//toggle between light and dark themes
const toggleBtn = document.getElementById("theme-toggle");
const savedTheme = getTheme();

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    toggleBtn.classList.add("active");
}

toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");

    toggleBtn.classList.toggle("active", isDark);
    saveTheme(isDark ? "dark" : "light");
})

//logout and clear session
document.getElementById('logout-button').addEventListener('click', () => {
    clearSession();
    window.location.href = './index.html';
});

//get clients list
const clients = await initializeClients();

//set client number
const totalClientsElement = document.getElementById("total-clients");
totalClientsElement.textContent = clients.length;

//set active deals number
const activeDeals = clients.filter(client => {
    return client.status === "Lead" || client.status === "Contacted";
})
const activeDealsElement = document.getElementById("active-deals");
activeDealsElement.textContent = activeDeals.length;

//set won revenue value
const wonRevenue = clients.filter(client => client.status === "Won").reduce((total, client) => {
    return total + client.value;
}, 0);
const wonRevenueElement = document.getElementById("won-revenue");
wonRevenueElement.textContent = `${wonRevenue.toLocaleString()}`;

//set new this week value
const pastWeek = Date.now() - 7 * 24 * 60 * 6 * 1000;
const clientsThisWeek = clients.filter(client => {
    const clientCreatedAt = new Date(client.createdAt).getTime();
    return clientCreatedAt >= pastWeek;
})
const clientsThisWeekElement = document.getElementById("new-this-week");
clientsThisWeekElement.textContent = clientsThisWeek.length;
