import { useNavigate, useLocation } from "react-router";
import TaskBar from "~/components/taskbar/taskbar";
import { Button } from "~/components/ui/button";

export default function ReelsPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoUrl = location.state?.video_url ?? null;

  const handleToMap = () => {
    navigate("/map", {
      state: { from: "reel" },
    });
  };

  return (
    <>
    <TaskBar/>
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex rounded-full bg-black/60 backdrop-blur">
        <Button
          variant="ghost"
          className="rounded-full px-4 text-white"
        >
          リール
        </Button>
        <Button
          variant="ghost"
          className="rounded-full px-4 text-white/70"
          onClick={handleToMap}
        >
          マップ
        </Button>
      </div>
      {videoUrl ? (
        <video
          key={videoUrl}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-300">
          動画が見つかりません
        </div>
      )}

      <div className="absolute right-4 top-1/3 flex flex-col items-center gap-6 text-white">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <span className="text-xs">いいね</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <span className="text-xs">コメント</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <span className="text-xs">シェア</span>
        </div>
      </div>

      <div className="absolute bottom-24 left-4 max-w-[70%]">
        <p className="font-bold text-lg">@あなた</p>
        <p className="text-sm text-gray-200 mt-1">
          キャプションがここに入ります
        </p>
      </div>
    </div>
    </>
  );
}
