import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import DefaultPage from "../pages/DefaultPage/Default";
import Register from "../pages/Register/Register";
import ProtectedRoute from "../routes/ProtectedRoute";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    {<Route path="/" element={<Home />} />}
                </Route>

                {<Route path="/default" element={<DefaultPage />} />}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="*" element={<DefaultPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;