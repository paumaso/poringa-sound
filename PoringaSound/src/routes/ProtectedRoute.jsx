import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/default" />;
};

export default ProtectedRoute;