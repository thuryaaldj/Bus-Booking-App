import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  BusFront,
  CalendarDays,
  Clock,
  FilterX,
  MapPin,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import { useFilteredTrips } from "../hooks/useFilteredTrips";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { TRIPS_API } from "@/config/api";
import { createBooking } from "@/services/bookingsService";
import { formatPriceDisplay, parsePrice } from "@/utils/formatPrice";
import { normalizeApiList } from "@/utils/normalizeApiRecord";
import Navbar from "../components/Navbar";

const inputClass =
  "w-full rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:ring-violet-500/20";

const formatDate = (value) => {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString("en-GB");
};

export default function TripsTemp() {
  const [tripsSource, setTripsSource] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [seatsCount, setSeatsCount] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await axios.get(TRIPS_API, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        setTripsSource(normalizeApiList(data));
      } catch (err) {
        console.error("Error fetching trips:", err);
        toast.error("Failed to load trips.");
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

  const closeBookingDialog = () => {
    setSelectedTrip(null);
    setFullName("");
    setNationalId("");
    setSeatsCount("");
  };

  const handleBookingSubmit = async () => {
    if (!selectedTrip || !fullName || !nationalId || !seatsCount) {
      toast.error("Please fill in all fields.");
      return;
    }

    const seats = Number(seatsCount);
    if (seats < 1) {
      toast.error("Seats count must be at least 1.");
      return;
    }

    if (selectedTrip.availableSeats != null && seats > selectedTrip.availableSeats) {
      toast.error(`Only ${selectedTrip.availableSeats} seats available.`);
      return;
    }

    setIsBooking(true);
    try {
      await createBooking({
        tripId: selectedTrip.id,
        fullName,
        nationalId,
        seatsCount: seats,
        busNumber: selectedTrip.busNumber,
        trip: {
          fromDestination: selectedTrip.fromDestination,
          toDestination: selectedTrip.toDestination,
          date: selectedTrip.date,
          departureTime: selectedTrip.departureTime,
          price: selectedTrip.price,
          busNumber: selectedTrip.busNumber,
        },
      });

      if (selectedTrip.availableSeats != null) {
        try {
          const updatedSeats = Number(selectedTrip.availableSeats) - seats;
          await axios.put(`${TRIPS_API}/${selectedTrip.id}`, {
            busNumber: selectedTrip.busNumber,
            fromDestination: selectedTrip.fromDestination,
            toDestination: selectedTrip.toDestination,
            departureTime: selectedTrip.departureTime,
            date: selectedTrip.date,
            price: Number(selectedTrip.price),
            totalSeats: Number(selectedTrip.totalSeats),
            availableSeats: updatedSeats,
          });
          setTripsSource((prev) =>
            prev.map((trip) =>
              trip.id === selectedTrip.id
                ? { ...trip, availableSeats: updatedSeats }
                : trip
            )
          );
        } catch (updateError) {
          console.error("Failed to update available seats:", updateError);
        }
      }

      toast.success("Your reservation has been completed successfully!");
      closeBookingDialog();
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Something went wrong while booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-slate-950">
      <Navbar />
      <div className="p-4 md:p-8">
        <div className="mb-6 rounded-3xl bg-violet-700 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">
            Customer Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold">Find your next bus trip</h1>
          <p className="mt-2 max-w-2xl text-violet-100">
            Browse available routes, compare prices, and book your seats in a few clicks.
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
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
                From
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
                To
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
                  <Clock className="mb-2 text-violet-700 dark:text-violet-200" size={20} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Departure</p>
                  <p className="font-semibold">{trip.departureTime || "TBA"}</p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-4 dark:bg-white/5">
                  <Users className="mb-2 text-violet-700 dark:text-violet-200" size={20} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Seats</p>
                  <p className="font-semibold">
                    {trip.availableSeats}/{trip.totalSeats}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTrip(trip)}
                  className="flex items-center gap-2 rounded-2xl bg-violet-700 px-5 py-3 font-semibold text-white transition hover:bg-violet-800"
                >
                  <Ticket size={18} />
                  Book Now
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
      </div>

      <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && closeBookingDialog()}>
        <DialogContent className="max-w-lg rounded-3xl border-violet-100 bg-white p-0 dark:border-white/10 dark:bg-slate-900">
          {selectedTrip && (
            <>
              <div className="rounded-t-3xl bg-violet-700 p-6 text-white">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="text-2xl font-bold text-white">
                    Complete your booking
                  </DialogTitle>
                  <DialogDescription className="text-violet-100">
                    Enter your details to reserve seats on this trip.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 rounded-2xl bg-white/15 p-4">
                  <p className="text-sm text-violet-100">Trip route</p>
                  <p className="mt-1 text-lg font-bold">
                    {selectedTrip.fromDestination} to {selectedTrip.toDestination}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-violet-100">
                    <span>Bus #{selectedTrip.busNumber}</span>
                    <span>{formatDate(selectedTrip.date)}</span>
                    <span>
                      {formatPriceDisplay(selectedTrip.price)}
                      {parsePrice(selectedTrip.price) != null && " per seat"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Full Name
                  </span>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    National ID
                  </span>
                  <Input
                    id="nationalId"
                    name="nationalId"
                    type="text"
                    placeholder="Enter your national ID"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Seats Count
                  </span>
                  <Input
                    id="seatsCount"
                    name="seatsCount"
                    type="number"
                    placeholder="How many seats?"
                    min={1}
                    max={selectedTrip.availableSeats || undefined}
                    value={seatsCount}
                    onChange={(e) => setSeatsCount(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <DialogFooter className="pt-2 sm:justify-stretch">
                  <Button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={isBooking}
                    className="h-12 w-full rounded-2xl bg-violet-700 text-base font-semibold text-white hover:bg-violet-800"
                  >
                    {isBooking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
