import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Keeps signed-in users out of /login and /register
export default function GuestRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
