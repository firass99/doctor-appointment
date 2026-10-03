import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import * as api from "@/lib/api/notifications";
import { useAuth } from "@/hooks/useAuth";

const POLL_MS = 60_000;

export function useNotifications({ poll = false } = {}) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { count } = await api.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // a failed badge refresh shouldn't interrupt the user
    }
  }, [isAuthenticated]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getMyNotifications({ limit: 20 });
      setItems(data.items);
    } catch (error) {
      toast.error(error.message || "Could not load notifications.");
    } finally {
      setLoading(false);
    }
    refreshCount();
  }, [isAuthenticated, refreshCount]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!poll || !isAuthenticated) return;
    const id = setInterval(refreshCount, POLL_MS);
    return () => clearInterval(id);
  }, [poll, isAuthenticated, refreshCount]);

  const markAsRead = async (id) => {
    try {
      await api.markAsRead(id);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (error) {
      toast.error(error.message || "Could not mark as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { updated } = await api.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success(
        updated ? `${updated} notification(s) marked as read.` : "All caught up.",
      );
    } catch (error) {
      toast.error(error.message || "Could not mark all as read.");
    }
  };

  const remove = async (id) => {
    try {
      await api.deleteNotification(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
      refreshCount();
      toast.success("Notification deleted.");
    } catch (error) {
      toast.error(error.message || "Could not delete notification.");
    }
  };

  const clearRead = async () => {
    try {
      const { deleted } = await api.deleteReadNotifications();
      setItems((prev) => prev.filter((n) => !n.isRead));
      toast.success(
        deleted ? `${deleted} read notification(s) deleted.` : "Nothing to clear.",
      );
    } catch (error) {
      toast.error(error.message || "Could not clear notifications.");
    }
  };

  return {
    items,
    unreadCount,
    loading,
    refresh,
    markAsRead,
    markAllAsRead,
    remove,
    clearRead,
  };
}
