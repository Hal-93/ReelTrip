import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // locationを追加
import TaskBarItem from "./taskbar-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faCamera,
  // faUser,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";

const TaskBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const items = [
    { id: "reel", label: "リール", path: "/reels", icon: <FontAwesomeIcon icon={faFilm} /> },
    { id: "like", label: "いいね", path: "/favorites", icon: <FontAwesomeIcon icon={faHeart} /> },
    { id: "post", label: "投稿", path: "/upload", icon: <FontAwesomeIcon icon={faCamera} /> },
    { id: "home", label: "ホーム", path: "/home", icon: <FontAwesomeIcon icon={faHouse} /> },
    // { id: "mypage", label: "マイページ", path: "/mypage", icon: <FontAwesomeIcon icon={faUser} /> },
  ];

  // 現在のURLパスに基づいてアクティブなタブを決定（初期値はhome）
  const activeTab = items.find(item => item.path === location.pathname)?.id || "home";

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