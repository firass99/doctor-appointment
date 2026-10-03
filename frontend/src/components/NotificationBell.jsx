import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const { items, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications({ poll: true });

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-md p-2 transition-colors hover:bg-muted"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-2 top-16 z-50 rounded-xl border bg-popover shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-88">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Check className="size-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Loading...
              </p>
            )}
            {!loading && items.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </p>
            )}
            {items.slice(0, 8).map((n) => (
              <button
                key={n._id}
                type="button"
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={cn(
                  "flex w-full flex-col gap-1 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50",
                  !n.isRead && "bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.isRead && (
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="text-[11px] text-muted-foreground/70">
                  {timeAgo(n.createdAt)}
                </p>
              </button>
            ))}
          </div>

          <div className="border-t px-4 py-2.5">
            <Link
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
