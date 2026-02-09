import { useState } from "react";
import ValentineStepper from "./components/ValentineStepper";
import Day from "./screens/Day";
import Locked from "./screens/Locked";
import HeartCursor from "./components/HeartCursor";

import { getTodayValentineIndex } from "./utils/date";

export default function App() {
  const todayIndex = getTodayValentineIndex();

  const [currentDay, setCurrentDay] = useState(todayIndex);

  const isLocked = currentDay > todayIndex;

  const completeDay = () => {
    // move to NEXT day even if locked
    setCurrentDay((prev) => prev + 1);
  };

  return (
    <>
      <HeartCursor />

      <ValentineStepper
        todayIndex={todayIndex}
        currentDay={currentDay}
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
