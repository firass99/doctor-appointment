import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      }}
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          success: "!bg-success/10 !text-success !border-success/30",
          error: "!bg-destructive/10 !text-destructive !border-destructive/30",
          warning: "!bg-warning/10 !text-warning-foreground !border-warning/30",
          info: "!bg-info/10 !text-info !border-info/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
