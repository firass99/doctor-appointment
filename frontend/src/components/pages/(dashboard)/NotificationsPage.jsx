import { Check, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function NotificationsPage() {
  const { items, unreadCount, loading, markAsRead, markAllAsRead, remove, clearRead } =
    useNotifications();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification(s).`
              : "You're all caught up."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={unreadCount === 0}
            onClick={markAllAsRead}
          >
            <Check className="size-4" />
            Mark all read
          </Button>
          <Button size="sm" variant="outline" onClick={clearRead}>
            <Trash2 className="size-4" />
            Clear read
          </Button>
        </div>
      </div>

      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No notifications yet. Book an appointment and we'll keep you posted.
        </p>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-6 space-y-3">
          {items.map((n) => (
            <Card key={n._id} className={cn(!n.isRead && "ring-primary/30")}>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.isRead && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!n.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(n._id)}
                    >
                      Mark read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(n._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
