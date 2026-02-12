// src/screens/PromiseDay.jsx

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function PromiseDay({ onComplete }) {
  const textRef = useRef(null);

  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState([false, false, false]);
  const [hardAccepted, setHardAccepted] = useState(false);
  const [sealed, setSealed] = useState(false);

  /* ---------- FADE ---------- */
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
    }
  }, [step]);

  const toggleAgree = (i) => {
    setAgreed((prev) => {
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });
  };

  const allAgreed = agreed.every(Boolean);
  const videoRef = useRef(null);

  useEffect(() => {
    if (sealed && videoRef.current) {
      gsap.fromTo(
        videoRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8 }
      );
    }
  }, [sealed]);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center text-center px-6"
      style={{ height: "calc(100vh - 48px)" }}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-rose-950 to-black opacity-90" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-md text-cream flex flex-col items-center gap-6">
        {/* STEP 0 — ARRIVAL */}
        {step === 0 && (
          <div ref={textRef}>
            <h1 className="text-3xl mb-3">Promise Day 🤍</h1>
            <p className="opacity-90">
              Just pause for a second.
              <br />
              Be here with me.
            </p>

            <button
              className="mt-6 px-6 py-2 bg-rose rounded-full text-white"
              onClick={() => setStep(1)}
            >
              I’m here
            </button>
          </div>
        )}

        {/* STEP 1 — REALITY */}
        {step === 1 && (
          <div ref={textRef}>
            <p className="text-lg">
              Promises aren’t magic.
              <br />
              They don’t make life easy.
            </p>

            <p className="opacity-80 mt-3">They just make us honest.</p>

            <button
              className="mt-6 px-6 py-2 bg-rose rounded-full text-white"
              onClick={() => setStep(2)}
            >
              Keep going
            </button>
          </div>
        )}

        {/* STEP 2 — MUTUAL PROMISES */}
        {step === 2 && (
          <div ref={textRef} className="flex flex-col gap-4">
            <p>
              These are things
              <br />
              we agree on together.
            </p>

            {[
              "We promise to communicate, not disappear.",
              "We promise to respect each other’s individuality.",
              "We promise to celebrate growth, not fear it.",
            ].map((text, i) => (
              <div
                key={i}
                onClick={() => toggleAgree(i)}
                className={`cursor-pointer px-5 py-3 rounded-xl border transition-all ${
                  agreed[i]
                    ? "bg-rose text-white border-rose"
                    : "bg-black/40 border-white/30 hover:bg-black/60"
                }`}
              >
                {agreed[i] ? "✓ " : ""}
                {text}
              </div>
            ))}

            {allAgreed && (
              <button
                className="mt-4 px-6 py-2 bg-rose rounded-full text-white"
                onClick={() => setStep(3)}
              >
                We agree
              </button>
            )}
          </div>
        )}

        {/* STEP 3 — THE HARD PROMISE */}
        {step === 3 && (
          <div ref={textRef}>
            <p className="text-lg">And here’s the hardest one.</p>

            <p className="italic opacity-90 mt-4">
              We promise to stay,
              <br />
              even when it’s inconvenient.
            </p>

            <button
              className={`mt-6 px-6 py-2 rounded-full text-white transition-all ${
                hardAccepted ? "bg-rose" : "bg-wine hover:bg-wine/80"
              }`}
              onClick={() => {
                setHardAccepted(true);
                setTimeout(() => setStep(4), 500);
              }}
            >
              I accept this
            </button>
          </div>
        )}

        {/* STEP 4 — PERSONAL WORD */}
        {step === 4 && (
          <div ref={textRef}>
            <p className="text-lg">This part is just from me.</p>

            <p className="opacity-90 mt-3">
              I can’t promise perfection.
              <br />
              But I promise effort.
            </p>

            {/* OPTIONAL VIDEO SLOT */}
            {/* <video src="/assets/video/you.mp4" controls className="rounded-xl mt-4" /> */}

            <button
              className="mt-6 px-6 py-2 bg-rose rounded-full text-white"
              onClick={() => setStep(5)}
            >
              I mean it
            </button>
          </div>
        )}

        {/* STEP 5 — SEAL */}
        {step === 5 && (
          <div ref={textRef} className="flex flex-col items-center gap-4">
            <p className="text-lg">
              No witnesses.
              <br />
              Just us.
            </p>

            <div
              className="w-64 h-64 rounded-full border-2 border-rose overflow-hidden cursor-pointer transition-all hover:scale-105"
              onClick={() => setSealed(true)}
            >
              {!sealed ? (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🤍
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src="/assets/reels/promise.mp4"
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {sealed && (
              <button
                className="mt-6 px-8 py-3 bg-rose rounded-full text-white text-lg"
                onClick={onComplete}
              >
                Promise sealed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
