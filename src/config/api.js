const DEFAULT_API_BASE_URL = "https://6801574981c7e9fbcc4248fc.mockapi.io";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export const TRIPS_API = `${API_BASE_URL}/trips`;
export const BOOKINGS_API = `${API_BASE_URL}/bookings`;
