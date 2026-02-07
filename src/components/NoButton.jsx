import { useState } from "react";

export default function NoButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = () => {
    setPos({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
  };

  return (
    <button
      onMouseEnter={move}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
      className="px-6 py-3 bg-gray-300 rounded-full text-lg transition-transform duration-150"
    >
      NO 😤
    </button>
  );
}
