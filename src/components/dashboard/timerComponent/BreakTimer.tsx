// No connection to backend, runs entirely on the frontend

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock12, Coffee, RotateCcw, Edit3, Check } from "lucide-react";
import AnimatedDigits from "./AnimatedDigits";

function BreakTimer(): JSX.Element {
  const [breakTime, setBreakTime] = useState<number>(600); // Default break time in seconds (10 min)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customBreakTime, setCustomBreakTime] = useState<number>(10);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setBreakTime((prev) => {
          if (prev <= 0) {
            alert("Break is over! Get back to studying.");
            setIsRunning(false);
            return customBreakTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, customBreakTime]);

  const handleStartPause = (): void => setIsRunning((prev) => !prev);
  const handleReset = (): void => {
    setIsRunning(false);
    setBreakTime(customBreakTime * 60);
  };
  const handleEditClick = (): void => setIsEditing(true);
  const handleApplyBreakTime = (): void => {
    setBreakTime(customBreakTime * 60);
    setIsEditing(false);
  };

  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
      <div className="text-6xl font-bold mb-4 flex items-center gap-1">
        {!isEditing ? (
          <>
            <AnimatedDigits
              value={String(Math.floor(breakTime / 60)).padStart(2, "0")}
            />
            <div className="text-gray-400 pb-3">:</div>
            <AnimatedDigits value={String(breakTime % 60).padStart(2, "0")} />
          </>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={customBreakTime}
              onChange={(e) => setCustomBreakTime(Number(e.target.value))}
              className="px-2 py-1 text-white rounded-md w-44 bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <motion.button
              onClick={handleApplyBreakTime}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-green-600 p-2 rounded-lg"
              type="button"
            >
              <Check className="w-5 h-5" />
            </motion.button>
          </div>
        )}
        {!isEditing && (
          <motion.button
            onClick={handleEditClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="m-4 text-gray-300 hover:text-white"
            type="button"
          >
            <Edit3 className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <motion.button
          onClick={handleStartPause}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ease-in-out ${
            isRunning
              ? "bg-black/20 hover:bg-black/30"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          type="button"
        >
          <span
            className={`flex items-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-0" : "opacity-100"
            }`}
          >
            <Coffee className="w-5 h-5" />
            <span>Start Break</span>
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-100" : "opacity-0"
            }`}
          >
            <Clock12 className="w-5 h-5 animate-spin" />
            <span>Pause</span>
          </span>
        </motion.button>
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hover:bg-red-700 p-2 rounded-lg flex items-center gap-2"
          type="button"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default BreakTimer;
