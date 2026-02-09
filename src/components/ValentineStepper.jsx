import { VALENTINE_DAYS } from "../data/valentineDays";
import { motion } from "framer-motion";

export default function ValentineStepper({
  todayIndex,
  currentDay,
  onSelectDay,
}) {
  return (
    <div className="sticky top-0 z-50 bg-white/70 backdrop-blur py-2 flex justify-center gap-3">
      {VALENTINE_DAYS.map((day, index) => {
        const isLocked = index > todayIndex;
        const isActive = index === currentDay;

        return (
          <motion.button
            key={day.id}
            onClick={() => !isLocked && onSelectDay(index)}
            className={`text-2xl ${
              isLocked ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
            }`}
            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ repeat: isActive ? Infinity : 0, duration: 1.2 }}
          >
            {day.icon}
          </motion.button>
        );
      })}
    </div>
  );
}
