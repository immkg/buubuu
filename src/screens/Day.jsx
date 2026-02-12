// src/screens/Day.jsx

import { VALENTINE_DAYS } from "../data/valentineDays";
import { DAY_CONTENT } from "../data/dayContent";
import ChoiceButtons from "../components/ChoiceButtons";
import RoseDay from "./RoseDay";
import ChocolateDay from "./ChocolateDay";
import TeddyDay from "./TeddyDay";
import ProposeDay from "./ProposeDay";
import PromiseDay from "./PromiseDay";
import HugDay from "./HugDay";
import KissDay from "./KissDay";
import ValentineDay from "./ValentineDay";

export default function Day({ dayIndex, onComplete }) {
  const dayKey = VALENTINE_DAYS[dayIndex].key;
  const content = DAY_CONTENT[dayKey];

  if (dayKey === "rose") {
    return <RoseDay onComplete={onComplete} />;
  }

  if (dayKey === "propose") {
    return <ProposeDay onComplete={onComplete} />;
  }

  if (dayKey === "chocolate") {
    return <ChocolateDay onComplete={onComplete} />;
  }

  if (dayKey === "teddy") {
    return <TeddyDay onComplete={onComplete} />;
  }

  if (dayKey === "promise") {
    return <PromiseDay onComplete={onComplete} />;
  }
  if (dayKey === "hug") {
    return <HugDay onComplete={onComplete} />;
  }
  if (dayKey === "kiss") {
    return <KissDay onComplete={onComplete} />;
  }
  if (dayKey === "valentine") {
    return <ValentineDay onComplete={onComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl mb-4">{content.title}</h1>

      <p className="max-w-md text-lg mb-6">{content.text}</p>

      {dayKey === "valentine" ? (
        <ChoiceButtons onYes={() => alert("LOCKED IN 💍")} onNo={() => {}} />
      ) : (
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-rose text-white rounded-full"
        >
          Continue 💖
        </button>
      )}
    </div>
  );
}
