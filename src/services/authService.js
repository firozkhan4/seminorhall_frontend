let API_URL;
if (import.meta.env.VITE_NODE_ENV === "production") {
  API_URL = import.meta.env.VITE_API_URL + "/auth";
} else {
  API_URL = "http://localhost:3000/auth";
}

export const login = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const signup = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const logout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const checkAuth = async () => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
