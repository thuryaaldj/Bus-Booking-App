import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import {useThemeStore} from "../store/useThemeStore"



const AdminLayout = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
 return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 text-gray-900 dark:text-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
