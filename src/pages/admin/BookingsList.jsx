import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CalendarDays, MapPin, Ticket, Trash2, UserRound, Users } from "lucide-react";
import { deleteBooking, fetchBookings } from "@/services/bookingsService";
import { formatPriceDisplay } from "@/utils/formatPrice";

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to fetch bookings.");
      }
    };

    fetchBookingsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      toast.success("Booking deleted successfully.");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      toast.error("Failed to delete booking.");
    }
  };

  const totalSeats = bookings.reduce(
    (sum, booking) => sum + Number(booking.seatsCount || booking.seatCount || 0),
    0
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-violet-700 p-6 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">
              Booking Management
            </p>
            <h1 className="mt-2 text-3xl font-bold">All Bookings</h1>
            <p className="mt-2 max-w-2xl text-violet-100">
              Review passenger reservations, seat counts, and trip details.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-violet-100">Bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="text-violet-100">Seats</p>
              <p className="text-2xl font-bold">{totalSeats}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {bookings.map((booking) => {
          const passengerName = booking.fullName || booking.username || "Passenger";
          const seatsCount = booking.seatsCount || booking.seatCount || 0;

          return (
            <article
              key={booking.id}
              className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-violet-100 dark:bg-violet-500/10" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
                    <Ticket size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{passengerName}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Booking #{booking.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(booking.id)}
                  className="relative rounded-2xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300"
                  title="Delete Booking"
                >
                  <Trash2 size={19} />
                </button>
              </div>

              <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={UserRound}
                  label="National ID"
                  value={booking.nationalID || booking.nationalId || "Unavailable"}
                />
                <InfoItem icon={Users} label="Seats Count" value={seatsCount} />
                <InfoItem
                  icon={Ticket}
                  label="Trip ID"
                  value={booking.tripId || "Unavailable"}
                />
                <InfoItem
                  icon={Ticket}
                  label="Bus Number"
                  value={booking.busNumber || booking.trip?.busNumber || "Unavailable"}
                />
              </div>

              {booking.trip ? (
                <div className="relative mt-5 rounded-2xl bg-violet-50 p-4 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2 text-violet-700 dark:text-violet-200">
                    <MapPin size={18} />
                    <span className="font-semibold">
                      {booking.trip.fromDestination} to {booking.trip.toDestination}
                    </span>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CalendarDays size={16} />
                      {booking.trip.date || "No date"}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Time: {booking.trip.departureTime || "No time"}
                    </span>
                    <span className="font-semibold text-violet-700 dark:text-violet-200">
                      {formatPriceDisplay(booking.trip.price, "$0")}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
                  Trip details unavailable
                </div>
              )}
            </article>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-10 text-center text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
          No bookings found.
        </div>
      )}
    </section>
  );
}

function InfoItem({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
      <IconComponent className="mb-2 text-violet-700 dark:text-violet-200" size={19} />
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
