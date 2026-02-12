// src/screens/HugDay.jsx

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const HOLD_DURATION = 5000; // 5 seconds

export default function HugDay({ onComplete }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);
  const textRef = useRef(null);

  const holdStartRef = useRef(null);
  const holdingRef = useRef(false);

  const [progress, setProgress] = useState(0); // 0 → 1
  const [buttonText, setButtonText] = useState("Hug tighter");
  const [step, setStep] = useState(0);

  /* ---------------- TEXT FADE ---------------- */
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }
  }, [step]);

  /* ---------------- HOLD LOOP ---------------- */
  useEffect(() => {
    let frame;

    const animate = () => {
      if (holdingRef.current) {
        const elapsed = Date.now() - holdStartRef.current;
        const ratio = Math.min(elapsed / HOLD_DURATION, 1);
        setProgress(ratio);
      }
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  /* ---------------- VISUAL UPDATE ---------------- */
  useEffect(() => {
    const distance = 120 - progress * 120;

    if (leftRef.current && rightRef.current) {
      gsap.to(leftRef.current, { x: -distance, duration: 0.2 });
      gsap.to(rightRef.current, { x: distance, duration: 0.2 });

      gsap.to([leftRef.current, rightRef.current], {
        boxShadow: `0 0 ${20 + progress * 60}px rgba(255,150,180,${progress})`,
        duration: 0.2,
      });
    }

    // fade images in
    if (leftImgRef.current && rightImgRef.current) {
      gsap.to([leftImgRef.current, rightImgRef.current], {
        opacity: progress,
        duration: 0.2,
      });
    }
  }, [progress]);

  /* ---------------- HOLD EVENTS ---------------- */
  const startHold = () => {
    holdingRef.current = true;
    holdStartRef.current = Date.now();
    setButtonText("Keep holding…");
  };

  const stopHold = () => {
    holdingRef.current = false;

    const completed = progress >= 1;

    if (!completed) {
      setButtonText("Don't let go yet…");

      // Kill any running tweens
      gsap.killTweensOf([leftRef.current, rightRef.current]);

      // Animate apart
      gsap.to(leftRef.current, {
        x: -120,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(rightRef.current, {
        x: 120,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to([leftImgRef.current, rightImgRef.current], {
        opacity: 0,
        duration: 0.4,
      });

      // Reset progress AFTER animation
      setTimeout(() => {
        setProgress(0);
      }, 500);

      return;
    }

    // Completed full hold
    setButtonText("Stay…");

    setTimeout(() => {
      setStep(1);
    }, 1000);
  };

  return (
    <div
      className="relative flex items-center justify-center text-center px-6 overflow-hidden"
      style={{
        height: "calc(100vh - 48px)",
        background:
          "radial-gradient(circle at center, #2a0d18 0%, #14060c 80%)",
      }}
    >
      <div className="relative z-10 max-w-md flex flex-col items-center gap-8 text-rose-100">
        {/* STEP 0 - INTERACTION */}
        {step === 0 && (
          <div ref={textRef} className="flex flex-col items-center gap-8">
            <h1 className="text-3xl font-semibold">Hug Day 🤍</h1>

            {/* ORBS */}
            <div className="relative w-72 h-40 flex items-center justify-center">
              <div
                ref={leftRef}
                className="absolute w-28 h-28 rounded-full overflow-hidden border-4 border-rose-300 bg-rose-200/20"
              >
                <img
                  ref={leftImgRef}
                  src="/assets/photos/mayank.png"
                  className="w-full h-full object-cover opacity-0"
                />
              </div>

              <div
                ref={rightRef}
                className="absolute w-28 h-28 rounded-full overflow-hidden border-4 border-pink-400 bg-pink-200/20"
              >
                <img
                  ref={rightImgRef}
                  src="/assets/photos/richika.png"
                  className="w-full h-full object-cover opacity-0"
                />
              </div>
            </div>

            {/* HOLD BUTTON */}
            <button
              onPointerDown={startHold}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              className="px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 transition text-white active:scale-95"
            >
              {buttonText}
            </button>
          </div>
        )}

        {/* STEP 1 - FINAL */}
        {step === 1 && (
          <div ref={textRef} className="flex flex-col items-center gap-5">
            <img
              src="/assets/photos/mayank-richika-3.png"
              className="w-72 rounded-3xl shadow-2xl"
            />

            <p className="opacity-90 leading-relaxed">
              Some hugs don't solve everything.
              <br />
              They just remind you
              <br />
              you're not alone.
            </p>

            <button
              onClick={onComplete}
              className="text-white mt-4 px-6 py-2 bg-rose rounded-full animate-fade-in"
            >
              Keep Going 💌
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
