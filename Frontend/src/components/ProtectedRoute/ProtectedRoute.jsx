import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "./ProtectedRoute.css";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const { user, status } = useSelector((state) => state.auth);

  // Wait for the initial auth fetch before deciding — prevents flash redirect
  if (status === "loading") {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
