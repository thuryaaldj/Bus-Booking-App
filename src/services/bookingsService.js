import axios from "axios";
import { BOOKINGS_API } from "@/config/api";
import { normalizeApiList, normalizeApiRecord } from "@/utils/normalizeApiRecord";

const STORAGE_KEY = "bus-booking-app:bookings";

const readLocalBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocalBookings = (bookings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const shouldUseLocalFallback = (error) => {
  const status = error.response?.status;
  return status === 404 || status === 400;
};

const buildApiPayload = (booking) => ({
  tripId: String(booking.tripId),
  fullName: booking.fullName,
  nationalId: booking.nationalId,
  seatsCount: Number(booking.seatsCount ?? booking.seatCount),
  busNumber: String(booking.busNumber ?? ""),
});

export async function fetchBookings() {
  try {
    const { data } = await axios.get(BOOKINGS_API);
    if (typeof data === "string") {
      return normalizeApiList(readLocalBookings());
    }
    return normalizeApiList(data);
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return normalizeApiList(readLocalBookings());
    }
    throw error;
  }
}

export async function createBooking(booking) {
  const apiPayload = buildApiPayload(booking);

  try {
    const { data } = await axios.post(BOOKINGS_API, apiPayload);
    return normalizeApiRecord(data);
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      const bookings = readLocalBookings();
      const newBooking = normalizeApiRecord({
        ...apiPayload,
        trip: booking.trip || null,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      writeLocalBookings([newBooking, ...bookings]);
      return newBooking;
    }
    throw error;
  }
}

export async function deleteBooking(id) {
  try {
    await axios.delete(`${BOOKINGS_API}/${id}`);
  } catch (error) {
    if (shouldUseLocalFallback(error) || String(id).startsWith("local-")) {
      writeLocalBookings(readLocalBookings().filter((booking) => booking.id !== id));
      return;
    }
    throw error;
  }
}
