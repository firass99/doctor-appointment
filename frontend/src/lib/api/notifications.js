import { apiClient } from "@/lib/apiClient";

// GET /api/notifications  (optional ?unread=true&page=&limit=)
export const getMyNotifications = ({ unread, page, limit } = {}) => {
  const params = new URLSearchParams();
  if (unread) params.set("unread", "true");
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  const query = params.toString();
  return apiClient.get(query ? `/notifications?${query}` : "/notifications");
};

// GET /api/notifications/unread-count
export const getUnreadCount = () => apiClient.get("/notifications/unread-count");

// PATCH /api/notifications/read-all
export const markAllAsRead = () => apiClient.patch("/notifications/read-all");

// DELETE /api/notifications/read
export const deleteReadNotifications = () =>
  apiClient.delete("/notifications/read");

// PATCH /api/notifications/:id/read
export const markAsRead = (id) => apiClient.patch(`/notifications/${id}/read`);

// DELETE /api/notifications/:id
export const deleteNotification = (id) => apiClient.delete(`/notifications/${id}`);
