import api from "./api";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  // Also set cookie so middleware can read it
  document.cookie = `access_token=${response.data.access_token}; path=/; max-age=1800; SameSite=Lax`;
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    // Clear cookie
    document.cookie = "access_token=; path=/; max-age=0";
    window.location.href = "/login";
  }
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
};