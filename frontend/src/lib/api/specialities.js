import { apiClient } from "@/lib/apiClient";

// GET /api/specialities  (optional ?all=true to include inactive)
export const getSpecialities = (all) =>
  apiClient.get(all ? "/specialities?all=true" : "/specialities");

// GET /api/specialities/:id
export const getSpecialityById = (id) => apiClient.get(`/specialities/${id}`);

// POST /api/specialities  (ADMIN only)
export const createSpeciality = ({ name, description, icon }) =>
  apiClient.post("/specialities", { name, description, icon });

// PUT /api/specialities/:id  (ADMIN only)
export const updateSpeciality = (id, payload) =>
  apiClient.put(`/specialities/${id}`, payload);

// DELETE /api/specialities/:id  (ADMIN only)
export const deleteSpeciality = (id) => apiClient.delete(`/specialities/${id}`);
