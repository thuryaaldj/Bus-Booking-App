import { useEffect, useState } from "react";
import { useFilteredTrips } from "../hooks/useFilteredTrips";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";

import Navbar from "../components/Navbar"; // استيراد النافبار

export default function TripsTemp() {
  const [tripsSource, setTripsSource] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [seatsCount, setSeatsCount] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await axios.get(
          // "https://90cc-185-107-56-220.ngrok-free.app/api/Trips",
          "https:run.mocky.io/v3/88e30a06-d1f7-4821-be09-cb6f16c79a95",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setTripsSource(data);
      } catch (err) {
        console.error("Error fetching trips:", err);
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
    fromOptions,
    toOptions,
    priceOptions,
  } = useFilteredTrips(tripsSource);

  const handleBookingSubmit = async () => {
    if (!selectedTrip || !fullName || !nationalId || !seatsCount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        "https://90cc-185-107-56-220.ngrok-free.app/api/Bookings",
        {
          tripId: selectedTrip.id,
          fullName,
          nationalId,
          seatCount: Number(seatsCount),
        }
      );

      alert("Your reservation has been completed successfully!");
      setOpen(false);
      setSelectedTrip(null);
      setFullName("");
      setNationalId("");
      setSeatsCount("");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong while booking. Please try again.");
    }
  };

  return (
    <div>
      <Navbar /> {/* عرض النافبار هنا */}
      <div className="p-4">
        <div className="mb-6 space-x-4">
          <select
            value={selectedFrom}
            onChange={(e) => setSelectedFrom(e.target.value)}
            className="border rounded px-3 py-1"
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
            className="border rounded px-3 py-1"
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
            className="border rounded px-3 py-1"
          >
            <option value="">Max Price</option>
            {priceOptions.map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4">
          {trips.map((trip) => (
            <li key={trip.id} className="p-4 bg-white shadow-lg rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{`Bus #${trip.busNumber}`}</h2>
                  <p className="text-sm text-gray-600">{`${trip.fromDestination} → ${trip.toDestination}`}</p>
                  <p className="text-sm text-gray-500">{`Departure: ${trip.departureTime}`}</p>
                  <p className="text-sm text-gray-500">{`Date: ${new Date(
                    trip.date
                  ).toLocaleDateString()}`}</p>
                  <p className="text-sm text-gray-500">{`Available Seats: ${trip.availableSeats}/${trip.totalSeats}`}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{`$${trip.price}`}</p>

                  <Dialog
                    open={!!selectedTrip}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) setSelectedTrip(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="mt-2 text-white bg-violet-600 hover:bg-violet-700 p-2 rounded"
                        onClick={() => setSelectedTrip(trip)}
                      >
                        Book Now
                      </Button>
                    </DialogTrigger>

                    <DialogContent
                      className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
    bg-white/20 backdrop-blur-lg border border-white/30 
    rounded-2xl shadow-2xl w-full max-w-md p-6 text-violet-900"
                    >
                      <DialogHeader>
                        <DialogTitle className="text-black ">
                          Complete your reservation
                        </DialogTitle>
                        <DialogDescription className="text-black">
                          Enter your details to complete your reservation for
                          this trip
                        </DialogDescription>
                      </DialogHeader>

                      {selectedTrip && (
                        <div className="space-y-4">
                          <p>
                            <strong>Trip:</strong>{" "}
                            {selectedTrip.fromDestination} →{" "}
                            {selectedTrip.toDestination}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(selectedTrip.date).toLocaleDateString()}
                          </p>
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="text-black"
                          />
                          <Input
                            id="nationalId"
                            name="nationalId"
                            type="text"
                            placeholder="National ID"
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                            className="text-black"
                          />
                          <Input
                            id="seatsCount"
                            name="seatsCount"
                            type="number"
                            placeholder="Seats Count"
                            min={1}
                            value={seatsCount}
                            onChange={(e) => setSeatsCount(e.target.value)}
                            className="text-black"
                          />
                        </div>
                      )}

                      <DialogFooter>
                        <Button
                          onClick={handleBookingSubmit}
                          className="mt-4 w-full bg-violet-600 text-white"
                        >
                          Submit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
