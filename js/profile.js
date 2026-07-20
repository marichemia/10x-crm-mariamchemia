import {session} from "./shared.js";
import { getUsers } from "./storage.js";
console.log(session) //testing

const nameInputElement = document.getElementById("profile-full-name");
const emailInputElement = document.getElementById("profile-email");
let users = getUsers();

//get current user from active session
let currentUser = users.find(user => user.id === session.userId);

if(currentUser) {
    nameInputElement.value = currentUser.fullName;
    emailInputElement.value = currentUser.email;
}


