import { useEffect, useState } from "react";
import { useFilteredTrips } from "@/hooks/useFilteredTrips";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/store/useThemeStore";

export default function TripsTemp() {
  const [tripsSource, setTripsSource] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tripBeingEdited, setTripBeingEdited] = useState(null);


  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  const API_BASE = "https://90cc-185-107-56-220.ngrok-free.app/api/Trips";

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await axios.get(API_BASE, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      setTripsSource(data);
    } catch (err) {
      console.error("Error fetching trips:", err);
      toast.error("Failed to fetch trips.");
    }
  };

  const {
    trips,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
    selectedPrice,
    setSelectedPrice,
    fromOptions,
    toOptions,
    priceOptions,
  } = useFilteredTrips(tripsSource);

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_BASE}/${tripBeingEdited.id}`, tripBeingEdited, {
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
      await axios.delete(`${API_BASE}/${tripId}`);
      setTripsSource((prev) => prev.filter((trip) => trip.id !== tripId));
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip.");
    }
  };

  return (
    <div
      className={`p-4 min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* drak / light button*/}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDarkMode}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          } transition`}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-x-4">
        <select
          value={selectedFrom}
          onChange={(e) => setSelectedFrom(e.target.value)}
          className={`border rounded px-3 py-1 ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="">Select From</option>
          {fromOptions.map((from) => (
            <option key={from} value={from}>
              {from}
            </option>
          ))}
        </select>

        <select
          value={selectedTo}
          onChange={(e) => setSelectedTo(e.target.value)}
          className={`border rounded px-3 py-1 ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="">Select To</option>
          {toOptions.map((to) => (
            <option key={to} value={to}>
              {to}
            </option>
          ))}
        </select>

        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          className={`border rounded px-3 py-1 ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="">Max Price</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </select>
      </div>

      {/* Trips List */}
      <ul className="space-y-4">
        {trips.map((trip) => (
          <li
            key={trip.id}
            className={`p-4 rounded-lg shadow-lg transition-colors ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{`Bus #${trip.busNumber}`}</h2>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {`${trip.fromDestination} → ${trip.toDestination}`}
                </p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {`Departure: ${new Date(trip.departureTime).toLocaleString(
                    "en-GB",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}`}
                </p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {`Date: ${new Date(trip.date).toLocaleDateString("en-GB")}`}
                </p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {`Available Seats: ${trip.availableSeats}/${trip.totalSeats}`}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-xl font-bold">{`$${trip.price}`}</p>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setTripBeingEdited(trip);
                    }}
                    className="text-blue-400 hover:text-blue-600 transition"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="text-red-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {isEditing && tripBeingEdited && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl p-6 shadow-2xl w-[90%] max-w-md space-y-4 transition-colors ${
              darkMode
                ? "bg-gray-900 bg-opacity-90 backdrop-blur-md text-white"
                : "bg-white bg-opacity-90 backdrop-blur-md text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold text-center mb-2">Edit Trip</h2>

            <input
              className={`w-full border p-2 rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              type="text"
              placeholder="Bus Number"
              value={tripBeingEdited.busNumber}
              onChange={(e) =>
                setTripBeingEdited({
                  ...tripBeingEdited,
                  busNumber: e.target.value,
                })
              }
            />

            <input
              className={`w-full border p-2 rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              type="text"
              placeholder="From"
              value={tripBeingEdited.fromDestination}
              onChange={(e) =>
                setTripBeingEdited({
                  ...tripBeingEdited,
                  fromDestination: e.target.value,
                })
              }
            />

            <input
              className={`w-full border p-2 rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              type="text"
              placeholder="To"
              value={tripBeingEdited.toDestination}
              onChange={(e) =>
                setTripBeingEdited({
                  ...tripBeingEdited,
                  toDestination: e.target.value,
                })
              }
            />

            <input
              className={`w-full border p-2 rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              type="number"
              placeholder="Price"
              value={tripBeingEdited.price}
              onChange={(e) =>
                setTripBeingEdited({
                  ...tripBeingEdited,
                  price: e.target.value,
                })
              }
            />

            <input
              className={`w-full border p-2 rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              type="date"
              value={tripBeingEdited.date}
              onChange={(e) =>
                setTripBeingEdited({
                  ...tripBeingEdited,
                  date: e.target.value,
                })
              }
            />

            <input
              className={`w-full border p-2 rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              type="datetime-local"
              value={tripBeingEdited.departureTime?.slice(0, 16)}
              onChange={(e) =>
                setTripBeingEdited({
                  ...tripBeingEdited,
                  departureTime: e.target.value,
                })
              }
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsEditing(false);
                  setTripBeingEdited(null);
                }}
              >
                Close
              </button>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
