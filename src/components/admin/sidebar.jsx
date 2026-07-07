import { Link, useLocation } from "react-router-dom";
import { BusFront, ClipboardList, LayoutDashboard, PlusCircle } from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { name: "Trips", description: "Manage routes", icon: BusFront, path: "/admin/trips" },
  { name: "Add Trip", description: "Create schedule", icon: PlusCircle, path: "/admin/add-trip" },
  { name: "Bookings", description: "Passenger orders", icon: ClipboardList, path: "/admin/bookings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-violet-200/70 bg-white/90 p-5 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 lg:block">
      <div className="mb-8 rounded-3xl bg-violet-700 p-5 text-white">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <LayoutDashboard size={26} />
        </div>
        <p className="text-sm font-medium text-violet-100">Admin Dashboard</p>
        <h2 className="mt-1 text-2xl font-bold">Bus Trips</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all",
                isActive
                  ? "bg-violet-100 text-violet-800 shadow-sm dark:bg-violet-500/20 dark:text-violet-100"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <span
                className={clsx(
                  "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-violet-700 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700 dark:bg-white/10 dark:text-slate-300"
                )}
              >
                <Icon size={21} />
              </span>
              <span>
                <span className="block font-semibold">{item.name}</span>
                <span className="text-xs opacity-70">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
