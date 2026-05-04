import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
  Users,
  MapPin,
  X,
  AlertTriangle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  createHall,
  deleteHall,
  getHalls,
  updateHall,
} from "../services/hallService";
import { getBookings, updateBookingStatus } from "../services/bookingService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const [loading, setLoading] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [editingHall, setEditingHall] = useState(null);
  const [showHallModal, setShowHallModal] = useState(false);

  const queryClient = useQueryClient();

  // Queries
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getBookings,
  });

  const { data: halls = [], isLoading: loadingHalls } = useQuery({
    queryKey: ["halls"],
    queryFn: getHalls,
  });

  // Mutations
  const statusMutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => queryClient.invalidateQueries(["admin-bookings"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHall,
    onSuccess: () => {
      queryClient.invalidateQueries(["halls"]);
      setConfirmDelete(null);
    },
  });

  const { mutate: saveMutation } = useMutation({
    mutationFn: updateHall,
    onSuccess: () => {
      queryClient.invalidateQueries(["halls"]);
      setShowHallModal(false);
      setEditingHall(null);
    },
  });

  const { mutate: handleCreateHall } = useMutation({
    mutationFn: createHall,
    onSuccess: () => {
      queryClient.invalidateQueries(["halls"]);
      setShowHallModal(false);
      setEditingHall(null);
    },
  });

  const handleSaveHall = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const hallData = {
      name: formData.get("name"),
      capacity: parseInt(formData.get("capacity")),
      location: formData.get("location"),
      description: formData.get("description"),
      amenities: formData
        .get("amenities")
        .split(",")
        .map((s) => s.trim())
        .join(","),
    };
    if (editingHall === null) {
      handleCreateHall(hallData);
    } else {
      saveMutation({ id: editingHall._id, ...hallData });
    }
  };

  if (loadingBookings || loadingHalls)
    return (
      <div className="p-8 text-center text-xs font-mono">
        LOADING CONTROL PANEL...
      </div>
    );

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="font-sans">
      <div className="mb-8 p-4 border-b border-line bg-surface flex justify-between items-end">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">
            Administrative Terminal
          </h1>
          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-bold">
            System Management Interface
          </p>
        </div>
        <div className="flex bg-bg p-1 rounded border border-line">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "bookings" ? "bg-ink text-white shadow-sm" : "text-neutral-400 hover:text-ink"}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("halls")}
            className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "halls" ? "bg-ink text-white shadow-sm" : "text-neutral-400 hover:text-ink"}`}
          >
            Halls
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-lg shadow-sm overflow-hidden min-h-[600px]">
        {activeTab === "bookings" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-bg border-b border-line">
                <tr>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Reference
                  </th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Event & User
                  </th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Venue
                  </th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Schedule
                  </th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Status
                  </th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-bg/50 transition-colors">
                    <td className="p-4 text-[11px] font-mono font-bold text-neutral-400">
                      #{b.id.toString().padStart(4, "0")}
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-black text-ink">{b.title}</p>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                        {b.user_name} • {b.user_email}
                      </p>
                    </td>
                    <td className="p-4 text-xs font-bold text-accent">
                      {b.hall_name}
                    </td>
                    <td className="p-4">
                      <p className="text-[10px] font-bold">
                        {format(parseISO(b.start_time), "MMM d, yyyy")}
                      </p>
                      <p className="text-[10px] font-mono text-neutral-400">
                        {format(parseISO(b.start_time), "HH:mm")} -{" "}
                        {format(parseISO(b.end_time), "HH:mm")}
                      </p>
                    </td>
                    <td className="p-4">{getStatusBadge(b.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateBookingStatus(b.id, "confirmed")
                            }
                            className="p-1.5 bg-green-50 text-green-600 rounded border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleUpdateBookingStatus(b.id, "cancelled")
                            }
                            className="p-1.5 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition-colors"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Building2 size={18} className="text-accent" />
                Asset Inventory
              </h2>
              <button
                onClick={() => {
                  setEditingHall(null);
                  setShowHallModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-ink text-white text-[11px] font-black uppercase tracking-widest rounded hover:bg-neutral-800 transition-all"
              >
                <Plus size={14} />
                New Hall
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {halls.map((h) => (
                <div
                  key={h._id}
                  className="border border-line rounded-lg p-4 bg-bg/20 hover:bg-bg/40 transition-all relative group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-black text-ink">{h.name}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingHall(h);
                          setShowHallModal(true);
                        }}
                        className="p-1.5 bg-surface border border-line rounded hover:bg-accent hover:text-white transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(h)}
                        className="p-1.5 bg-surface border border-line rounded hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 mt-3">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-tight">
                      <MapPin size={12} className="text-accent" /> {h.location}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-tight">
                      <Users size={12} className="text-accent" /> {h.capacity}{" "}
                      Participants
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {h.amenities?.split(",")?.map((a, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-surface border border-line px-1.5 py-0.5 rounded font-bold uppercase"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface p-6 rounded border border-line w-full max-w-sm"
            >
              <AlertTriangle className="text-red-500 mb-2" size={24} />
              <h3 className="text-sm font-bold">Confirm Deletion</h3>
              <p className="text-xs text-neutral-500 my-4">
                Are you sure you want to delete{" "}
                <span className="font-bold text-ink">{confirmDelete.name}</span>
                ? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2 border border-line rounded text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete._id)}
                  className="flex-1 py-2 bg-red-600 text-white rounded text-[10px] font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHallModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              onClick={() => setShowHallModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative bg-surface w-full max-w-md rounded shadow-2xl border border-line overflow-hidden"
            >
              <div className="p-4 border-b border-line bg-bg flex justify-between items-center">
                <h2 className="text-xs font-black uppercase tracking-widest">
                  {editingHall ? "Edit Venue" : "Register New Venue"}
                </h2>
                <button
                  onClick={() => setShowHallModal(false)}
                  className="p-1 hover:bg-neutral-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSaveHall} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Hall Name
                  </label>
                  <input
                    name="name"
                    defaultValue={editingHall?.name}
                    required
                    className="w-full px-3 py-2 bg-bg border border-line rounded text-xs outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      Capacity
                    </label>
                    <input
                      name="capacity"
                      type="number"
                      defaultValue={editingHall?.capacity}
                      required
                      className="w-full px-3 py-2 bg-bg border border-line rounded text-xs outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      Location
                    </label>
                    <input
                      name="location"
                      defaultValue={editingHall?.location}
                      required
                      className="w-full px-3 py-2 bg-bg border border-line rounded text-xs outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingHall?.description}
                    className="w-full px-3 py-2 bg-bg border border-line rounded text-xs min-h-[80px] outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Amenities (comma separated)
                  </label>
                  <input
                    name="amenities"
                    defaultValue={editingHall?.amenities}
                    placeholder="AC, Projector, Sound..."
                    className="w-full px-3 py-2 bg-bg border border-line rounded text-xs outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-ink text-white text-[11px] font-black uppercase tracking-widest rounded hover:bg-neutral-800 transition-all mt-4"
                >
                  {editingHall ? "Update Register" : "Finalize Registration"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
