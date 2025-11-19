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
    "flex flex-col items-center justify-center p-2 cursor-pointer transition-colors h-16";

  const activeColor = isActive
    ? "text-blue-500"
    : "text-gray-900 hover:text-white";

  const highlightClass = isActive ? "rounded-xl bg-gray-600/50" : "";

  return (
    <div
      className={`${baseClasses} ${activeColor} ${highlightClass}`}
      onClick={onClick}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default TaskBarItem;
