import { apiClient } from "@/lib/apiClient";

// GET /api/doctors  (optional ?speciality=<id>)
export const getDoctors = (speciality) =>
  apiClient.get(speciality ? `/doctors?speciality=${speciality}` : "/doctors");

// GET /api/doctors/me  (DOCTOR only)
export const getMyProfile = () => apiClient.get("/doctors/me");

// PUT /api/doctors/me  (DOCTOR only)
export const updateMyProfile = (payload) =>
  apiClient.put("/doctors/me", payload);

// POST /api/doctors  (ADMIN only)
export const createDoctor = (payload) => apiClient.post("/doctors", payload);

// PATCH /api/doctors/:id/active  (ADMIN only)
export const setDoctorActive = (id, isActive) =>
  apiClient.patch(`/doctors/${id}/active`, { isActive });

// GET /api/doctors/:id/slots?date=YYYY-MM-DD
export const getDoctorSlots = (id, date) =>
  apiClient.get(`/doctors/${id}/slots?date=${date}`);

// GET /api/doctors/:id
export const getDoctorById = (id) => apiClient.get(`/doctors/${id}`);
