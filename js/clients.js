import "./shared.js";
import {initializeClients} from "./clientsData.js";
import { saveClients } from "./storage.js";

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
        clientStatusElement.classList.add("client-card-status", `status-${client.status.toLowerCase()}`);
        clientStatusElement.textContent = client.status;

        //edit and delete buttons
        const clientActionsElement = document.createElement("div");
        clientActionsElement.classList.add("client-card-actions");

        const editClientBtnEelement = document.createElement("button");
        editClientBtnEelement.type = "button";
        editClientBtnEelement.classList.add("edit-client-btn");
        editClientBtnEelement.dataset.clientId = client.id;
        editClientBtnEelement.textContent = "Edit";

        const deleteClientBtnElement = document.createElement("button");
        deleteClientBtnElement.type = "button";
        deleteClientBtnElement.classList.add("delete-client-btn");
        deleteClientBtnElement.dataset.clientId = client.id;
        deleteClientBtnElement.textContent = "Delete";

        clientActionsElement.append(editClientBtnEelement, deleteClientBtnElement);

        clientCardElement.append(clientNameElement, clientCompanyElement, clientEmailElement, clientPhoneElement, clientValueElement, clientStatusElement, clientActionsElement);

        clientsListElement.append(clientCardElement);

    })
}

loadClients();

//search and filter variable
const searchElement = document.getElementById("client-search");
const filterBtnElements = document.querySelectorAll(".status-filter");
const sortElement = document.getElementById("clients-sort");

let activeStatus = "All"; 

//pagination variables
const prevPgBtnElement = document.getElementById("prev-pg-btn");
const nextPgBtnElement = document.getElementById("next-pg-btn");
const pgInfoElement = document.getElementById("pg-info");

let currentPg = 1;
const clientsPerPg = 9;

//create filtered array and display with renderClienlts()
function updateClientList() {
    const searchTerm = searchElement.value.trim().toLowerCase();
    //filter and search
    const filteredClients = clients.filter (client => {
        const matchSearch = client.fullName.toLowerCase().includes(searchTerm) || client.company.toLowerCase().includes(searchTerm);
        const matchStatus = activeStatus === "All" || client.status === activeStatus;

        return matchSearch && matchStatus;
    })
    //sort
    if (sortElement.value === "newest") {
        filteredClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } 
    
    if (sortElement.value === "name") {
        filteredClients.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } 
    
    if (sortElement.value === "value") {
        filteredClients.sort((a, b) => b.value - a.value);
    }
    //pagination
    const totalPgs = Math.max(1, Math.ceil(filteredClients.length / clientsPerPg));

    if(currentPg > totalPgs) {
        currentPg = totalPgs;
    }

    const startIndex = (currentPg - 1) * clientsPerPg;
    const endIndex = startIndex + clientsPerPg;
    const currentPgClients = filteredClients.slice(startIndex, endIndex);
    //display
    renderClients(currentPgClients);
    pgInfoElement.textContent = `Page ${currentPg} of ${totalPgs}`;

    prevPgBtnElement.disabled = currentPg === 1;
    nextPgBtnElement.disabled = currentPg === totalPgs;
}

//add event listeners to search input element, filter buttons, sort dropdown and pagination buttons
searchElement.addEventListener("input", () => {
    currentPg = 1;
    updateClientList();
});

