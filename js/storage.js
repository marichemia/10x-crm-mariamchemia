const USERS_KEY = "crm_users";
const SESSION_KEY = "crm_session";
const THEME_KEY = "crm_theme";


export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}