import { Navigate } from "react-router-dom";
import { useContext } from "react";
import DefaultPage from "../pages/DefaultPage/Default";
import { AuthContext }  from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext); // Verifica si el usuario está autenticado

    if (!isAuthenticated) {
        return <Navigate to="/default" />;
    } 

    return children;
};

export default ProtectedRoute;