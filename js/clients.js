import "./shared.js";
import {initializeClients} from "./clientsData.js";

const loadingMessageElement = document.getElementById("clients-loading");
const errorMessageElement = document.getElementById("clients-error");
const clientsListElement = document.getElementById("clients-list");

let clients = [];

//load clients and display loading/error messages accordingly
async function loadClients() {
    loadingMessageElement.hidden = false;
    errorMessageElement.hidden = true;

    try {
        clients = await initializeClients();
        loadingMessageElement.hidden = true;
        console.log(clients); //testing
        updateClientList();
    } catch (e) {
        loadingMessageElement.hidden = true;
        errorMessageElement.hidden = false;
        console.log(e);
    }
}


function renderClients(clientArr) {
    clientsListElement.innerHTML = "";
    //if the list is empty
    if (clientArr.length === 0) {
        const emptyMessageElement = document.createElement("p");
        emptyMessageElement.classList.add("clients-message");
        emptyMessageElement.textContent = "No clients found.";

        clientsListElement.append(emptyMessageElement);
        return;
    }

    //if clients exist create a card for each and populate with values
    clientArr.forEach(client => {
        const clientCardElement =  document.createElement("div");
        clientCardElement.classList.add("client-card");

        const clientNameElement = document.createElement("h2");
        clientNameElement.classList.add("client-card-name");
        clientNameElement.textContent = client.fullName;

        const clientCompanyElement = document.createElement("p");
        clientCardElement.classList.add("client-card-detail");
        clientCardElement.textContent = client.company;

        const clientEmailElement = document.createElement("p");
        clientEmailElement.classList.add("client-card-detail");
        clientEmailElement.textContent = client.email;

        const clientPhoneElement = document.createElement("p");
        clientPhoneElement.classList.add("client-card-detail");
        clientPhoneElement.textContent = client.phone;

        const clientValueElement = document.createElement("p");
        clientValueElement.classList.add("client-card-value");
        clientValueElement.textContent = `$${client.value.toLocaleString()}`;

        const clientStatusElement = document.createElement("span");
        clientStatusElement.classList.add("client-card-status");
        clientStatusElement.textContent = client.status;

        clientCardElement.append(clientNameElement, clientCompanyElement, clientEmailElement, clientPhoneElement, clientValueElement, clientStatusElement);

        clientsListElement.append(clientCardElement);

    })
}

loadClients();

//search and filter
const searchElement = document.getElementById("client-search");
const filterBtnElements = document.querySelectorAll(".status-filter");
let activeStatus = "All"; 

//create filtered array
function updateClientList() {
    const searchTerm = searchElement.value.trim().toLowerCase();

    const filteredClients = clients.filter (client => {
        const matchSearch = client.fullName.toLowerCase().includes(searchTerm) || client.company.toLowerCase().includes(searchTerm);
        const matchStatus = activeStatus === "All" || client.status === activeStatus;

        return matchSearch && matchStatus;
    })

    renderClients(filteredClients);
}

//add event listener to search input element
searchElement.addEventListener("input", updateClientList);

//add event listener to all filter buttons
filterBtnElements.forEach(button => {
    button.addEventListener("click", () => {
        activeStatus = button.dataset.status;
        filterBtnElements.forEach (btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        updateClientList();
    })
})


