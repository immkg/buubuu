// src/screens/KissDay.jsx

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function KissDay({ onComplete }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  const spawnHeart = () => {
    if (!containerRef.current) return;

    const heart = document.createElement("div");

    // Randomly choose slow or normal
    const isSlow = Math.random() < 0.4; // 40% chance slow kiss

    heart.innerText = "💋";
    heart.style.position = "absolute";
    heart.style.fontSize = isSlow ? "38px" : "28px";
    heart.style.left = Math.random() * (window.innerWidth - 60) + "px";

    // Start slightly inside screen (not fully bottom)
    heart.style.top = window.innerHeight - 100 + "px";
    heart.style.cursor = "pointer";
    heart.style.userSelect = "none";

    heart.onclick = () => {
      setScore((s) => s + 1);

      // cute pop effect
      gsap.to(heart, {
        scale: 1.6,
        opacity: 0,
        duration: 0.3,
        onComplete: () => heart.remove(),
      });
    };

    containerRef.current.appendChild(heart);

    gsap.to(heart, {
      y: -window.innerHeight,
      x: "+=" + (Math.random() * 100 - 50), // slight sideways float
      duration: isSlow ? 6 : 4.5, // slow ones float longer
      ease: "power1.out",
      onComplete: () => heart.remove(),
    });
  };

  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(spawnHeart, 700);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (score >= 8) {
      setTimeout(() => setStep(2), 500);
    }
  }, [score]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden flex items-center justify-center text-center"
      style={{ height: "calc(100vh - 48px)", background: "#200814" }}
    >
      <div className="z-10 text-cream flex flex-col items-center gap-6">
        {step === 0 && (
          <>
            <h1 className="text-3xl">Kiss Day 😘</h1>
            <p>
              Let’s see if you can catch
              <br />
              all my flying kisses.
            </p>
            <button
              className="mt-4 px-6 py-2 bg-rose rounded-full text-white"
              onClick={() => setStep(1)}
            >
              Try me 😌
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p>Caught: {score} / 8</p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xl">
              Okay okay…
              <br />
              You win.
            </p>
            <img
              src="/assets/photos/mayank-richika-4.png"
              className="w-72 rounded-2xl shadow-xl"
            />
            <button
              className="mt-4 px-6 py-2 bg-rose rounded-full text-white"
              onClick={onComplete}
            >
              One more day left ❤️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
