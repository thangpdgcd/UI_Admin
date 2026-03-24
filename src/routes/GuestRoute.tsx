import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (token && user) {
    if (user.role === "admin") {
      return <Navigate to="/system/dashboard" replace />;
    }
    if (user.role === "staff") {
      return <Navigate to="/system/orders" replace />;
    }
    return <Navigate to="/system/dashboard" replace />;
  }

  return <>{children}</>;
}
