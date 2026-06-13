import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarDetail from './pages/CarDetail';
import Settings from './pages/Settings';
import { ChangePassword } from './pages/ChangePassword';
import Cars from './pages/Cars';
import Drivers from './pages/Driver';
import 'leaflet/dist/leaflet.css';
import './App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <PrivateRoute>
            <CarDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <PrivateRoute>
            <ChangePassword />
          </PrivateRoute>
        }
      />
      <Route
        path="/carslist"
        element={
          <PrivateRoute>
            <Cars />
          </PrivateRoute>
        }
      />
      <Route
        path="/driverslist"
        element={
          <PrivateRoute>
            <Drivers />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
