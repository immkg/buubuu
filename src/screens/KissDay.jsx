// src/screens/KissDay.jsx

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function KissDay({ onComplete }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  const spawnHeart = () => {
    const heart = document.createElement("div");
    heart.innerText = "💋";
    heart.style.position = "absolute";
    heart.style.fontSize = "28px";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = window.innerHeight + "px";
    heart.style.cursor = "pointer";

    heart.onclick = () => {
      setScore((s) => s + 1);
      heart.remove();
    };

    containerRef.current.appendChild(heart);

    gsap.to(heart, {
      y: -window.innerHeight - 200,
      duration: 4,
      ease: "none",
      onComplete: () => heart.remove(),
    });
  };

  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(spawnHeart, 500);
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
              src="/assets/photos/mayank-richika-kiss.png"
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
