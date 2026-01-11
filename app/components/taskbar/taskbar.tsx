import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import TaskBarItem from "./taskbar-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faHeart,
  faCamera,
  faPlayCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { UserSidebar } from "~/components/basic/usermenu";

interface TaskBarProps {
  user?: any;
  filesCount?: number;
}

const TaskBar: React.FC<TaskBarProps> = ({ user, filesCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const items = [
    { id: "home", label: "ホーム", path: "/home", icon: <FontAwesomeIcon icon={faHouse} /> },
    { id: "reels", label: "リール探索", path: "/reels/preview", icon: <FontAwesomeIcon icon={faPlayCircle} /> },
    { id: "upload", label: "投稿", path: "/upload", icon: <FontAwesomeIcon icon={faCamera} /> },
    { id: "favorites", label: "いいね", path: "/favorites", icon: <FontAwesomeIcon icon={faHeart} /> },
    { id: "mypage", label: "マイページ", path: "#", icon: <FontAwesomeIcon icon={faUser} /> },
  ];

  const pathname = location.pathname;
  
  const normalizedPath =
    pathname === "/reels" || pathname === "/map"
      ? "/reels/preview"
      : pathname;

  const activeTab =
    items.find((item) =>
      normalizedPath.startsWith(item.path),
    )?.id || "home";

  return (
    <>
    <div className="fixed bottom-4 w-fit mx-auto inset-x-0 py-3 px-16 bg-gray-200/80 shadow-xl rounded-full z-50 backdrop-blur-md text-gray-900">
      <div className="flex justify-center gap-x-10 w-full">
        {items.map((item) => (
          <TaskBarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={item.id === "mypage" ? isSidebarOpen : activeTab === item.id}
            onClick={() => {
                if (item.id === "mypage") {
                  setIsSidebarOpen(true); // マイページならサイドバーを開く
                } else {
                  navigate(item.path);
                }
              }}
          />
        ))}
      </div>
    </div>

    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
  <SheetContent side="left" className="w-80 p-4">
    {/* userが存在する場合のみUserSidebarを表示 */}
    {user ? (
      <UserSidebar user={user} filesCount={filesCount} />
    ) : (
      <div className="flex items-center justify-center h-full">
        <p>読み込み中...</p>
      </div>
    )}
  </SheetContent>
</Sheet>
    </>
  );
};

export default TaskBar;
