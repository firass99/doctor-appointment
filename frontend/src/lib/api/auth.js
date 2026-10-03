import { apiClient } from "@/lib/apiClient";

const TOKEN_KEY = "token";

// POST /api/users/register
export const register = async ({ name, email, password, phone }) => {
  const data = await apiClient.post("/users/register", {
    name,
    email,
    password,
    phone,
  });
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  return data;
};

// POST /api/users/login
export const login = async ({ email, password }) => {
  const data = await apiClient.post("/users/login", { email, password });
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  return data;
};

// Clears the stored token; there is no backend session to invalidate
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// GET /api/users/me
export const getMe = () => apiClient.get("/users/me");

// PUT /api/users/me
export const updateMe = ({ name, phone, password } = {}) =>
  apiClient.put("/users/me", { name, phone, password });

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => Boolean(getToken());

export const authService = {
  register,
  login,
  logout,
  getMe,
  updateMe,
  getToken,
  isAuthenticated,
};

export default authService;
