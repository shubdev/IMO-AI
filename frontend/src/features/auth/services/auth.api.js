import { API_BASE_URL } from "../../../config/config";

export async function registerUser(fullname, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fullname, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Network error occurred" };
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error occurred" };
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include",
    });
    if (!response.ok) {
      return { success: false };
    }
    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    return { success: false };
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}
