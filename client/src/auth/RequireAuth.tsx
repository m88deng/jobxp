// auth/RequireAuth.tsx
import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // while Firebase figures out whether the user is signed in — show a loader (avoid redirect flicker)
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    // not signed in — redirect to login and remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
