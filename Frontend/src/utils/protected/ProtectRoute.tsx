import type React from "react";

import type { RootState } from "../../store/store"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated,loading } = useSelector(
    (state: RootState) => state.auth
  );
  if (loading) return <div>Checking session...</div>;


  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;