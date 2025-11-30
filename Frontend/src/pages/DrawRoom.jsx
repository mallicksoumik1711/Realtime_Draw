import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { Pencil, Eraser, Undo, Redo } from "lucide-react";

export default function DrawRoom() {
  // const { roomId } = useParams();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [tool, setTool] = useState("pencil");

  const [drawing, setDrawing] = useState(false);

  // deleted code
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Sync with AppLayout's sidebar state
  useEffect(() => {
    const handleOpen = () => setMobileSidebarOpen(true);
    const handleClose = () => setMobileSidebarOpen(false);

    document.addEventListener("open-mobile-sidebar", handleOpen);
    document.addEventListener("close-mobile-sidebar", handleClose);

    return () => {
      document.removeEventListener("open-mobile-sidebar", handleOpen);
      document.removeEventListener("close-mobile-sidebar", handleClose);
    };
  }, []);
  // delete code

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

      {/* Mobile Hamburger — Hidden when sidebar is open */}
      <button
        onClick={() =>
          document.dispatchEvent(new CustomEvent("open-mobile-sidebar"))
        }
        className={`
    fixed top-5 left-4 z-50 p-2 lg:hidden
    ${mobileSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
  `}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Compact Drawing Toolbar - Mobile & Desktop */}
      <div className="fixed top-0 left-0 lg:left-20 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-md z-40 flex items-center justify-end gap-4 py-5 pr-3">
        <button
          onClick={() => setTool("pencil")}
          className={`p-2.5 rounded-md transition-all flex items-center justify-center ${
            tool === "pencil"
              ? "bg-teal-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool("eraser")}
          className={`p-2.5 rounded-md transition-all flex items-center justify-center ${
            tool === "eraser"
              ? "bg-teal-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Eraser className="w-4 h-4" />
        </button>

        <button className="p-2.5 rounded-md text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center">
          <Undo className="w-4 h-4" />
        </button>

        <button className="p-2.5 rounded-md text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center">
          <Redo className="w-4 h-4" />
        </button>
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
