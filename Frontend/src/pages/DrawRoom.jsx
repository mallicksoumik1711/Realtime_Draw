import { useState, useRef, useEffect } from "react";
import { Pencil, Eraser, Undo, Redo, Palette } from "lucide-react";
import { ToolButton } from "../components/ToolButton";
import { SubToolbar } from "../components/SubToolBar";
import { useParams } from "react-router-dom";
import {
  getSocket,
  connectUserSocket,
  joinRoom,
  leaveRoom,
} from "../socket/userStatus";
import { getRoomById } from "../api/room";

export default function DrawRoom() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("Loading...");

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getRoomById(roomId, token);

        // backend returns { success, room }
        setRoomName(res.room.name);
      } catch (err) {
        console.error("Failed to load room:", err);
        setRoomName("Untitled Room");
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    let sock = getSocket();
    if (!sock) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.id) {
        connectUserSocket(String(user.id));
        sock = getSocket();
      }
    }
    if (!sock) return;

    joinRoom(roomId);

    return () => {
      leaveRoom(roomId);
    };
  }, [roomId]);

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

  useEffect(() => {
    const s = getSocket();
    if (!s) return;
    const onDraw = ({ x, y, tool, color, brushSize }) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.beginPath(); // ✅ ADD THIS
      ctx.moveTo(x, y);

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.globalCompositeOperation =
        tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;

      ctx.lineTo(x, y);
      ctx.stroke();
    };
    s.on("draw", onDraw);

    return () => s.off("draw", onDraw);
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
    ctxRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    const s = getSocket();
    if (s && s.connected)
      s.emit("draw", {
        roomId,
        data: {
          x,
          y,
          tool,
          color,
          brushSize,
        },
      });

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const [brushSize, setBrushSize] = useState(5);

  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);

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
      <div className="fixed top-2 left-0 lg:left-20 right-5 z-40 flex flex-col items-end">
        <div className="mb-3 text-center">
          <h1 className="text-sm sm:text-2xl font-bold text-gray-900">
            {roomName}
          </h1>
          <p className="text-xs text-gray-500 mt-1">Room ID: {roomId}</p>
        </div>

        {/* Main Toolbar */}
        <div
          className="
      flex items-center gap-1 bg-white/95 backdrop-blur-xl 
      border-b border-gray-200 shadow-md px-4 py-3 rounded-xl
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
            onClick={() => {
              setShowColorPicker(false);
              setTool((prev) => (prev === "pencil" ? null : "pencil"));
            }}
          />

          {/* ERASER */}
          <ToolButton
            icon={Eraser}
            tooltip="Eraser"
            active={tool === "eraser"}
            onClick={() => {
              setShowColorPicker(false);
              setTool((prev) => (prev === "eraser" ? null : "eraser"));
            }}
          />

          <ToolButton
            icon={Palette}
            tooltip="Color"
            active={tool === "color"}
            onClick={() => {
              setTool((prev) => (prev === "color" ? null : "color"));
              setShowColorPicker(!showColorPicker);
            }}
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

        {tool === "color" && showColorPicker && (
          <SubToolbar>
            <div className="grid grid-cols-6 gap-3 p-2">
              {[
                "#FF5252",
                "#FF4081",
                "#E040FB",
                "#7C4DFF",
                "#536DFE",
                "#448AFF",
                "#40C4FF",
                "#18FFFF",
                "#64FFDA",
                "#69F0AE",
                "#B2FF59",
                "#EEFF41",
                "#FFFF00",
                "#FFD740",
                "#FFAB40",
                "#FF6E40",
                "#795548",
                "#9E9E9E",
                "#607D8B",
                "#000000",
                "#FFFFFF",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setTool("pencil");
                    setShowColorPicker(false);
                  }}
                  className="w-7 h-7 rounded-full shadow-lg active:scale-90 transition"
                  style={{ backgroundColor: c }}
                />
              ))}
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
