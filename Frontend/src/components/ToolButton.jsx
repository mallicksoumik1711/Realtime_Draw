export function ToolButton({ icon: Icon, active, onClick, tooltip }) {
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
}
