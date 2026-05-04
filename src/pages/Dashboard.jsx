import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Users,
  LayoutGrid,
  Timer,
  CheckCircle2,
} from "lucide-react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isSameHour,
  differenceInMinutes,
  startOfDay,
  addHours,
  setHours,
  setMinutes,
} from "date-fns";
import BookingModal from "../components/BookingModal";
import { getHalls } from "../services/hallService";
import { getBookings } from "../services/bookingService";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("timeline");
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: hallsData } = useQuery({
    queryKey: ["halls"],
    queryFn: getHalls,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  useEffect(() => {
    if (hallsData) setHalls(hallsData);
    if (bookingsData) setBookings(bookingsData);
  }, [hallsData, bookingsData]);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4 border-b border-line mb-6 bg-surface">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold tracking-tight">
            Availability • {format(selectedDate, "MMM d, yyyy")}
          </h1>
          <div className="flex bg-bg p-1 rounded-lg border border-line">
            <button
              onClick={() => setView("calendar")}
              className={`p-1.5 rounded-md transition-all ${view === "calendar" ? "bg-surface shadow-sm text-accent" : "text-neutral-400 hover:text-ink"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`p-1.5 rounded-md transition-all ${view === "timeline" ? "bg-surface shadow-sm text-accent" : "text-neutral-400 hover:text-ink"}`}
            >
              <Timer size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            className="p-1.5 bg-surface border border-line rounded-md hover:bg-bg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold font-mono min-w-[80px] text-center uppercase tracking-tighter">
            {format(selectedDate, "MMMM")}
          </span>
          <button
            onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            className="p-1.5 bg-surface border border-line rounded-md hover:bg-bg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-md text-[12px] font-bold hover:bg-neutral-800 transition-all ml-2"
          >
            <Plus size={14} />
            <span>New Booking</span>
          </button>
        </div>
      </div>
    );
  };

  const renderTimeline = () => {
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
    const dayBookings = Array.isArray(bookings)
      ? bookings.filter((b) => isSameDay(parseISO(b.start_time), selectedDate))
      : [];

    return (
      <div className="border border-line rounded-lg overflow-hidden bg-surface shadow-sm font-sans">
        <div
          className="grid"
          style={{ gridTemplateColumns: `80px repeat(${halls.length}, 1fr)` }}
        >
          <div className="h-10 bg-bg border-b-2 border-ink flex items-center justify-center"></div>
          {halls.map((hall) => (
            <div
              key={hall.id}
              className="h-10 bg-bg border-b-2 border-ink border-l border-line flex flex-col items-center justify-center px-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest truncate w-full text-center">
                {hall.name}
              </span>
            </div>
          ))}

          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="h-16 flex items-center justify-end pr-3 bg-bg text-[11px] font-mono text-neutral-400 border-b border-line">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {halls.map((hall) => {
                const hourBooking = dayBookings.find((b) => {
                  const start = parseISO(b.start_time);
                  const end = parseISO(b.end_time);
                  const slotStart = setMinutes(setHours(selectedDate, hour), 0);
                  const slotEnd = setMinutes(
                    setHours(selectedDate, hour + 1),
                    0,
                  );
                  return (
                    b.hall_id === hall.id && start < slotEnd && end > slotStart
                  );
                });

                return (
                  <div
                    key={hall.id}
                    className="h-16 border-l border-b border-line relative p-1.5"
                  >
                    {hourBooking &&
                      isSameHour(
                        parseISO(hourBooking.start_time),
                        setHours(selectedDate, hour),
                      ) && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute inset-[4px] z-10 rounded shadow-sm border-l-4 border-accent p-2 flex flex-col gap-0.5 overflow-hidden group hover:shadow-md transition-all cursor-pointer box-border"
                          style={{
                            height: `${(differenceInMinutes(parseISO(hourBooking.end_time), parseISO(hourBooking.start_time)) / 60) * 64 - 8}px`,
                            backgroundColor: "#EFF6FF",
                            top: `${(parseISO(hourBooking.start_time).getMinutes() / 60) * 64 + 4}px`,
                          }}
                        >
                          <span className="text-[10px] font-bold text-accent leading-none truncate">
                            {hourBooking.title}
                          </span>
                          <span className="text-[9px] opacity-70 leading-none truncate">
                            {hourBooking.user_name}
                          </span>
                          <div className="flex items-center gap-1 mt-auto">
                            <Clock size={8} className="text-accent" />
                            <span className="text-[8px] font-mono opacity-50">
                              {format(
                                parseISO(hourBooking.start_time),
                                "HH:mm",
                              )}
                            </span>
                          </div>
                        </motion.div>
                      )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const cells = [];
    let day = startDate;

    while (day <= endDate) {
      const cloneDay = day;
      const dayBookings = bookings.filter((b) =>
        isSameDay(parseISO(b.start_time), day),
      );

      cells.push(
        <div
          key={day.toString()}
          onClick={() => {
            setSelectedDate(cloneDay);
            setView("timeline");
          }}
          className={`min-h-[100px] p-2 border-r border-b border-line transition-all cursor-pointer relative group
            ${!isSameMonth(day, monthStart) ? "bg-neutral-50/50 text-neutral-300" : "bg-white text-neutral-700"}
            ${isSameDay(day, selectedDate) ? "bg-accent/5 ring-1 ring-accent ring-inset" : "hover:bg-neutral-50"}
          `}
        >
          <div className="flex justify-between items-start mb-1.5">
            <span
              className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full
              ${isSameDay(day, new Date()) ? "bg-ink text-white" : ""}
            `}
            >
              {format(day, "d")}
            </span>
          </div>
          <div className="space-y-1">
            {dayBookings.slice(0, 3).map((b, idx) => (
              <div
                key={idx}
                className="text-[9px] bg-accent/5 border border-accent/10 text-accent rounded px-1 py-0.5 truncate font-bold"
              >
                {b.hall_name}
              </div>
            ))}
          </div>
        </div>,
      );
      day = addDays(day, 1);
    }

    return (
      <div className="border border-line rounded-lg overflow-hidden bg-surface shadow-sm">
        <div className="grid grid-cols-7 border-b border-line bg-bg">
          {dateNames.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{cells}</div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {renderHeader()}

      <div className="flex flex-col gap-6">
        <div className="bg-bg/50 p-6 rounded-xl border border-line/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Booked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-line bg-surface"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Available
              </span>
            </div>
          </div>

          {view === "calendar" ? renderCalendar() : renderTimeline()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-ink p-4 rounded-xl text-white shadow-xl">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 mb-3">
              Live Capacity
            </h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black">
                {
                  (Array.isArray(bookings) ? bookings : []).filter((b) =>
                    isSameDay(parseISO(b.start_time), selectedDate),
                  ).length
                }
              </span>
              <span className="text-[10px] font-bold text-accent">
                Active Bookings
              </span>
            </div>
            <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: "45%" }}></div>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-xl border border-line shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
              Next Event
            </h3>
            {bookings[0] ? (
              <div>
                <p className="text-sm font-bold text-ink truncate">
                  {bookings[0].title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-mono">
                  <Clock size={10} />
                  {format(parseISO(bookings[0].start_time), "HH:mm")} •{" "}
                  {bookings[0].hall_name}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-neutral-300">
                No events scheduled
              </p>
            )}
          </div>

          <div className="bg-surface p-4 rounded-xl border border-line shadow-sm">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
              Daily Efficiency
            </h3>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-bold">Optimal Load</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-2">
              All hall operations currently within healthy limits.
            </p>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          selectedDate={selectedDate}
          halls={halls}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            fetchBookings();
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
}
