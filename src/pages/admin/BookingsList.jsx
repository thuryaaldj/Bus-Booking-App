
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        "https://90cc-185-107-56-220.ngrok-free.app/api/Bookings",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://90cc-185-107-56-220.ngrok-free.app/api/Bookings/${id}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 relative"
          >
            {/* زر الحذف */}
            <button
              onClick={() => handleDelete(booking.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete Booking"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-2">
              {booking.username}'s Booking
            </h2>
            <p>
              <span className="font-medium">Full Name:</span> {booking.fullName}
            </p>
            <p>
              <span className="font-medium">National ID:</span> {booking.nationalID}
            </p>
            <p>
              <span className="font-medium">Trip Id:</span> {booking.tripId}
            </p>
            <p>
              <span className="font-medium">Bus Number:</span> {booking.busNumber}
            </p>

            {booking.trip ? (
              <>
                <p>
                  <span className="font-medium">From:</span>{" "}
                  {booking.trip.fromDestination}
                </p>
                <p>
                  <span className="font-medium">To:</span>{" "}
                  {booking.trip.toDestination}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {booking.trip.date}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {booking.trip.departureTime}
                </p>
                <p>
                  <span className="font-medium">Price:</span> {booking.trip.price}
                </p>
              </>
            ) : (
              <p className="text-red-500">Trip details unavailable</p>
            )}

            <p>
              <span className="font-medium">Seats Count:</span>{" "}
              {booking.seatsCount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