filterBtnElements.forEach(button => {
    button.addEventListener("click", () => {
        activeStatus = button.dataset.status;
        currentPg = 1;

        filterBtnElements.forEach (btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        updateClientList();
    })
})

sortElement.addEventListener("change", () => {
    currentPg = 1;
    updateClientList();
});

prevPgBtnElement.addEventListener("click", () => {
    if (currentPg > 1) {
        currentPg--;
        updateClientList();
    }
})

nextPgBtnElement.addEventListener("click", () => {
    currentPg++;
    updateClientList();
})

//open/close modal window
const addClientBtnElement = document.getElementById("add-client-btn");
const modalWindowElement = document.getElementById("modal-window");
const modalWindowTitleElement = document.getElementById("modal-title");
const closeModalBtnElement = document.getElementById("close-modal-btn");
const clientFormElement = document.getElementById("client-form");

let editingClientId = null;

function openAddClientModal() {
    editingClientId = null;
    modalWindowTitleElement.textContent = "Add Client";
    clientFormElement.reset();
    modalWindowElement.hidden = false;
}

function openEditClientModal(client) {
    editingClientId = client.id;
    modalWindowTitleElement.textContent = "Edit Client";

    clientNameInputElement.value = client.fullName;
    clientEmailInputElement.value = client.email;
    clientPhoneInputElement.value = client.phone;
    clientCompanyInputElement.value = client.company;
    clientStatusInputElement.value = client.status;
    clientValueInputElement.value = client.value;

    modalWindowElement.hidden = false;
}

function closeModalWindow() {
    modalWindowElement.hidden = true;
    editingClientId = null;
}

addClientBtnElement.addEventListener("click", openAddClientModal);
closeModalBtnElement.addEventListener("click", closeModalWindow);


//add client form input fields
const clientNameInputElement = document.getElementById("client-full-name");
const clientEmailInputElement = document.getElementById("client-email");
const clientPhoneInputElement = document.getElementById("client-phone");
const clientCompanyInputElement = document.getElementById("client-company");
const clientStatusInputElement = document.getElementById("client-status");
const clientValueInputElement = document.getElementById("client-value");


clientFormElement.addEventListener("submit", event => {
    console.log("submit works"); //testing
    event.preventDefault();
    //extract form data
    const formData = {
        fullName: clientNameInputElement.value.trim(),
        email: clientEmailInputElement.value.trim(),
        phone: clientPhoneInputElement.value.trim(),
        company: clientCompanyInputElement.value.trim(),
        status: clientStatusInputElement.value.trim(),
        value: Number(clientValueInputElement.value),
    }

    //check if the form is for editing or adding
    if (editingClientId === null) {
        const newClient = {
            id: Date.now(),
            ...formData, 
            createdAt: new Date().toISOString()
        }

        clients.push(newClient);
        currentPg = 1;
    } else {
        const clientIndex = clients.findIndex(client => client.id === editingClientId);
        if (clientIndex !== -1) {
            clients[clientIndex] = {
                ...clients[clientIndex],
                ...formData
            }
        }
    }

    saveClients(clients);
    updateClientList();
    closeModalWindow();

    showToast("Your changes have been saved.");
})

clientsListElement.addEventListener("click", event => {
    const editButton = event.target.closest(".edit-client-btn");
    const deleteButton = event.target.closest(".delete-client-btn");
    //edit
    if (editButton) {
        const clientId = Number(editButton.dataset.clientId);
        const clientToEdit = clients.find(client => client.id === clientId);

        if (clientToEdit) {
            openEditClientModal(clientToEdit);
        }

        return;
    }
    //delete
    if(!deleteButton) {
        return;
    }

    const clientId = Number(deleteButton.dataset.clientId);
    const clientToDelete = clients.find(client => client.id === clientId);
    
    if(!clientToDelete) {
        return;
    }
    //confirm delete window
    const confirmed = window.confirm(`Delete ${clientToDelete.fullName}?`);

    if (!confirmed) {
        return;
    }

    clients = clients.filter(client => client.id !== clientId);

    saveClients(clients);
    updateClientList();
    showToast("Your changes have been saved.");

})

//retry button
const retryBtnElement = document.getElementById("retry-clients-button");
retryBtnElement.addEventListener("click", loadClients);

//toast
const toastElement = document.getElementById("client-toast");
let toastTimeout;

function showToast(message) {
    clearTimeout(toastTimeout);
    toastElement.textContent = message;
    toastElement.hidden = false;

    toastTimeout = setTimeout(() => {
        toastElement.hidden = true;
    }, 2500);
}








