let API_URL;

if (import.meta.env.NODE_ENV === "production") {
  API_URL = import.meta.env.VITE_API_URL + "/halls";
} else {
  API_URL = "http://localhost:3000/halls";
}

export const getHalls = async () => {
  const res = await fetch(API_URL, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.output;
};

export const getHall = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const createHall = async (hall) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hall),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateHall = async (id, hall) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hall),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteHall = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getMyHalls = async () => {
  const res = await fetch(`${API_URL}/me`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateHallStatus = async (id, status) => {
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

export const updateHallCapacity = async (id, capacity) => {
  const res = await fetch(`${API_URL}/${id}/capacity`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ capacity }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
