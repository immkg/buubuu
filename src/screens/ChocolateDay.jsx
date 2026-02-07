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
  const piecesRef = useRef([]);
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    imgRef.current.src = "/assets/photos/mayank-richika-2.jpg";
    chocoRef.current.src = "/assets/photos/chocolate-final.png";
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
      // Start the border animation immediately
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

      // Update position
      active.x = newX;
      active.y = newY;

      // Snap to correct position
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
        setPieces([...piecesRef.current]); // update state so React re-renders
      }
      active = null;
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up); // handle pointer leaving canvas

    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, []);

  const transform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Start border animation while keeping puzzle visible
    drawBorderAnimation(canvas, ctx, () => {
      // After 2.5s, show chocolate image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(chocoRef.current, 0, 0, canvas.width, canvas.height);
      gsap.fromTo(
        canvas,
        { opacity: 0 },
        { opacity: 1, duration: 1, onComplete: () => onComplete() }
      );
    });
  };

  // Animate four lines around the canvas edges
  const drawBorderAnimation = (canvas, ctx, onComplete) => {
    const duration = 5; // border animation duration
    const lineWidth = 6;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#D2691E"; // chocolate color

    const timeline = gsap.timeline({ onComplete });

    // Animate all four borders simultaneously
    timeline.to(
      { progress: 0 },
      {
        progress: 1,
        duration,
        ease: "power1.inOut",
        onUpdate: function () {
          const p = this.targets()[0].progress;

          // First, draw the puzzle pieces
          draw(); // <-- reuse your existing draw function to draw puzzle

          // Then draw borders on top
          // Top border
          ctx.beginPath();
          ctx.moveTo(0, lineWidth / 2);
          ctx.lineTo(canvas.width * p, lineWidth / 2);
          ctx.stroke();

          // Right border
          ctx.beginPath();
          ctx.moveTo(canvas.width - lineWidth / 2, 0);
          ctx.lineTo(canvas.width - lineWidth / 2, canvas.height * p);
          ctx.stroke();

          // Bottom border
          ctx.beginPath();
          ctx.moveTo(canvas.width, canvas.height - lineWidth / 2);
          ctx.lineTo(
            canvas.width - canvas.width * p,
            canvas.height - lineWidth / 2
          );
          ctx.stroke();

          // Left border
          ctx.beginPath();
          ctx.moveTo(lineWidth / 2, canvas.height);
          ctx.lineTo(lineWidth / 2, canvas.height - canvas.height * p);
          ctx.stroke();
        },
      }
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 text-center"
      style={{ height: "calc(100vh - 48px)" }}
    >
      <h1 className="text-3xl text-chocolate">Chocolate Day 🍫</h1>
      <p className="text-sm opacity-80">
        Put us back together… with your hands 🤍
      </p>
      <canvas ref={canvasRef} className="shadow-2xl rounded-xl touch-none" />
    </div>
  );
}
