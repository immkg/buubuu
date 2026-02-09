import { useState } from "react";
import ValentineStepper from "./components/ValentineStepper";
import Day from "./screens/Day";
import Locked from "./screens/Locked";
import HeartCursor from "./components/HeartCursor";

import { getTodayValentineIndex } from "./utils/date";
import { getCompletedDays, markDayCompleted } from "./utils/storage";

export default function App() {
  const todayIndex = getTodayValentineIndex();

  const [currentDay, setCurrentDay] = useState(todayIndex);
  const [completedDays, setCompletedDays] = useState(getCompletedDays());

  const isLocked =
    currentDay > todayIndex && !completedDays.includes(currentDay);

  const completeDay = () => {
    markDayCompleted(currentDay);
    setCompletedDays(getCompletedDays());

    // move to NEXT day even if locked
    setCurrentDay((prev) => prev + 1);
  };

  return (
    <>
      <HeartCursor />

      <ValentineStepper
        todayIndex={todayIndex}
        currentDay={currentDay}
        completedDays={completedDays}
        onSelectDay={setCurrentDay}
      />

      {isLocked ? (
        <Locked />
      ) : (
        <Day dayIndex={currentDay} onComplete={completeDay} />
      )}
    </>
  );
}
