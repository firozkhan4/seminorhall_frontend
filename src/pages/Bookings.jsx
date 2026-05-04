import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock4,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { getBookings } from "../services/bookingService";
import { useQuery } from "@tanstack/react-query";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  const { isLoading, data } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setBookings(data);
      setLoading(false);
    }
  }, [data]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    await fetch(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchMyBookings();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-green-500/20 text-[9px] font-black uppercase tracking-tighter bg-green-500/10 text-green-700">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-red-500/20 text-[9px] font-black uppercase tracking-tighter bg-red-500/10 text-red-700">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-yellow-500/20 text-[9px] font-black uppercase tracking-tighter bg-yellow-500/10 text-yellow-700">
            Pending
          </span>
        );
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-[10px] font-mono font-bold text-neutral-300 animate-pulse">
        FETCHING PERSONAL LEDGER...
      </div>
    );

  return (
    <div className="font-sans">
      <div className="mb-8 p-4 border-b border-line bg-surface flex justify-between items-end">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">
            My Reservations
          </h1>
          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-bold">
            Personal Activity Log
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {bookings.map((booking, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={booking._id}
              className={`bg-surface border border-line overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-lg
                ${booking.status === "cancelled" ? "opacity-50 grayscale" : ""}
              `}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  {getStatusBadge(booking.status)}
                  <span className="text-[9px] font-mono text-neutral-300 font-bold">
                    REF #{booking.id.toString().padStart(4, "0")}
                  </span>
                </div>

                <h3 className="text-sm font-black mb-1 leading-tight text-ink truncate">
                  {booking.title}
                </h3>
                <p className="text-[11px] text-neutral-500 mb-6 line-clamp-2 leading-relaxed">
                  {booking.description || "No additional details provided."}
                </p>

                <div className="space-y-2 border-t border-line/50 pt-4">
                  <div className="flex items-center text-[11px] font-bold text-neutral-600">
                    <MapPin size={12} className="mr-2 text-accent" />
                    <span className="truncate">{booking.hall_name}</span>
                  </div>
                  <div className="flex items-center text-[11px] font-mono text-neutral-400">
                    <Clock size={12} className="mr-2 opacity-50" />
                    <span>
                      {format(parseISO(booking.start_time), "MMM d, yyyy")} •{" "}
                      {format(parseISO(booking.start_time), "HH:mm")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-bg border-t border-line flex justify-between items-center">
                <span className="text-[9px] text-neutral-400 font-mono font-bold tracking-tight">
                  LOGGED {format(parseISO(booking.created_at), "MM/dd HH:mm")}
                </span>
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={12} />
                    <span>Void</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {bookings.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-line rounded-2xl bg-bg/20">
            <Calendar size={32} className="mx-auto mb-4 text-neutral-200" />
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">
              No Active Bookings
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2">
              Your reservation history is currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
