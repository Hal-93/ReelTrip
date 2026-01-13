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
import { useUser } from "~/lib/context/user-context";


const TaskBar: React.FC = () => {
  const { user, filesCount } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const avatarUrl = user?.avatar || "";

  const items = [
    { id: "reels", label: "探索", path: "/reels/preview", icon: <FontAwesomeIcon icon={faPlayCircle} /> },
    { id: "favorites", label: "いいね", path: "/favorites", icon: <FontAwesomeIcon icon={faHeart} /> },
    { id: "upload", label: "投稿", path: "/upload", icon: <FontAwesomeIcon icon={faCamera} /> },
    { id: "home", label: "ホーム", path: "/home", icon: <FontAwesomeIcon icon={faHouse} /> },
    { id: "mypage", label: "マイページ", path: "#", icon: null },
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
    <div className="fixed bottom-4 inset-x-0 mx-auto w-[92%] md:w-max max-w-3xl py-2 px-4 md:px-10 bg-white/30 shadow-2xl rounded-[2rem] z-50 backdrop-blur-lg border border-white/20 text-gray-900">
      <div className="flex justify-around md:justify-center items-center gap-x-2 md:gap-x-8 w-full">
        {items.map((item) => (
          <TaskBarItem
            key={item.id}
            label={item.label}
            icon={
              item.id === "mypage" ? (
                avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )
              ) : (
                item.icon
              )
            }
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
          {user && <UserSidebar user={user} filesCount={filesCount} />}
        </SheetContent>
    </Sheet>
    </>
  );
};

export default TaskBar;
