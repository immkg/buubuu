import { useEffect } from "react";

export default function HeartCursor() {
  useEffect(() => {
    const handler = (e) => {
      const heart = document.createElement("div");
      heart.innerText = "💖";
      heart.style.position = "fixed";
      heart.style.left = e.clientX + "px";
      heart.style.top = e.clientY + "px";
      heart.style.pointerEvents = "none";
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 800);
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return null;
}
