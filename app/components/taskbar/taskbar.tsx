import { useNavigate, useLocation } from "react-router-dom"; // locationを追加
import React from "react";
import TaskBarItem from "./taskbar-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faCamera,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

const TaskBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { id: "home", label: "ホーム", path: "/home", icon: <FontAwesomeIcon icon={faHouse} /> },
    { id: "reels", label: "リール探索", path: "/reels/preview", icon: <FontAwesomeIcon icon={faPlayCircle} /> },
    { id: "favorites", label: "いいね", path: "/favorites", icon: <FontAwesomeIcon icon={faHeart} /> },
    { id: "upload", label: "投稿", path: "/upload", icon: <FontAwesomeIcon icon={faCamera} /> },
  ];

  const activeTab =
    items.find((item) => item.path === location.pathname)?.id || "home";

  return (
    <div className="fixed bottom-4 w-fit mx-auto inset-x-0 py-3 px-16 bg-gray-200/80 shadow-xl rounded-full z-50 backdrop-blur-md text-gray-900">
      <div className="flex justify-center gap-x-10 w-full">
        {items.map((item) => (
          <TaskBarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => {
              navigate(item.path);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBar;
