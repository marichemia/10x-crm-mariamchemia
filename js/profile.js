import {session} from "./shared.js";
import { getUsers, saveUsers } from "./storage.js";
console.log(session) //testing

const nameInputElement = document.getElementById("profile-full-name");
const emailInputElement = document.getElementById("profile-email");
let users = getUsers();

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
        profileInfoElement.textContent = "Name field is empty.";
        return;
    }

    currentUser.fullName = updatedName;
    saveUsers(users);

    nameInputElement.value = updatedName;
    profileInforMsgElement.textContent = "Your changes have been saved.";
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

    return hasMinimumLength && hasUppercase && hasLowercase && hasNumber;
}

passwordFormElement.addEventListener("submit", event => {
    event.preventDefault();

    const currentPassword = currentPasswordElement.value;
    const newPassword = newPasswordElement.value;
    const confirmedPassword = conffirmPasswordElement.value;

    //cancel if password is wrong or new passwords don't match
    passwordMsgElement.textContent = "";

    if(currentPassword !== currentPassword.password) {
        passwordMsgElement.textContent = "Your current password is incorrect."
        return;
    }

    if(newPassword !== confirmedPassword) {
        passwordMsgElement.textContent = "Passwords do not match."
        return;
    }

    currentUser.password = newPassword;
    saveUsers(users);

    passwordFormElement.reset();
    passwordMsgElement.textContent = "Your password has been updated."
})

