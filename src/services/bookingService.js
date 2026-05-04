let API_URL;

if (import.meta.env.VITE_NODE_ENV === "production") {
  API_URL = import.meta.env.VITE_API_URL + "/bookings";
} else {
  API_URL = "http://localhost:3000/bookings";
}

export const createBooking = async (booking) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getBookings = async () => {
  const res = await fetch(API_URL, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.output;
};

export const getMyBookings = async () => {
  const res = await fetch(`${API_URL}/me`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteBooking = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateBookingStatus = async ({ id, status }) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateBooking = async (id, booking) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getBooking = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
