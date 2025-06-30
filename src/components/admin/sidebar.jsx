import { Link, useLocation } from "react-router-dom";
import { Bus, Plus, ClipboardList } from "lucide-react";
import clsx from "clsx";
import { useThemeStore } from "/src/store/useThemeStore.js";

const Sidebar = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const location = useLocation();

  const menuItems = [
    { name: "Trips", icon: Bus, path: "/admin/trips" },
    { name: "Add Trip", icon: Plus, path: "/admin/add-trip" },
    { name: "Bookings", icon: ClipboardList, path: "/admin/bookings" },
  ];

  return (
    <aside className="w-64 min-h-screen p-6 border-r bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-10 text-violet-700 dark:text-violet-400">Dashboard</h2>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-4 p-3 rounded-md text-base transition-all",
                "text-gray-700 hover:bg-violet-100 dark:text-gray-200 dark:hover:bg-violet-900",
                {
                  "bg-violet-100 text-violet-700 font-semibold dark:bg-violet-700 dark:text-white": isActive,
                }
              )}
            >
              <Icon size={22} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
