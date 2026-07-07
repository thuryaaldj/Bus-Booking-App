import { Link, useLocation, useNavigate } from "react-router-dom";
import { BusFront, ClipboardList, LogOut, Moon, PlusCircle, Search, Sun, UserRound } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const adminLinks = [
  { name: "Trips", icon: BusFront, path: "/admin/trips" },
  { name: "Add", icon: PlusCircle, path: "/admin/add-trip" },
  { name: "Bookings", icon: ClipboardList, path: "/admin/bookings" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const isAdminArea = location.pathname.startsWith("/admin");
  const role = localStorage.getItem("role");
  const roleLabel = role === "admin" ? "Admin" : "Customer";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-violet-200/70 bg-white/90 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/90 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-white">
            <BusFront size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
              Bus Trips
            </p>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {isAdminArea ? "Admin Dashboard" : "Trip Booking"}
            </h1>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 items-center rounded-2xl border border-violet-100 bg-violet-50 px-4 py-2 text-violet-900 dark:border-white/10 dark:bg-white/5 dark:text-violet-100 md:flex">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search trips, bookings..."
            className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-violet-400 dark:placeholder:text-violet-200/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
              darkMode
                ? "bg-yellow-300 text-yellow-950 hover:bg-yellow-200"
                : "bg-violet-100 text-violet-800 hover:bg-violet-200"
            }`}
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="hidden items-center gap-2 rounded-2xl bg-violet-50 px-3 py-2 text-violet-900 dark:bg-white/5 dark:text-violet-100 sm:flex">
            <UserRound size={18} />
            <span className="text-sm font-semibold">{roleLabel}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-700 text-white transition hover:bg-violet-800"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {isAdminArea && (
        <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-violet-700 text-white"
                    : "bg-violet-50 text-violet-700 dark:bg-white/5 dark:text-violet-100"
                }`}
              >
                <Icon size={17} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
