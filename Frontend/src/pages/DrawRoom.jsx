import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { Pencil, Eraser, Undo, Redo } from "lucide-react";

// -------------------------------------------------------------------------------------
export const ToolButton = ({ icon: Icon, active, onClick, tooltip }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center p-2.5 rounded-lg
        transition-all hover:bg-gray-100
        ${active ? "text-teal-600" : "text-gray-700"}
      `}
    >
      <Icon className="w-4 h-4" />

      {/* Tooltip */}
      <span
        className="
        absolute bottom-full mb-2 px-2 py-1
        bg-gray-800 text-white text-xs rounded opacity-0
        group-hover:opacity-100 transition-all pointer-events-none
        whitespace-nowrap
      "
      >
        {tooltip}
      </span>

      {/* Underline indicator */}
      {active && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600 rounded-full"></span>
      )}
    </button>
  );
};

export const SubToolbar = ({ children }) => {
  return (
    <div
      className="
      flex items-center gap-4 bg-white/90 backdrop-blur-xl
      border border-gray-200 shadow-lg px-4 py-2
      rounded-b-xl animate-in slide-in-from-top duration-200
    "
    >
      {children}
    </div>
  );
};
// -------------------------------------------------------------------------------------

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
    ctxRef.current.lineWidth = brushSize; // ← ADD THIS
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctxRef.current.lineWidth = brushSize; // ← ADD THIS

    ctxRef.current.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";
    ctxRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : "#000000";
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const [brushSize, setBrushSize] = useState(5);

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

      {/* Toolbar in header */}
      <div className="fixed top-0 left-0 lg:left-20 right-0 z-40 flex flex-col items-center">
        {/* Main Toolbar */}
        <div
          className="
      flex items-center gap-1 bg-white/95 backdrop-blur-xl 
      border-b border-gray-200 shadow-md px-4 py-3 rounded-b-xl
    "
        >
          <ToolButton icon={Undo} tooltip="Undo" onClick={() => {}} />
          <ToolButton icon={Redo} tooltip="Redo" onClick={() => {}} />

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* PENCIL */}
          <ToolButton
            icon={Pencil}
            tooltip="Pencil"
            active={tool === "pencil"}
            onClick={() =>
              setTool((prev) => (prev === "pencil" ? null : "pencil"))
            }
          />

          {/* ERASER */}
          <ToolButton
            icon={Eraser}
            tooltip="Eraser"
            active={tool === "eraser"}
            onClick={() =>
              setTool((prev) => (prev === "eraser" ? null : "eraser"))
            }
          />
        </div>

        {/* Sub-toolbar — appears only when tool is active */}
        {!tool && (
          <SubToolbar>
            <div className="flex items-center gap-3 w-40">
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <div
                className="rounded-full bg-black"
                style={{ width: brushSize / 2, height: brushSize / 2 }}
              ></div>
            </div>
          </SubToolbar>
        )}
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
