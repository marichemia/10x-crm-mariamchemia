import {session} from "./shared.js";
import { getUsers, saveUsers } from "./storage.js";
console.log(session) //testing

const nameInputElement = document.getElementById("profile-full-name");
const emailInputElement = document.getElementById("profile-email");
let users = getUsers();

//function for displaying error/success messages
function showProfileMsg(element, message, type) {
    element.textContent = message;
    element.classList.remove("success", "error");
    element.classList.add(type);
}

//get current user from active session and display info
let currentUser = users.find(user => user.id === session.userId);
//change name
if(currentUser) {
    nameInputElement.value = currentUser.fullName;
    emailInputElement.value = currentUser.email;
}

const profileInfoElement = document.getElementById("profile-info-form");
const profileInforMsgElement = document.getElementById("profile-info-message");

profileInfoElement.addEventListener("submit", event => {
    event.preventDefault();
    const updatedName = nameInputElement.value.trim();
    //return if the input field is empty
    if(!updatedName) {
        showProfileMsg(profileInforMsgElement, "Name field is empty.", "error");
        return;
    }

    currentUser.fullName = updatedName;
    saveUsers(users);

    nameInputElement.value = updatedName;
    showProfileMsg(profileInforMsgElement, "Your changes have been saved.", "success");
})

//change password
const passwordFormElement = document.getElementById("password-form");
const currentPasswordElement = document.getElementById("current-password");
const newPasswordElement = document.getElementById("new-password");
const conffirmPasswordElement = document.getElementById("confirm-new-password");
const passwordMsgElement = document.getElementById("password-message");



function passwordValidation(password) {
    const minLength = password.length >= 8;
    const includesUpperCase = password !== password.toLowerCase();
    const includesLowerCase = password !== password.toUpperCase();
    const includesNumber = /\d/.test(password);

    return (minLength && includesUpperCase && includesLowerCase && includesNumber);
}

passwordFormElement.addEventListener("submit", event => {
    event.preventDefault();

    const currentPassword = currentPasswordElement.value;
    const newPassword = newPasswordElement.value;
    const confirmedPassword = conffirmPasswordElement.value;

    //cancel if password is wrong or new passwords don't match
    passwordMsgElement.textContent = "";

    if(currentPassword !== currentUser.password) {
        showProfileMsg(passwordMsgElement, "Your current password is incorrect.", "error");
        return;
    }

    if(!passwordValidation(newPassword)){
        showProfileMsg(passwordMsgElement, "Password must contain at least 8 character, inclluding Uppercase, Lowercase and a Number.", "error");
        return;
    }

    if(newPassword !== confirmedPassword) {
        showProfileMsg(passwordMsgElement, "Passwords do not match.", "error");
        return;
    }

    currentUser.password = newPassword;
    saveUsers(users);

    passwordFormElement.reset();
    showProfileMsg(passwordMsgElement, "Your password has been updated.", "success");
})



