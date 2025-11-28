
// src/pages/DrawRoom.jsx
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Eraser, Undo, Redo } from "lucide-react";

export default function DrawRoom() {
  const { roomId } = useParams();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctxRef.current = ctx;

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDraw = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctxRef.current.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";
    ctxRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : "#000000";
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDraw = () => setDrawing(false);

  return (
    <>
      {/* Light Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 -z-10"
        style={{
          backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px),
                            linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Mobile Hamburger - Only visible when sidebar is closed */}
      <button
        onClick={() => document.dispatchEvent(new CustomEvent("open-mobile-sidebar"))}
        className="fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur rounded-lg shadow-md hover:bg-white lg:hidden"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Compact Drawing Toolbar - Mobile & Desktop */}
      <div className="fixed top-0 left-0 lg:left-72 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md z-40 flex items-center justify-center gap-4 py-3">
        <button
          onClick={() => setTool("pencil")}
          className={`p-3 rounded-lg transition-all ${
            tool === "pencil"
              ? "bg-teal-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`p-3 rounded-lg transition-all ${
            tool === "eraser"
              ? "bg-teal-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <Eraser className="w-5 h-5" />
        </button>
        <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
          <Undo className="w-5 h-5" />
        </button>
        <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
          <Redo className="w-5 h-5" />
        </button>

        <span className="absolute right-4 text-xs font-medium text-gray-500 hidden sm:block">
          Room: {roomId?.slice(-6)}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 touch-none"
        style={{ marginTop: "64px" }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </>
  );
}
