import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../store/toastSlice";

// Lightweight toast following app's Tailwind theme
export default function Toast() {
  const dispatch = useDispatch();
  const { visible, message, type } = useSelector((s) => s.toast);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dispatch(hideToast()), 2500);
    return () => clearTimeout(t);
  }, [visible, dispatch]);

  if (!visible) return null;

  const color =
    type === "success"
      ? "bg-teal-600 text-white"
      : type === "error"
      ? "bg-red-600 text-white"
      : type === "warning"
      ? "bg-yellow-500 text-gray-900"
      : "bg-gray-800 text-white";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className={`px-4 py-2 rounded-full shadow-lg ${color} backdrop-blur-xl`}> 
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
