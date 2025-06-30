import React from "react";
import { Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";


export default function Navbar() {
  const navigate = useNavigate();

  const darkMode = useThemeStore((state) => state.darkMode);
const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-violet-800 text-white px-6 py-4 flex items-center justify-between shadow-md">

      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="text-xl font-semibold">Bus Trips</span>
      </div>

      <div className="flex items-center bg-violet-300 px-3 py-1 rounded-md w-full max-w-md mx-6">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent text-violet-900 outline-none w-full placeholder-violet-950"
        />
        <Search className="text-violet-900" size={18} />
      </div>


      <div className="flex items-center space-x-6">

      <button
  onClick={toggleDarkMode}
  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
    ${darkMode ? "bg-yellow-400 text-yellow-900" : "bg-blue-900 text-blue-200"}
    hover:scale-105 active:scale-95`}
  title="Toggle Theme"
>
  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
</button>

        <User className="hover:text-violet-950 cursor-pointer" />
        <LogOut
          onClick={handleLogout}
          className="hover:text-violet-950 cursor-pointer"
        />
      </div>
    </nav>
  );
}
