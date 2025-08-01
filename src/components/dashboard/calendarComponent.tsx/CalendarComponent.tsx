import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventPopup from "./eventPopup";
import { motion } from "framer-motion";
import { Card } from "../../ui/Card";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string
  [key: string]: any; // for any extra fields
}

function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysArray = [...Array(daysInMonth).keys()].map((day) => day + 1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  // (Assuming selectedEvent is handled in EventPopup or elsewhere)
  const [time, setTime] = useState<Date>(new Date());
  const [, setSelectedEvent] = useState<CalendarEvent | { date: string } | null>(null);

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`https://studentflow-1-wu8y.onrender.com/api/events`);
      if (response.data.success) {
        setEvents(response.data.data);

        // Process upcoming events
        const today = new Date();
        const futureEvents = response.data.data.filter(
          (event: CalendarEvent) => new Date(event.date) >= today
        );
        futureEvents.sort(
          (a: CalendarEvent, b: CalendarEvent) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setUpcomingEvents(futureEvents.slice(0, 2)); // Limit to two events
      } else {
        console.error("Failed to fetch events:", response.data.error);
      }
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const handleDayClick = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const event = events.find((e) => e.date === date);
    setSelectedDay(date);
    setSelectedEvent(event || { date });
  };

  const handleClosePopup = () => {
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const blankDays = Array(firstDayOfMonth).fill(null);
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const [timePart, period] = formattedTime.split(" ");

  return (
    <>
      <Card className="bg-secondary text-black dark:text-white pt-6 w-[25%] min-w-fit rounded-3xl shadow flex flex-col max-h-[750px]">
        {/* Header: Time and Day */}
        <div className="px-6">
          <h1 className="text-5xl font-thin txt mb-2">
            {timePart} <span className="text-xl">{period}</span>
          </h1>
          <h2 className="text-md txt-dim">
            Today&apos;s{" "}
            {
              "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
                " "
              )[currentDate.getDay()]
            }
          </h2>
        </div>
        <hr className="my-4 opacity-10" />
        {/* Calendar View */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full hover:bg-ter"
                type="button"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-full hover:bg-ter"
                type="button"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[0.4rem]">
            {"Su Mo Tu We Th Fr Sa".split(" ").map((day) => (
              <div
                key={day}
                className="text-center text-xs font-md txt-dim"
              >
                {day}
              </div>
            ))}
            {blankDays.map((_, index) => (
              <div key={`blank-${index}`} className="p-3"></div>
            ))}
            {daysArray.map((day) => {
              const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              const hasEvent = events.some((event) => {
                const eventDate = parseISO(event.date);
                return (
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === currentDate.getMonth() &&
                  eventDate.getFullYear() === currentDate.getFullYear()
                );
              });
              return (
                <div
                  key={key}
                  onClick={() => handleDayClick(day)}
                  className={`flex items-center justify-center p-2.5 text-sm rounded-full txt cursor-pointer transition-all duration-200 ease-in-out h-9 
                  ${isToday ? "bg-purple-600 hover:bg-purple-700" : ""}
                  ${hasEvent && !isToday ? "bg-ter hover:bg-ter" : ""}
                  ${!isToday && !hasEvent ? "hover:bg-ter" : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Section with subtle animations */}
        <div className="p-6 rounded-3xl bg-ter flex-1 mt-6">
          <h3 className="text-lg font-semibold txt mb-4">
            Upcoming Events:
          </h3>
          {upcomingEvents.length > 0 ? (
            <motion.ul
              className="txt space-y-6 pl-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <motion.li
                    key={event.id}
                    className="pl-3 border-l-4 border-purple-500"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm txt-dim">
                        {eventDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs txt-dim">
                        {eventDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <span className="block mt-1">{event.title}</span>
                  </motion.li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="txt-dim text-sm"
            >
              No events.
            </motion.p>
          )}
        </div>
      </Card>

      {selectedDay && (
        <EventPopup
          date={selectedDay}
          onClose={handleClosePopup}
          refreshEvents={fetchEvents}
        />
      )}
    </>
  );
}

export default Calendar;
