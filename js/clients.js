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
        renderClients(clients);
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
