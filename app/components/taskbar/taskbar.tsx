import React, { useState } from "react";
import TaskBarItem from "./taskbar-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faCamera,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const TaskBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const items = [
    { id: "home", label: "ホーム", icon: <FontAwesomeIcon icon={faHouse} /> },
    { id: "like", label: "いいね", icon: <FontAwesomeIcon icon={faHeart} /> },
    { id: "post", label: "投稿", icon: <FontAwesomeIcon icon={faCamera} /> },
    {
      id: "mypage",
      label: "マイページ",
      icon: <FontAwesomeIcon icon={faUser} />,
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
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBar;
