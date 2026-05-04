import { useState, useEffect } from "react";
import { Building2, Users, MapPin, Check, Info } from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { getHalls } from "../services/hallService";

export default function Halls() {
  const [halls, setHalls] = useState([]);

  const { isLoading, data, isError } = useQuery({
    queryKey: ["halls"],
    queryFn: getHalls,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setHalls(data);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="p-8 text-center text-xs font-mono uppercase tracking-widest text-neutral-400">
        Syncing with campus registry...
      </div>
    );

  return (
    <div className="font-sans">
      <div className="mb-8 p-4 border-b border-line bg-surface flex justify-between items-end">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">
            Hall Directory
          </h1>
          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-bold">
            Comprehensive Venue Inventory
          </p>
        </div>
        <div className="text-[10px] font-mono text-neutral-400 uppercase">
          Total: {halls.length} Assets
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {halls.map((hall, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={hall.id}
            className="bg-surface border border-line overflow-hidden shadow-sm hover:shadow-md transition-all group rounded-lg"
          >
            <div className="h-48 bg-bg relative overflow-hidden border-b border-line">
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-ink text-white rounded text-[9px] font-bold uppercase tracking-widest">
                  {hall.location}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-black text-ink leading-tight">
                    {hall.name}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 bg-bg px-2.5 py-1 rounded border border-line">
                  <Users size={12} className="text-neutral-400" />
                  <span className="text-xs font-bold text-ink">
                    {hall.capacity}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-neutral-500 mb-6 leading-relaxed bg-bg/30 p-3 rounded italic">
                {hall.description}
              </p>

              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center">
                  <span className="w-4 h-[1px] bg-line mr-2"></span> Facilities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hall.amenities?.split(",")?.map((amenity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded bg-bg text-neutral-600 text-[10px] font-bold border border-line"
                    >
                      <Check size={10} className="mr-1 text-accent" /> {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
