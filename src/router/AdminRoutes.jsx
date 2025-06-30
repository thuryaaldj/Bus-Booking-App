import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout"; 
import TripsList from "../pages/admin/TripsList";
import AddTrip from "../pages/admin/AddTrip";
import BookingsList from "../pages/admin/BookingsList";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="trips" element={<TripsList />} />
    <Route path="add-trip" element={<AddTrip />} />
    <Route path="bookings" element={<BookingsList />} />
  </Route>
);
