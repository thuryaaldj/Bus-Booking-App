import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BusFront, CalendarDays, Edit3, FilterX, MapPin, Search, Trash2, Users, X } from "lucide-react";
import { useFilteredTrips } from "@/hooks/useFilteredTrips";
import { TRIPS_API } from "@/config/api";
import { formatPriceDisplay } from "@/utils/formatPrice";
import { normalizeApiList } from "@/utils/normalizeApiRecord";

const formatDate = (value) => {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString("en-GB");
};

const formatTime = (value) => {
  if (!value) return "No time";
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function TripsList() {
  const [tripsSource, setTripsSource] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tripBeingEdited, setTripBeingEdited] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await axios.get(TRIPS_API, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        setTripsSource(normalizeApiList(data));
      } catch (err) {
        console.error("Error fetching trips:", err);
        toast.error("Failed to fetch trips.");
      }
    };

    fetchTrips();
  }, []);

  const {
    trips,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
    selectedPrice,
    setSelectedPrice,
    clearFilters,
    fromOptions,
    toOptions,
    priceOptions,
  } = useFilteredTrips(tripsSource);

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${TRIPS_API}/${tripBeingEdited.id}`, tripBeingEdited, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTripsSource((prev) =>
        prev.map((trip) =>
          trip.id === tripBeingEdited.id ? tripBeingEdited : trip
        )
      );

      setIsEditing(false);
      setTripBeingEdited(null);
      toast.success("Trip updated successfully!");
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip.");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await axios.delete(`${TRIPS_API}/${tripId}`);
      setTripsSource((prev) => prev.filter((trip) => trip.id !== tripId));
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip.");
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-500/20";

  const totalSeats = tripsSource.reduce(
    (sum, trip) => sum + Number(trip.totalSeats || 0),
    0
  );
  const availableSeats = tripsSource.reduce(
    (sum, trip) => sum + Number(trip.availableSeats || 0),
    0
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-violet-700 p-6 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">
              Trip Management
            </p>
            <h1 className="mt-2 text-3xl font-bold">Trips Overview</h1>
            <p className="mt-2 max-w-2xl text-violet-100">
              Manage routes, prices, departure times, and seat availability from one place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-violet-100">Trips</p>
              <p className="text-2xl font-bold">{tripsSource.length}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-violet-100">Seats</p>
              <p className="text-2xl font-bold">{totalSeats}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-violet-100">Available</p>
              <p className="text-2xl font-bold">{availableSeats}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-200">
            <Search size={20} />
            <h2 className="font-bold">Filter trips</h2>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-100">
              {trips.length} of {tripsSource.length}
            </span>
          </div>

          {(selectedFrom || selectedTo || selectedPrice) && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
            >
              <FilterX size={17} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Departure
            </span>
            <select
              value={selectedFrom}
              onChange={(e) => setSelectedFrom(e.target.value)}
              className={inputClass}
            >
              <option value="">All departures</option>
              {fromOptions.map((from) => (
                <option key={from} value={from}>
                  {from}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Destination
            </span>
            <select
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
              className={inputClass}
            >
              <option value="">All destinations</option>
              {toOptions.map((to) => (
                <option key={to} value={to}>
                  {to}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Max Price
            </span>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className={inputClass}
            >
              <option value="">Any max price</option>
              {priceOptions.map((price) => (
                <option key={price} value={price}>
                  ${price}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {trips.map((trip) => (
          <article
            key={trip.id}
            className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
                  <BusFront size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Bus #{trip.busNumber}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={16} />
                    {trip.fromDestination} to {trip.toDestination}
                  </p>
                </div>
              </div>

              <p className="rounded-2xl bg-violet-700 px-4 py-2 font-bold text-white">
                {formatPriceDisplay(trip.price)}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-violet-50 p-4 dark:bg-white/5">
                <CalendarDays className="mb-2 text-violet-700 dark:text-violet-200" size={20} />
                <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                <p className="font-semibold">{formatDate(trip.date)}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4 dark:bg-white/5">
                <CalendarDays className="mb-2 text-violet-700 dark:text-violet-200" size={20} />
                <p className="text-xs text-slate-500 dark:text-slate-400">Time</p>
                <p className="font-semibold">{formatTime(trip.departureTime)}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-4 dark:bg-white/5">
                <Users className="mb-2 text-violet-700 dark:text-violet-200" size={20} />
                <p className="text-xs text-slate-500 dark:text-slate-400">Seats</p>
                <p className="font-semibold">
                  {trip.availableSeats}/{trip.totalSeats}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setTripBeingEdited(trip);
                }}
                className="flex items-center gap-2 rounded-2xl bg-violet-100 px-4 py-2 font-semibold text-violet-800 transition hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-100"
              >
                <Edit3 size={18} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteTrip(trip.id)}
                className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {trips.length === 0 && (
        <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-10 text-center text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
          No trips match the selected filters.
        </div>
      )}

      {isEditing && tripBeingEdited && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                  Edit Trip
                </p>
                <h2 className="text-2xl font-bold">Bus #{tripBeingEdited.busNumber}</h2>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTripBeingEdited(null);
                }}
                className="rounded-2xl bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["busNumber", "Bus Number", "text"],
                ["fromDestination", "From", "text"],
                ["toDestination", "To", "text"],
                ["price", "Price", "number"],
                ["date", "Date", "date"],
                ["departureTime", "Departure Time", "datetime-local"],
              ].map(([name, label, type]) => (
                <label key={name} className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {label}
                  </span>
                  <input
                    className={inputClass}
                    type={type}
                    value={
                      type === "datetime-local"
                        ? tripBeingEdited[name]?.slice(0, 16) || ""
                        : tripBeingEdited[name] || ""
                    }
                    onChange={(e) =>
                      setTripBeingEdited({
                        ...tripBeingEdited,
                        [name]: e.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
                onClick={() => {
                  setIsEditing(false);
                  setTripBeingEdited(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white transition hover:bg-violet-800"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
