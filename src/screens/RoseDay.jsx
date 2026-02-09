// src/screens/RoseDay.jsx

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function RoseDay({ onComplete }) {
  const meRef = useRef(null);
  const youRef = useRef(null);
  const textRef = useRef(null);

  const [step, setStep] = useState(0);
  const [escapeMode, setEscapeMode] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, [step]);

  const handleEscape = (e, ref) => {
    if (!escapeMode) return;

    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    gsap.to(ref.current, {
      x: -dx + Math.random() * 200 - 100,
      y: -dy + Math.random() * 200 - 100,
      rotate: Math.random() * 20 - 10,
      duration: 0.2,
    });
  };

  return (
    <div className="relative overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/photos/richika-bg.png')",
          filter: "blur(15px) brightness(0.8)",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6 text-cream" style={{ height: "calc(100vh - 48px)" }}>

        {/* STEP 0 */}
        {step === 0 && (
          <div ref={textRef}>
            <h1 className="text-3xl mb-2">Hi Richika 🌸</h1>
            <p>This is just something I made for you.</p>
            <button
              className="mt-6 px-6 py-2 bg-rose text-white rounded-full"
              onClick={() => setStep(1)}
            >
              Okay
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div ref={textRef}>
            <p className="text-lg mb-4">
              Before anything else,<br />
              do you like roses?
            </p>
            <div className="flex gap-6 justify-center">
              <button
                className="px-5 py-2 bg-rose rounded-full"
                onClick={() => setStep(2)}
              >
                Yes 🌹
              </button>
              <button
                className="px-5 py-2 bg-wine rounded-full"
                onClick={() => setStep(2)}
              >
                I prefer you 😌
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div
            ref={textRef}
            onMouseMove={(e) => handleEscape(e, youRef)}
          >
            <p className="text-lg mb-4">
              Then tell me one thing honestly.
              <br />
              Who fell first?
            </p>

            <div className="flex gap-10 justify-center">
              <button
                ref={meRef}
                className="px-6 py-2 bg-rose rounded-full"
                onClick={() => {
                  setEscapeMode(false);
                  setStep(3);
                }}
              >
                Mayank 😌
              </button>

              <button
                ref={youRef}
                className="px-6 py-2 bg-wine rounded-full"
                onMouseEnter={() => setEscapeMode(true)}
              >
                Richika 😏
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div ref={textRef}>
            <p className="text-2xl font-semibold text-rose">
              It was me.
              <br />
              Quietly. Completely.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-rose rounded-full"
              onClick={() => setStep(4)}
            >
              See why
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div ref={textRef} className="flex flex-col items-center gap-4">
            <img
              src="/assets/photos/mayank-richika-1.png"
              className="w-128 rounded-2xl shadow-2xl"
            />
            <p className="text-sm opacity-80">
              Somewhere between this moment<br />
              and now, I chose you.
            </p>
            <button
              className="mt-4 px-6 py-2 bg-rose rounded-full"
              onClick={onComplete}
            >
              Keep Going 💌
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
