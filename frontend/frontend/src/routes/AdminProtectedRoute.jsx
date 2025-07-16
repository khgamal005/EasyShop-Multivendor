import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AdminProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
      return <Navigate to="/" replace />; // or show a "Not Authorized" page
    }

    return children;
  }

  // Optionally add a loader or null if loading is true
  return null;
};

export default AdminProtectedRoute;
