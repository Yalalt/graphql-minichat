import jwtDecode from "jwt-decode";

const API_URL = "http://localhost:9001";

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    return null;
  }

  const { token } = await response.json();

  localStorage.setItem("chat_app_token", token);
  return username;
}

export function getLoggedUserFromToken() {
  const token = localStorage.getItem("chat_app_token");

  if (token) {
    const data = jwtDecode(token);
    return data.sub;
  }

  return null;
}
