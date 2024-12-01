import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: JSX.Element;
  role: "student" | "instructor" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  interface User {
    role: "student" | "instructor" | "admin";
  }

  const user: User = jwtDecode<User>(token);

  if (user.role !== role) {
    let redirectPath = "/";
    if (role === "admin") {
      redirectPath = "/admin";
    } else if (role === "instructor") {
      redirectPath = "/instructor";
    } else if (role === "student") {
      redirectPath = "/student";
    }
    return <Navigate to={redirectPath} state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
