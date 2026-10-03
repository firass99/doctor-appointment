import { apiClient } from "@/lib/apiClient";

// GET /api/users  (admin)
export const getUsers = () => apiClient.get("/users");

// GET /api/users/:id  (admin)
export const getUserById = (id) => apiClient.get(`/users/${id}`);

// PATCH /api/users/:id/role  (admin)
export const updateRole = (id, { role, speciality }) =>
  apiClient.patch(`/users/${id}/role`, { role, speciality });

// DELETE /api/users/:id  (admin)
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
