import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import DefaultPage from "../pages/DefaultPage/Default";
import Register from "../pages/Register/Register";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>

                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/default" element={<DefaultPage />} />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to={isAuthenticated ? "/home" : "/default"} />}
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;