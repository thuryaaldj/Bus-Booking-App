import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import TripsTemp from './pages/TripsTemp';
import { adminRoutes } from "./router/AdminRoutes";
import { Toaster } from "react-hot-toast"; 


function App() {
  return (
    <>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/trips" element={<TripsTemp />} />
        {adminRoutes}
      </Routes>
    </>
  );
}


export default App;