import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

export default function RoseDay({ onComplete }) {
  const gaspRef = useRef(null);
  const meRef = useRef(null);
  const youRef = useRef(null);

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

  const handleMouseMove = (e, ref) => {
    if (!escapeMode) return;

    const rect = ref.current.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    const dx = e.clientX - btnX;
    const dy = e.clientY - btnY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 220) {
      if (teleportMode) {
        teleport(ref);
      } else {
        gsap.to(ref.current, {
          x: -dx * 1.4 + (Math.random() * 300 - 150),
          y: -dy * 1.4 + (Math.random() * 300 - 150),
          rotate: Math.random() * 30 - 15,
          duration: 0.18,
          ease: "power4.out",
        });
      }
    }
  };

  const [escapeMode, setEscapeMode] = useState(true);
  const [teleportMode, setTeleportMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEscapeMode(false);
      setTeleportMode(false);

      gsap.to([meRef.current, youRef.current], {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const teleport = (ref) => {
    const padding = 120;

    const x =
      Math.random() * (window.innerWidth - padding * 2) -
      window.innerWidth / 2 +
      padding;

    const y =
      Math.random() * (window.innerHeight - padding * 2) -
      window.innerHeight / 2 +
      padding;

    gsap.to(ref.current, {
      x,
      y,
      rotate: Math.random() * 40 - 20,
      duration: 0.25,
      ease: "power4.out",
    });
  };

  useEffect(() => {
    if (!escapeMode) return;

    const switcher = setInterval(() => {
      setTeleportMode((prev) => !prev);
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(switcher);
  }, [escapeMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6">
      <h1 className="text-4xl">Rose Day 🌹</h1>

      <p className="max-w-md text-lg">If love had a smell, it would be you.</p>

      {/* QUESTION */}
      {!answered && (
        <div className="bg-white/70 p-4 rounded-xl">
          <p className="mb-3 text-lg">Who fell first? 😏</p>
          <div
            className="flex gap-12 justify-center relative mt-4"
            onMouseMove={(e) => {
            //   handleMouseMove(e, meRef);
              handleMouseMove(e, youRef);
            }}
          >
            <button
              ref={meRef}
            //   disabled={!escapeMode}
              onClick={() => setAnswered(true)}
              className={`px-6 py-2 rounded-full shadow-xl transition bg-rose text-white`}
            >
              Me 😌
            </button>

            <button
              ref={youRef}
              disabled={!escapeMode}
              onClick={() => setAnswered(true)}
              className={`px-6 py-2 rounded-full shadow-xl transition bg-wine text-cream`}
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
        <div ref={gaspRef} className="text-2xl font-bold text-rose">
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
