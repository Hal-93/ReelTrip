import React from "react";

interface TaskBarItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TaskBarItem: React.FC<TaskBarItemProps> = ({
  label,
  icon,
  isActive,
  onClick,
}) => {
  const baseClasses =
    "flex flex-1 flex-col items-center justify-center p-2 cursor-pointer transition-all h-16 min-w-[64px]";

  const activeColor = isActive
    ? "text-blue-500 scale-110"
    : "text-gray-900 hover:text-white";

  const highlightClass = isActive ? "rounded-xl bg-gray-600/50" : "";

  return (
    <div
      className={`${baseClasses} ${activeColor} ${highlightClass}`}
      onClick={onClick}
    >
      <div className="text-xl md:text-2xl mb-1">{icon}</div>
      <span className="text-[10px] md:text-xs whitespace-nowrap font-medium">{label}</span>
    </div>
  );
};

export default TaskBarItem;
