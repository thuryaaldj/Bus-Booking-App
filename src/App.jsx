import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TripsTemp from "./pages/TripsTemp";
import { adminRoutes } from "./router/AdminRoutes";
import ProtectedRoute from "./router/ProtectedRoute";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["admin", "customer"]} />}>
          <Route path="/trips" element={<TripsTemp />} />
        </Route>
        {adminRoutes}
      </Routes>
    </>
  );
}


export default App;