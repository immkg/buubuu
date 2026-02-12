// src/screens/ProposeDay.jsx

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function ProposeDay({ onComplete }) {
  const textRef = useRef(null);
  const audioRef = useRef(null);
  const noRef = useRef(null);

  const [step, setStep] = useState(0);
  const [escapeMode, setEscapeMode] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  /* ---------- TEXT ANIMATION ---------- */
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }
  }, [step]);

  /* ---------- START MUSIC ON USER ACTION ---------- */
  const startMusic = () => {
    if (!musicStarted && audioRef.current) {
      const audio = audioRef.current;

      // 👇 SEEK AHEAD (adjust seconds as you like)
      audio.currentTime = 30;

      audio.play().catch(() => {});
      setMusicStarted(true);
    }
  };

  /* ---------- ESCAPE (ROSE DAY STYLE) ---------- */
  const handleEscape = (e, ref) => {
    if (!escapeMode || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    gsap.to(ref.current, {
      x: -dx + Math.random() * 120 - 60,
      y: -dy + Math.random() * 120 - 60,
      rotate: Math.random() * 10 - 5,
      duration: 0.2,
    });
  };

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center text-center px-6"
      style={{ height: "calc(100vh - 48px)" }}
    >
      {/* AUDIO */}
      <audio ref={audioRef} src="/assets/music/paper-rings.mp3" loop />

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-rose-900 to-black opacity-90" />
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-md text-cream flex flex-col items-center gap-6">
        {/* STEP 0 */}
        {step === 0 && (
          <div ref={textRef}>
            <h1 className="text-3xl mb-3">Propose Day 💍</h1>
            <p className="opacity-90">
              I like shiny things…
              <br />
              but I had a thought 😌
            </p>
            <button
              className="mt-6 px-6 py-2 bg-rose rounded-full text-white"
              onClick={() => {
                startMusic();
                setStep(1);
              }}
            >
              This sounds serious
            </button>
          </div>
        )}

        {/* STEP 1 – LYRICS */}
        {step === 1 && (
          <div ref={textRef}>
            <p className="mb-4">
              Complete the lyric.
              <br />
              (No pressure, but also full pressure)
            </p>

            <p className="italic opacity-90 mb-6">
              “I like shiny things,
              <br />
              but I’d marry you with ______ ______”
            </p>

            <div className="flex gap-6 justify-center">
              <button
                className="px-5 py-2 bg-rose rounded-full"
                onClick={() => setStep(2)}
              >
                Paper Rings 💍
              </button>
              <button
                className="px-5 py-2 bg-wine rounded-full"
                onClick={() => setStep(2)}
              >
                PAPER RINGS (in all caps)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div ref={textRef}>
            <p className="text-lg">
              Correct.
              <br />
              Honestly, there was never another option.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-rose rounded-full text-white"
              onClick={() => setStep(3)}
            >
              I knew it 😌
            </button>
          </div>
        )}

        {/* STEP 3 – FAKE NO */}
        {step === 3 && (
          <div ref={textRef} onMouseMove={(e) => handleEscape(e, noRef)}>
            <p className="text-lg mb-6">
              Final question.
              <br />
              Be honest.
            </p>

            <div className="flex gap-10 justify-center">
              <button
                className="px-6 py-2 bg-rose rounded-full"
                onClick={() => {
                  setEscapeMode(false);
                  setStep(4);
                }}
              >
                Yes, obviously 💖
              </button>

              <button
                ref={noRef}
                className="px-6 py-2 bg-wine rounded-full"
                onMouseEnter={() => setEscapeMode(true)}
              >
                Let me think 🤨
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 – FINAL */}
        {step === 4 && (
          <div ref={textRef} className="flex flex-col items-center gap-4">
            <p className="text-2xl font-semibold">Thought so 😌</p>
            <p className="text-lg">
              No diamonds.
              <br />
              No drama.
              <br />
              Just you and me
              <br />
              and paper rings forever 💍
            </p>

            <button
              className="mt-6 px-8 py-3 bg-rose rounded-full text-white text-lg animate-pulse"
              onClick={onComplete}
            >
              Forever 💖
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
