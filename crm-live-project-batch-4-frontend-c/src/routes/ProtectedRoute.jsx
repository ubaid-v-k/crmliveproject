import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/authService";

export default function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}
