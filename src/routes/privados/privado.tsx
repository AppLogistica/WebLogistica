import { Navigate } from "react-router-dom";

// @ts-ignore
export const PrivateRoute = ({ children, redirectTo }) => {
   const isAuthenticated = true;
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };