import {getSession} from './storage.js'; // session key or null

//redirect to dashboard if authorized
export function redirectIfAuthenticated() {
  const session = getSession();
  if (session) {
    window.location.href = "/dashboard.html";
  }
}

//redirect to login if not authorized
export function redirectIfNotAuthenticated() {
  const session = getSession();
  if (!session) {
    window.location.href = "/index.html";
  }
  
  return session;
}