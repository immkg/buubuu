import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CANVAS_W = 360;
const CANVAS_H = 480;
const GRAVITY = 0.35;

export default function TeddyDay({ onComplete }) {
  const canvasRef = useRef(null);

  /* ---------------- STATE ---------------- */

  // React state = UI only
  const [uiState, setUiState] = useState("angle");
  const [showNext, setShowNext] = useState(false);

  // REAL state used by animation loop
  const stateRef = useRef("angle");

  /* ---------------- ANGLE ---------------- */

  const angleRef = useRef({ value: 0 });
  const lockedAngle = useRef(0);

  /* ---------------- POWER ---------------- */

  const powerTime = useRef(0);

  /* ---------------- RING ---------------- */

  const ring = useRef({
    x: CANVAS_W / 2,
    y: CANVAS_H - 90,
    baseY: CANVAS_H - 90,
    vx: 0,
    vy: 0,
    r: 14,
    scale: 1,
    rotation: 0,
    spin: 0,
    active: false,
  });

  /* ---------------- TEDDIES ---------------- */

  const teddyImgs = useRef([
    "/assets/photos/teddy-small.png",
    "/assets/photos/teddy-medium.png",
    "/assets/photos/teddy-big.png",
  ]);

  const teddies = useRef([
    { x: 70, y: 120, r: 32, img: new Image(), hit: false },
    { x: 180, y: 100, r: 42, img: new Image(), hit: false },
    { x: 290, y: 130, r: 52, img: new Image(), hit: false },
  ]);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    teddies.current.forEach((t, i) => {
      t.img.src = teddyImgs.current[i];
    });

    startAngleTween();
    requestAnimationFrame(animate);
  }, []);

  /* ---------------- ANGLE TWEEN ---------------- */

  const startAngleTween = () => {
    angleRef.current.value = -Math.PI / 3;

    gsap.killTweensOf(angleRef.current);
    gsap.to(angleRef.current, {
      value: Math.PI / 3,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  };

  const lockAngle = () => {
    gsap.killTweensOf(angleRef.current);

    lockedAngle.current = angleRef.current.value;
    powerTime.current = 0;

    stateRef.current = "power";
    setUiState("power");
  };

  /* ---------------- THROW ---------------- */

  const throwRing = () => {
    // Raw oscillation (0 → 1)
    const raw = (Math.sin(powerTime.current) + 1) / 2;

    // Precision curve: ONLY near the peak is powerful
    // This makes success ~10%
    const precision = Math.pow(raw, 6); // 🔥 key line

    // Clamp minimum so most throws are weak
    const power = 0.15 + precision * 0.85;

    const strength = 7 + power * 11;

    ring.current.vx = Math.sin(lockedAngle.current) * strength;
    ring.current.vy = -Math.cos(lockedAngle.current) * strength;

    ring.current.spin = 0.2 + power * 0.6;
    ring.current.active = true;

    stateRef.current = "throw";
    setUiState("throw");
  };

  /* ---------------- DRAW RING ---------------- */

  const drawRing = (ctx, r) => {
    ctx.save();
    ctx.rotate(r.rotation);
    ctx.scale(r.scale, r.scale);

    ctx.beginPath();
    ctx.arc(0, 0, r.r, 0, Math.PI * 2);
    ctx.strokeStyle = "#f7c948";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, r.r - 3, -Math.PI / 3, Math.PI / 2);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  /* ---------------- DRAW ---------------- */

  const draw = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Teddies
    teddies.current.forEach((t) => {
      if (!t.hit) {
        ctx.drawImage(t.img, t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);
      }
    });

    // Ring
    ctx.save();
    ctx.translate(ring.current.x, ring.current.y);
    drawRing(ctx, ring.current);
    ctx.restore();

    // Angle line (angle + power)
    if (stateRef.current === "angle" || stateRef.current === "power") {
      ctx.save();
      ctx.translate(CANVAS_W / 2, ring.current.baseY);
      ctx.rotate(
        stateRef.current === "angle"
          ? angleRef.current.value
          : lockedAngle.current
      );
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -80);
      ctx.strokeStyle = "#ff5a8a";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }
  };

  /* ---------------- ANIMATE ---------------- */

  const animate = () => {
    // POWER: guaranteed visible pulse
    if (stateRef.current === "power") {
      powerTime.current += 0.025;
      const p = (Math.sin(powerTime.current) + 1) / 2;

      const dist = 40 * p;

      ring.current.scale = 0.7 + Math.pow(p, 0.5) * 1.1;
      ring.current.rotation += 0.06;

      ring.current.x = CANVAS_W / 2 + Math.sin(lockedAngle.current) * dist;
      ring.current.y =
        ring.current.baseY - Math.cos(lockedAngle.current) * dist;
    }

    // THROW PHYSICS
    if (stateRef.current === "throw" && ring.current.active) {
      ring.current.vy += GRAVITY;
      ring.current.x += ring.current.vx;
      ring.current.y += ring.current.vy;
      ring.current.rotation += ring.current.spin;

      teddies.current.forEach((t) => {
        if (!t.hit) {
          const d = Math.hypot(ring.current.x - t.x, ring.current.y - t.y);
          if (d < t.r) {
            t.hit = true;
            ring.current.active = false;
            setShowNext(true);
            stateRef.current = "success";
            setUiState("success");
          }
        }
      });

      if (
        ring.current.y > CANVAS_H + 60 ||
        ring.current.x < -60 ||
        ring.current.x > CANVAS_W + 60
      ) {
        reset();
      }
    }

    draw();
    requestAnimationFrame(animate);
  };

  /* ---------------- RESET ---------------- */

  const reset = () => {
    ring.current = {
      x: CANVAS_W / 2,
      y: CANVAS_H - 90,
      baseY: CANVAS_H - 90,
      vx: 0,
      vy: 0,
      r: 14,
      scale: 1,
      rotation: 0,
      spin: 0,
      active: false,
    };

    stateRef.current = "angle";
    setUiState("angle");
    startAngleTween();
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 text-center"
      style={{ height: "calc(100vh - 48px)" }}
    >
      <h1 className="text-3xl">Teddy Day 🧸</h1>
      <p className="text-sm opacity-80">Build the love… then let it fly 💛</p>

      <canvas ref={canvasRef} className="rounded-xl shadow-xl" />

      {/* SINGLE ACTION BUTTON */}
      {!showNext && (
        <button
          onClick={() => {
            if (uiState === "angle") lockAngle();
            if (uiState === "power") throwRing();
          }}
          disabled={uiState !== "angle" && uiState !== "power"}
          className={`mt-4 px-6 py-3 rounded-full text-white transition ${
            uiState === "angle" || uiState === "power"
              ? "bg-rose animate-pulse"
              : "bg-gray-400 opacity-50"
          }`}
        >
          {uiState === "angle" && "💘 Lock Our Direction"}
          {uiState === "power" && "💖 Send All My Love"}
        </button>
      )}

      {/* NEXT BUTTON */}
      {showNext && (
        <button
          onClick={onComplete}
          className="mt-4 px-6 py-2 bg-rose text-white rounded-full"
        >
          Keep Going 💌
        </button>
      )}
    </div>
  );
}
