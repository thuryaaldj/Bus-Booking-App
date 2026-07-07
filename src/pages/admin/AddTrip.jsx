import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowRight, CalendarClock, PlusCircle } from "lucide-react";
import { TRIPS_API } from "@/config/api";

const initialTripData = {
  busNumber: "",
  fromDestination: "",
  toDestination: "",
  departureTime: "",
  price: "",
  totalSeats: "",
};

export default function AddTrip() {
  const [tripData, setTripData] = useState(initialTripData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingField = Object.entries(tripData).find(([, value]) => !value);
    if (missingField) {
      toast.error(`Please fill the ${missingField[0]} field.`);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        TRIPS_API,
        {
          ...tripData,
          availableSeats: Number(tripData.totalSeats),
          price: Number(tripData.price),
          totalSeats: Number(tripData.totalSeats),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      toast.success("Trip added successfully!");
      setTripData(initialTripData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add the trip.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-500/20";

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-violet-700 p-6 text-white md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">
            Trip Management
          </p>
          <h1 className="mt-2 text-3xl font-bold">Add New Trip</h1>
          <p className="mt-2 max-w-2xl text-violet-100">
            Create a new bus route with departure time, price, and seat capacity.
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
          <PlusCircle size={28} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Bus Number
              </span>
              <input
                type="text"
                name="busNumber"
                value={tripData.busNumber}
                onChange={handleChange}
                placeholder="BUS-101"
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Departure Time
              </span>
              <input
                type="datetime-local"
                name="departureTime"
                value={tripData.departureTime}
                onChange={handleChange}
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                From
              </span>
              <input
                type="text"
                name="fromDestination"
                value={tripData.fromDestination}
                onChange={handleChange}
                placeholder="Starting city"
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                To
              </span>
              <input
                type="text"
                name="toDestination"
                value={tripData.toDestination}
                onChange={handleChange}
                placeholder="Arrival city"
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Price
              </span>
              <input
                type="number"
                name="price"
                value={tripData.price}
                onChange={handleChange}
                placeholder="45"
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Total Seats
              </span>
              <input
                type="number"
                name="totalSeats"
                value={tripData.totalSeats}
                onChange={handleChange}
                placeholder="52"
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PlusCircle size={20} />
            {loading ? "Adding trip..." : "Add Trip"}
          </button>
        </form>

        <aside className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
            <CalendarClock size={24} />
          </div>
          <h2 className="text-xl font-bold">Trip Preview</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Review the route before adding it to the system.
          </p>

          <div className="mt-6 rounded-2xl bg-violet-50 p-4 dark:bg-white/5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Route</p>
            <div className="mt-2 flex items-center gap-3 text-lg font-bold text-violet-800 dark:text-violet-100">
              <span>{tripData.fromDestination || "From"}</span>
              <ArrowRight size={18} />
              <span>{tripData.toDestination || "To"}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Bus</p>
              <p className="font-bold">{tripData.busNumber || "Not set"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Seats</p>
              <p className="font-bold">{tripData.totalSeats || "0"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Price</p>
              <p className="font-bold">${tripData.price || "0"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-slate-500 dark:text-slate-400">Time</p>
              <p className="font-bold">{tripData.departureTime ? "Ready" : "Not set"}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
