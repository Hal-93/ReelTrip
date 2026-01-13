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
    "flex flex-1 flex-col items-center justify-center py-1 px-1 cursor-pointer min-w-0";

  const activeColor = isActive
    ? "text-blue-500"
    : "text-gray-900 hover:text-white";

  const highlightClass = isActive ? "bg-blue-50/40 rounded-2xl" : "";

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
