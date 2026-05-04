import React, { useState } from "react";
import { X, Calendar, Clock, Building2, AlignLeft, Check } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { createBooking } from "../services/bookingService";
import { useStore } from "../stores/useStore";

export default function BookingModal({
  selectedDate,
  halls,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hallId, setHallId] = useState(halls[0]?._id || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const start = setHours(selectedDate, parseInt(startTime.split(":")[0]));
    const finalStart = setMinutes(start, parseInt(startTime.split(":")[1]));

    const end = setHours(selectedDate, parseInt(endTime.split(":")[0]));
    const finalEnd = setMinutes(end, parseInt(endTime.split(":")[1]));

    if (finalEnd <= finalStart) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    const selectedHallId = hallId || halls[0]?._id;

    if (!selectedHallId) {
      setError("Please select a hall");
      setLoading(false);
      return;
    }

    try {
      bookingMutation.mutate({
        hall_id: selectedHallId,
        title,
        description,
        start_time: finalStart.toISOString(),
        end_time: finalEnd.toISOString(),
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative bg-surface w-full max-w-lg rounded-xl shadow-2xl border border-line overflow-hidden font-sans"
      >
        <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-bg">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Create Reservation
            </h2>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-mono uppercase">
              {format(selectedDate, "MMM d, yyyy")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-200 rounded transition-colors"
          >
            <X size={16} className="text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded border border-red-100 text-[11px] font-bold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-line rounded focus:bg-surface focus:ring-1 focus:ring-accent outline-none transition-all text-xs"
              placeholder="e.g., Freshman Orientation"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Select Hall
              </label>
              <select
                value={hallId}
                onChange={(e) => setHallId(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-line rounded focus:bg-surface focus:ring-1 focus:ring-accent outline-none transition-all text-xs"
                required
              >
                {halls.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Date
              </label>
              <input
                disabled
                value={format(selectedDate, "MMM d, yyyy")}
                className="w-full px-3 py-2 bg-neutral-100 border border-line rounded text-neutral-400 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onBlur={(e) => {
                  const [h, m] = e.target.value.split(":");
                  const endH = parseInt(h) + 1;
                  if (endH < 24)
                    setEndTime(`${endH.toString().padStart(2, "0")}:${m}`);
                }}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-line rounded focus:bg-surface focus:ring-1 focus:ring-accent outline-none transition-all text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-bg border border-line rounded focus:bg-surface focus:ring-1 focus:ring-accent outline-none transition-all text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Additional Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-line rounded focus:bg-surface focus:ring-1 focus:ring-accent outline-none transition-all min-h-[80px] text-xs"
              placeholder="Provide event details..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ink text-white rounded font-bold hover:bg-neutral-800 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Reservation"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
