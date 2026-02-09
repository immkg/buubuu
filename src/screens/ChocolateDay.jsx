import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ROWS = 3;
const COLS = 3;
const CANVAS_SIZE = 360;
const SNAP_DISTANCE = 26;

export default function ChocolateDay({ onComplete }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const chocoRef = useRef(new Image());
  const cutoutRef = useRef(new Image());
  const piecesRef = useRef([]);
  const [pieces, setPieces] = useState([]);
  const [showNext, setShowNext] = useState(false);

  // Floating images refs
  const floatingRef = useRef([]);

  useEffect(() => {
    imgRef.current.src = "/assets/photos/mayank-richika-2.jpg";
    chocoRef.current.src = "/assets/photos/chocolate-final.jpeg";
    cutoutRef.current.src = "/assets/photos/chocolate.png";
    imgRef.current.onload = initPuzzle;
  }, []);

  const initPuzzle = () => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const img = imgRef.current;
    const scale = Math.min(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );

    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const ox = (canvas.width - dw) / 2;
    const oy = (canvas.height - dh) / 2;

    const pw = dw / COLS;
    const ph = dh / ROWS;

    const list = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        list.push({
          id: r * COLS + c,
          sx: (c * img.naturalWidth) / COLS,
          sy: (r * img.naturalHeight) / ROWS,
          sw: img.naturalWidth / COLS,
          sh: img.naturalHeight / ROWS,
          x: Math.random() * (canvas.width - pw),
          y: Math.random() * (canvas.height - ph),
          cx: ox + c * pw,
          cy: oy + r * ph,
          w: pw,
          h: ph,
          locked: false,
        });
      }
    }

    piecesRef.current = list;
    setPieces(list);
    draw(list);
  };

  const draw = (list = piecesRef.current) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    list.forEach((p) => {
      ctx.drawImage(imgRef.current, p.sx, p.sy, p.sw, p.sh, p.x, p.y, p.w, p.h);
    });
  };

  const checkCompletion = () => {
    if (piecesRef.current.every((p) => p.locked)) {
      transform();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    let active = null;
    let ox = 0;
    let oy = 0;

    const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

    const down = (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;

      for (let i = piecesRef.current.length - 1; i >= 0; i--) {
        const p = piecesRef.current[i];
        if (
          !p.locked &&
          mx > p.x &&
          mx < p.x + p.w &&
          my > p.y &&
          my < p.y + p.h
        ) {
          active = p;
          ox = mx - p.x;
          oy = my - p.y;
          break;
        }
      }
    };

    const move = (e) => {
      if (!active || active.locked) return;
      const r = canvas.getBoundingClientRect();
      let newX = e.clientX - r.left - ox;
      let newY = e.clientY - r.top - oy;

      newX = clamp(newX, 0, canvas.width - active.w);
      newY = clamp(newY, 0, canvas.height - active.h);

      active.x = newX;
      active.y = newY;

      if (
        Math.hypot(active.x - active.cx, active.y - active.cy) < SNAP_DISTANCE
      ) {
        active.x = active.cx;
        active.y = active.cy;
        active.locked = true;
      }

      draw();
      checkCompletion();
    };

    const up = () => {
      if (active) {
        draw();
        setPieces([...piecesRef.current]);
      }
      active = null;
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, []);

  // -------------------- TRANSFORM + FLOATING --------------------
  const transform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    drawBorderAnimation(canvas, ctx, () => {
      startFloatingCutouts();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(chocoRef.current, 0, 0, canvas.width, canvas.height);
      setShowNext(true);
    });
  };

  // -------------------- FLOATING CUTOUTS IN BACKGROUND --------------------
  const startFloatingCutouts = () => {
    const numFloating = Math.floor(
      (window.innerWidth * window.innerHeight) / 70000
    );

    // Remove old floating divs if any
    floatingRef.current.forEach((f) => f.el.remove());
    floatingRef.current = [];

    for (let i = 0; i < numFloating; i++) {
      const img = cutoutRef.current;
      const w = 60 + Math.random() * 40;
      const h = (img.naturalHeight / img.naturalWidth) * w;
      const el = document.createElement("img");
      el.src = img.src;
      el.style.position = "fixed";
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.top = `${Math.random() * (window.innerHeight - h)}px`;
      el.style.left = `${Math.random() * (window.innerWidth - w)}px`;
      el.style.pointerEvents = "none";
      el.style.userSelect = "none";
      el.style.zIndex = 0; // background
      document.body.appendChild(el);

      floatingRef.current.push({
        el,
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
        w,
        h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      floatingRef.current.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;

        // Bounce off window edges
        if (f.x < 0 || f.x + f.w > window.innerWidth) f.vx *= -1;
        if (f.y < 0 || f.y + f.h > window.innerHeight) f.vy *= -1;

        f.el.style.left = `${f.x}px`;
        f.el.style.top = `${f.y}px`;
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  // -------------------- BORDER ANIMATION --------------------
  const drawBorderAnimation = (canvas, ctx, onComplete) => {
    const duration = 3.5;
    const lineWidth = 6;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#D2691E";

    const timeline = gsap.timeline({ onComplete });

    timeline.to(
      { progress: 0 },
      {
        progress: 1,
        duration,
        ease: "power1.inOut",
        onUpdate: function () {
          const p = this.targets()[0].progress;

          draw();

          ctx.beginPath();
          ctx.moveTo(0, lineWidth / 2);
          ctx.lineTo(canvas.width * p, lineWidth / 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(canvas.width - lineWidth / 2, 0);
          ctx.lineTo(canvas.width - lineWidth / 2, canvas.height * p);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(canvas.width, canvas.height - lineWidth / 2);
          ctx.lineTo(
            canvas.width - canvas.width * p,
            canvas.height - lineWidth / 2
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(lineWidth / 2, canvas.height);
          ctx.lineTo(lineWidth / 2, canvas.height - canvas.height * p);
          ctx.stroke();
        },
      }
    );
  };

  const clearFloatingCutouts = () => {
    floatingRef.current.forEach((f) => {
      if (f.el && f.el.parentNode) {
        f.el.parentNode.removeChild(f.el);
      }
    });
    floatingRef.current = [];
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 text-center"
      style={{ height: "calc(100vh - 48px)", position: "relative", zIndex: 10 }}
    >
      <h1 className="text-3xl text-chocolate">Chocolate Day 🍫</h1>
      <p className="text-sm opacity-80">
        Put us back together… with your hands 🤍
      </p>
      <canvas
        ref={canvasRef}
        className="shadow-2xl rounded-xl touch-none z-10"
        style={{ zIndex: 10 }}
      />
      {showNext && (
        <button
          className="text-white mt-4 px-6 py-2 bg-rose rounded-full animate-fade-in"
          onClick={() => {
            clearFloatingCutouts();
            onComplete();
          }}
        >
          Keep Going 💌
        </button>
      )}
    </div>
  );
}
