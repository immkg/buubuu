// src/screens/ValentineDay.jsx

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ValentineDay() {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2 }
    );
  }, []);

  return (
    <div
      className="relative flex items-center justify-center text-center overflow-hidden"
      style={{
        height: "calc(100vh - 48px)",
        background:
          "linear-gradient(135deg, #1a000a, #3a0018, #000000)",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/assets/photos/mayank-richika-final.jpg')",
        }}
      />

      <div
        ref={textRef}
        className="relative z-10 text-cream max-w-xl px-6"
      >
        <h1 className="text-4xl mb-6 text-rose">
          Happy Valentine’s Day ❤️
        </h1>

        <p className="text-lg leading-relaxed">
          Not because it’s a date on the calendar.
          <br /><br />
          But because somewhere between
          jokes, chaos, silence, and comfort…
          <br /><br />
          we became something real.
          <br /><br />
          And if I had to choose again —
          <br />
          I’d still choose you.
        </p>

        <p className="mt-8 text-2xl text-rose">
          Always.
        </p>
      </div>
    </div>
  );
}
