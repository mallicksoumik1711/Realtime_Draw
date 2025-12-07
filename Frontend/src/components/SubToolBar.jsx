export function SubToolbar({ children }) {
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
}
