import { apiClient } from "@/lib/apiClient";

// GET /api/appointments/availability?doctor=<id>&date=YYYY-MM-DD
export const getBookedSlots = (doctor, date) =>
  apiClient.get(`/appointments/availability?doctor=${doctor}&date=${date}`);

// POST /api/appointments  (USER only)
export const createAppointment = ({ doctor, date, startTime, endTime, reason }) =>
  apiClient.post("/appointments", { doctor, date, startTime, endTime, reason });

// GET /api/appointments/my  (optional ?status=)
export const getMyAppointments = (status) =>
  apiClient.get(status ? `/appointments/my?status=${status}` : "/appointments/my");

// GET /api/appointments  (ADMIN only, optional filters)
export const getAllAppointments = ({ status, doctor, patient } = {}) => {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (doctor) params.set("doctor", doctor);
  if (patient) params.set("patient", patient);
  const query = params.toString();
  return apiClient.get(query ? `/appointments?${query}` : "/appointments");
};

// PATCH /api/appointments/:id/status  (DOCTOR or ADMIN)
export const updateStatus = (id, { status, notes }) =>
  apiClient.patch(`/appointments/${id}/status`, { status, notes });

// PATCH /api/appointments/:id/cancel  (USER only)
export const cancelAppointment = (id) =>
  apiClient.patch(`/appointments/${id}/cancel`);

// GET /api/appointments/:id
export const getAppointmentById = (id) => apiClient.get(`/appointments/${id}`);
