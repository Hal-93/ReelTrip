import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskBarItem from "./taskbar-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faCamera,
  faUser,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

const TaskBar: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const items = [
    { id: "home", label: "ホーム", path: "/home", icon: <FontAwesomeIcon icon={faHouse} /> },
    { id: "like", label: "いいね", path: "/like", icon: <FontAwesomeIcon icon={faHeart} /> },
    { id: "post", label: "投稿", path: "/upload", icon: <FontAwesomeIcon icon={faCamera} /> },
    {
      id: "mypage",
      label: "リール探索",
      path: "/reels",
      icon: <FontAwesomeIcon icon={faPlayCircle} />,
    },
  ];

  return (
    <div className="fixed bottom-4 w-fit mx-auto inset-x-0 p-3 bg-gray-200/90 shadow-xl rounded-full z-50 backdrop-blur-md text-gray-900">
      <div className="flex justify-center gap-x-8 w-full">
        {items.map((item) => (
          <TaskBarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => {
              setActiveTab(item.id);
              navigate(item.path);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBar;
