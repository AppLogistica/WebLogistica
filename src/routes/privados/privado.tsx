import { Navigate } from "react-router-dom";

// @ts-ignore
export const PrivateRoute = ({ children, redirectTo }) => {
    let isAuthenticated = localStorage.getItem("token") !== null;
    console.log("isAuth: ", isAuthenticated);
    isAuthenticated = false;
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
  };