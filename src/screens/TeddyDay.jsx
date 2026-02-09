import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CANVAS_W = 360;
const CANVAS_H = 480;
const GRAVITY = 0.35;

// Teddy movement bounds
const TEDDY_TOP_MIN = CANVAS_H * 0.08;
const TEDDY_TOP_MAX = CANVAS_H * 0.28;
const TEDDY_SPEED = 0.4;

export default function TeddyDay({ onComplete }) {
  const canvasRef = useRef(null);

  /* ---------------- STATE ---------------- */

  const [uiState, setUiState] = useState("angle"); // angle | power | throw | success
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

  /* ---------------- SINGLE TEDDY ---------------- */

  const teddy = useRef({
    x: CANVAS_W / 2,
    y: 120,
    r: 52,
    vx: TEDDY_SPEED,
    vy: TEDDY_SPEED * 0.8,
    img: new Image(),
    hit: false,
  });

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    teddy.current.img.src = "/assets/photos/teddy-big.png";

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
    const raw = (Math.sin(powerTime.current) + 1) / 2;
    const precision = Math.pow(raw, 6);
    const power = 0.15 + precision * 0.85;
    const strength = 7 + power * 11;

    ring.current.vx = Math.sin(lockedAngle.current) * strength;
    ring.current.vy = -Math.cos(lockedAngle.current) * strength;
    ring.current.spin = 0.25 + power * 0.6;
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

  /* ---------------- TEDDY MOVE ---------------- */

  const updateTeddy = () => {
    const t = teddy.current;
    if (t.hit) return;

    t.x += t.vx;
    t.y += t.vy;

    if (t.x < t.r || t.x > CANVAS_W - t.r) t.vx *= -1;
    if (t.y < TEDDY_TOP_MIN || t.y > TEDDY_TOP_MAX) t.vy *= -1;
  };

  /* ---------------- DRAW ---------------- */

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // 👈 VERY IMPORTANT

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Teddy
    if (!teddy.current.hit) {
      const t = teddy.current;
      ctx.drawImage(t.img, t.x - t.r, t.y - t.r, t.r * 2, t.r * 2);
    }

    // Ring
    ctx.save();
    ctx.translate(ring.current.x, ring.current.y);
    drawRing(ctx, ring.current);
    ctx.restore();

    // Aim line
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
    if (stateRef.current === "success") return;

    updateTeddy();

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

    if (stateRef.current === "throw" && ring.current.active) {
      ring.current.vy += GRAVITY;
      ring.current.x += ring.current.vx;
      ring.current.y += ring.current.vy;
      ring.current.rotation += ring.current.spin;

      const t = teddy.current;
      if (!t.hit) {
        const d = Math.hypot(ring.current.x - t.x, ring.current.y - t.y);
        if (d < t.r) {
          t.hit = true;
          ring.current.active = false;
          stateRef.current = "success";
          setUiState("success");
        }
      }

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

    teddy.current.hit = false;

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

      {uiState !== "success" && (
        <>
          <p className="text-sm opacity-80">
            Aim carefully… this teddy keeps moving 💛
          </p>

          <canvas ref={canvasRef} className="rounded-xl shadow-xl" />

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
        </>
      )}

      {/* -------- FINAL TEDDY SCREEN -------- */}
      {uiState === "success" && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <img
            src="/assets/photos/teddy.jpeg"
            alt="Teddy"
            className="w-80 drop-shadow-xl"
          />
          <p className="text-lg">
            You caught my heart…
            <br /> and now this teddy is yours 🧸💛
          </p>
          <button
            onClick={onComplete}
            className="mt-2 px-6 py-2 bg-rose text-white rounded-full"
          >
            Keep Going 💌
          </button>
        </div>
      )}
    </div>
  );
}
