import { useState, useEffect } from "react";

export default function SoundToggle() {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem("appMuted") === "true";
  });

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    localStorage.setItem("appMuted", String(nextMuted));
    window.dispatchEvent(
      new CustomEvent("appMuteChange", { detail: { muted: nextMuted } })
    );
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("appMuteChange", { detail: { muted } })
    );
  }, [muted]);

  return (
    <button
      onClick={toggleMute}
      className="fixed top-2 right-4 z-50 p-2.5 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/40 shadow-md text-xl cursor-pointer transition active:scale-95 flex items-center justify-center text-rose select-none"
      title={muted ? "Unmute sound" : "Mute sound"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
