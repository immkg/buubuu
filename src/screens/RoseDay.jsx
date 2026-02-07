import { useState, useRef } from "react";
import { gsap } from "gsap";

export default function RoseDay({ onComplete }) {
  const gaspRef = useRef(null);
  const [answered, setAnswered] = useState(false);
  const [showGasp, setShowGasp] = useState(false);

  const triggerGasp = () => {
    setShowGasp(true);
    gsap.fromTo(
      gaspRef.current,
      { scale: 0, rotate: -10, opacity: 0 },
      {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6">
      <h1 className="text-4xl">Rose Day 🌹</h1>

      <p className="max-w-md text-lg">
        If love had a smell, it would be you.
      </p>

      {/* QUESTION */}
      {!answered && (
        <div className="bg-white/70 p-4 rounded-xl">
          <p className="mb-3 text-lg">
            Who fell first? 😏
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setAnswered(true)}
              className="px-4 py-2 bg-rose text-white rounded-full"
            >
              Me 😌
            </button>
            <button
              onClick={() => setAnswered(true)}
              className="px-4 py-2 bg-wine text-cream rounded-full"
            >
              You 😏
            </button>
          </div>
        </div>
      )}

      {/* GASP BUTTON */}
      {answered && !showGasp && (
        <button
          onClick={triggerGasp}
          className="px-5 py-2 bg-wine text-cream rounded-full"
        >
          Click if brave 😳
        </button>
      )}

      {/* GASP MOMENT */}
      {showGasp && (
        <div
          ref={gaspRef}
          className="text-2xl font-bold text-rose"
        >
          You had no chance. I was already yours 💘
        </div>
      )}

      {/* MEMORY IMAGE */}
      {showGasp && (
        <img
          src="assets/photos/rose1.png"
          className="w-64 rounded-xl blur-sm hover:blur-none transition-all duration-500"
        />
      )}

      {/* CONTINUE */}
      {showGasp && (
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-rose text-white rounded-full"
        >
          Continue 💖
        </button>
      )}
    </div>
  );
}
