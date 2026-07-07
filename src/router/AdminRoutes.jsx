import { Navigate, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import TripsList from "../pages/admin/TripsList";
import AddTrip from "../pages/admin/AddTrip";
import BookingsList from "../pages/admin/BookingsList";
import ProtectedRoute from "./ProtectedRoute";

export const adminRoutes = (
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="trips" replace />} />
      <Route path="trips" element={<TripsList />} />
      <Route path="add-trip" element={<AddTrip />} />
      <Route path="bookings" element={<BookingsList />} />
    </Route>
  </Route>
);
