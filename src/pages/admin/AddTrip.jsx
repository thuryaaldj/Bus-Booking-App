import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/store/useThemeStore";

export default function AddTrip() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const [tripData, setTripData] = useState({
    busNumber: "",
    fromDestination: "",
    toDestination: "",
    departureTime: "",
    price: "",
    totalSeats: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingField = Object.entries(tripData).find(([key, value]) => !value);
    if (missingField) {
      toast.error(`Please fill the ${missingField[0]} field.`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://90cc-185-107-56-220.ngrok-free.app/api/Trips",
        tripData,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      toast.success("Trip added successfully!");
      setTripData({
        busNumber: "",
        fromDestination: "",
        toDestination: "",
        departureTime: "",
        price: "",
        totalSeats: "",
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to add the trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 max-w-xl mx-auto rounded-lg shadow-md transition-colors duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-6 text-center text-violet-600 dark:text-violet-400">Add New Trip</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="busNumber"
          value={tripData.busNumber}
          onChange={handleChange}
          placeholder="Bus Number"
          className="w-full border p-2 rounded bg-transparent border-gray-300 dark:border-gray-600"
        />
        <input
          type="text"
          name="fromDestination"
          value={tripData.fromDestination}
          onChange={handleChange}
          placeholder="From"
          className="w-full border p-2 rounded bg-transparent border-gray-300 dark:border-gray-600"
        />
        <input
          type="text"
          name="toDestination"
          value={tripData.toDestination}
          onChange={handleChange}
          placeholder="To"
          className="w-full border p-2 rounded bg-transparent border-gray-300 dark:border-gray-600"
        />
        <input
          type="datetime-local"
          name="departureTime"
          value={tripData.departureTime}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-transparent border-gray-300 dark:border-gray-600"
        />
        <input
          type="number"
          name="price"
          value={tripData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded bg-transparent border-gray-300 dark:border-gray-600"
        />
        <input
          type="number"
          name="totalSeats"
          value={tripData.totalSeats}
          onChange={handleChange}
          placeholder="Total Seats"
          className="w-full border p-2 rounded bg-transparent border-gray-300 dark:border-gray-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Adding..." : "Add Trip"}
        </button>
      </form>
    </div>
  );
}
