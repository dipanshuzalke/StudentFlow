import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// const backendUrl = import.meta.env.VITE_API_URL;

interface EventPopupProps {
  date: string;
  onClose: () => void;
  refreshEvents: () => void;
}

interface EventData {
  _id: string;
  title: string;
  time?: string;
  date: string;
  [key: string]: any;
}

const EventPopup = ({ date, onClose, refreshEvents }: EventPopupProps) => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [title, setTitle] = useState<string>("");
  const [time, setTime] = useState<string>("08:00");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `https://studentflow-1-wu8y.onrender.com/api/events-by-date?date=${date}`
        );
        const eventData: EventData | undefined = response.data.data[0]; // Assuming one event per date
        if (eventData) {
          setId(eventData._id);
          setEvent(eventData);
          setTitle(eventData.title || "");
          setTime(eventData.time || "08:00");
        } else {
          setEvent(null);
          setTitle("");
          setTime("08:00");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [date]);

  const handleCreateOrUpdate = async () => {
    try {
      const eventData = { title, time, date };
      if (id) {
        await axios.put(`https://studentflow-1-wu8y.onrender.com/api/events/${id}`, eventData);
      } else {
        await axios.post(`https://studentflow-1-wu8y.onrender.com/api/events`, eventData);
      }
      refreshEvents();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axios.delete(`https://studentflow-1-wu8y.onrender.com/api/events/${id}`);
        refreshEvents();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white dark:bg-gray-800 text-black dark:text-white w-96 bg-sec rounded-3xl p-8 shadow-2xl shadow-gray-900 border border-[var(--bg-ter)]"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold txt">
                {event ? "Edit Event" : "New Event"}
              </h2>
              <p className="text-sm txt-dim">{date}</p>
            </div>
            <button
              onClick={onClose}
              className="txt-dim hover:txt transition mb-auto"
              type="button"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-[var(--bg-ter)] px-4 py-2 txt placeholder:txt-dim focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="mb-6">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-[var(--bg-ter)] px-4 py-2 txt placeholder:txt-dim focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="flex space-x-3">
            {event && (
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-ter py-2 text-center txt font-semibold shadow hover:bg-red-700 transition"
                type="button"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleCreateOrUpdate}
              className="flex-1 m-auto w-min rounded-lg bg-purple-600 py-2 text-center text-white font-semibold shadow hover:bg-purple-700 transition"
              type="button"
            >
              {event ? "Update" : "Create"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventPopup;
