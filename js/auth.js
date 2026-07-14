import {redirectIfAuthenticated} from './guard.js';
import {getUsers, saveUsers} from './storage.js';

redirectIfAuthenticated();

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
}

function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const company = document.getElementById('company').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Validate full name length and display error message
    const fullNameError = document.getElementById('full-name-error');
    fullNameError.textContent = '';

    if(fullName.length < 3) {
        fullNameError.textContent = 'Full name must be at least 3 characters long.';
    }

    //validate email format and display error message
    const emailError = document.getElementById('email-error');
    emailError.textContent = '';
    
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');
    const isEmailValid = atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;

    if (!isEmailValid) {
        emailError.textContent = 'Please enter a valid email address.';
    }

    //Validate if email already exists and display error message
    const users = getUsers();
    const emailExists = users.some(user => user.email === email);

    if (isEmailValid && emailExists) {
        emailError.textContent = 'Email already exists. Please use a different email.';
    }

    // Validate password length and display error message
    const passwordError = document.getElementById('password-error');
    passwordError.textContent = '';

    const minLength = 8;
    const containsLetter = /[a-zA-Z]/.test(password);
    const containsNumber = /[0-9]/.test(password);
    const isPasswordValid = password.length >= minLength && containsLetter && containsNumber;

    if (!isPasswordValid) {
        passwordError.textContent = 'Password must be at least 8 characters long and contain both letters and numbers.';
    }

    // Validate confirm password and display error message
    const confirmPasswordError = document.getElementById('confirm-password-error');
    confirmPasswordError.textContent = '';

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match.';
    }

    // Stop sign up if there are any validation errors
    const isFormValid = fullName.length >= 3 && isEmailValid && !emailExists && isPasswordValid && password === confirmPassword;

    if (!isFormValid) {
        return;
    }

    // If all fields are valid, log the form data to the console (temporary for testing)
    console.log({ fullName, email, company, password, confirmPassword });

    // Add new user 
    const newUser = {id: Date.now(), fullName, email, company, password, createdAt: new Date().toISOString()};
    users.push(newUser);
    saveUsers(users);

    // display success message, reset form and redirect to login page
    const successMessage = document.getElementById('signup-success');
    successMessage.textContent = 'Account created successfully! Please log in.';

    signupForm.reset();
    setTimeout(() => {
        window.location.href = './index.html';
    }, 1500);
}