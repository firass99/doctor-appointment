import { cn } from "@/lib/utils";

// Matches the semantic colors declared in index.css
const STYLES = {
  PENDING: "bg-warning/15 text-warning-foreground",
  CONFIRMED: "bg-success/15 text-success",
  COMPLETED: "bg-info/15 text-info",
  CANCELLED: "bg-destructive/15 text-destructive",
};

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STYLES[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status?.toLowerCase()}
    </span>
  );
}
