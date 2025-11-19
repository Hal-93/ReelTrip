import { useNavigate, useLocation } from "react-router";
import { Button } from "~/components/ui/button";

export default function ReelsPreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoUrl = location.state?.video_url ?? null;

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">

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
          ReelTrip が自動生成したリール動画です。<br />
          気に入ったら投稿してみよう！
        </p>
      </div>

      <div className="absolute bottom-6 w-full flex justify-center gap-4 px-4">
        <Button
          className="bg-white/20 hover:bg-white/30 text-white px-6"
          onClick={() => navigate("/reels")}
        >
          再生成する
        </Button>

        <Button
          className="bg-blue-500 hover:bg-blue-600 px-6"
          onClick={() => {
            navigate("/reels");
          }}
        >
          このリールで投稿
        </Button>
      </div>

    </div>
  );
}
