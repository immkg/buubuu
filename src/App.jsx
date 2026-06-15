import { useState, useEffect } from "react";
import { VALENTINE_DAYS } from "./data/valentineDays";
import ValentineStepper from "./components/ValentineStepper";
import Day from "./screens/Day";
import HeartCursor from "./components/HeartCursor";
import SoundToggle from "./components/SoundToggle";

export default function App() {
  // Helper to parse current index from hash
  const getIndexFromHash = () => {
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    const index = VALENTINE_DAYS.findIndex((day) => day.key === hash);
    return index !== -1 ? index : 0;
  };

  const [currentDay, setCurrentDay] = useState(getIndexFromHash);

  // Sync state -> hash (for Google Analytics page tracking)
  useEffect(() => {
    const day = VALENTINE_DAYS[currentDay];
    const dayKey = day?.key;

    if (!dayKey) return;

    if (window.location.hash !== `#/${dayKey}`) {
      window.location.hash = `#/${dayKey}`;
    }

    document.title = `${day.label} ❤️ Buubuu`;

    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_title: `${day.label} ❤️ Buubuu`,
        page_path: `#/${dayKey}`,
        page_location: window.location.href,
      });
    }
  }, [currentDay]);

  // Sync hash -> state (for browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentDay(getIndexFromHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const completeDay = () => {
    if (currentDay < VALENTINE_DAYS.length - 1) {
      setCurrentDay((prev) => prev + 1);
    }
  };

  return (
    <>
      <HeartCursor />
      <SoundToggle />

      <ValentineStepper
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
      />

      <Day dayIndex={currentDay} onComplete={completeDay} />
    </>
  );
}


