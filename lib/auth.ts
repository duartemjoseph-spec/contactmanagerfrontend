const TOKEN_KEY = "contact-manager-token";
const LOGGED_IN_KEY = "contact-manager-logged-in";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LOGGED_IN_KEY, "true");
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return (
    localStorage.getItem(LOGGED_IN_KEY) === "true" &&
    !!localStorage.getItem(TOKEN_KEY)
  );
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGGED_IN_KEY);
}