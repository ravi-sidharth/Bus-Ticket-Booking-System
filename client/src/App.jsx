import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BusDetails from "./pages/BusDetails";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css'
import DLValidation from "./components/kyc/DLValidation";
import IDValidation from "./components/kyc/IDValidation";
import SelfieValidation from "./components/kyc/SelfieValidation";
import KYCSuccess from "./components/kyc/KYCSuccess";
import KYCFail from "./components/kyc/KYCFail";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<DLValidation />} />
      <Route path="/kyc/id-validation" element={<IDValidation />} />
      <Route path="/kyc/selfie" element={<SelfieValidation />} />
      <Route path="/kyc/success" element={<KYCSuccess />} />
      <Route path="/kyc/fail" element={<KYCFail />} />
\       <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bus/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <BusDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <Navbar />
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Navbar />
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
