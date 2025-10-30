import { ArrowLeft, Circle, MapPin } from "lucide-react";

export function MapHeader() {
  return (
    // 画像の水色部分全体のコンテナ
    // padding, 背景色、角丸は画像に合わせる
    <div className="flex items-center pt-2" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
      <ArrowLeft className="text-whit h-6 w-1/12 cursor-pointer" />
      <div className="bg-[#004f83] bg-opacity-80 p-4 rounded-xl shadow-lg w-10/12">
        {/* 戻るボタンと入力フォームのコンテナ */}
        <div className="flex items-center space-x-3">
          {/* 入力フォーム部分のコンテナ */}
          <div className="flex-1 flex flex-col space-y-2">
            {/* 現在地の入力行 */}
            <div className="flex items-center space-x-3">
              {/* 現在地アイコン */}
              <div className="relative flex items-center justify-center">
                <Circle className="h-6 w-6 text-sky-500" />
                <Circle className="absolute h-2.5 w-2.5  fill-sky-500 stroke-0" />
              </div>

              {/* 現在地 */}
              <div className="flex-1">
                <span className="text-white text-lg font-medium">現在地</span>
              </div>
            </div>

            <div className="flex-1 border-b border-white"></div>

            {/* 目的地の入力行 */}
            <div className="flex items-center space-x-3">
              {/* 目的地のアイコン */}
              <MapPin className="text-red-500 h-6 w-6 " />

              {/* 目的地 */}
              <div className="flex-1">
                <span className="text-white text-lg font-medium">玉川屋</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
