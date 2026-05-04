import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react"; // Added useEffect
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Halls from "./pages/Halls";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { useStore } from "./assets/stores/useStore";
import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "./services/authService";

export default function App() {
  const { user, setUser } = useStore();

  const { isLoading, data, isError } = useQuery({
    queryKey: ["user"],
    queryFn: checkAuth,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg font-sans">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-bg text-ink font-sans flex flex-col overflow-hidden">
        {user && <Navbar user={user} setUser={setUser} />}
        <div className="flex flex-1 overflow-hidden">
          {user && <Sidebar user={user} />}
          <main
            className={user ? "flex-1 overflow-y-auto bg-surface" : "w-full"}
          >
            <div className={user ? "max-w-[1400px] mx-auto p-6" : ""}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    !user ? <Login setUser={setUser} /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="/register"
                  element={
                    !user ? <Register setUser={setUser} /> : <Navigate to="/" />
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={user ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/bookings"
                  element={user ? <Bookings /> : <Navigate to="/login" />}
                />
                <Route
                  path="/halls"
                  element={user ? <Halls /> : <Navigate to="/login" />}
                />

                {/* Admin Route */}
                <Route
                  path="/admin"
                  element={
                    user?.role === "admin" ? <Admin /> : <Navigate to="/" />
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}
