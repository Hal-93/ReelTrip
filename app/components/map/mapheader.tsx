import { ArrowLeft, Circle, MapPin } from "lucide-react"


export function CardDemo() {
  return (
    // 画像の水色部分全体のコンテナ
    // padding, 背景色、角丸は画像に合わせる
    <div className="bg-[#4a90e2] p-4 rounded-xl shadow-lg w-full max-w-md">
      {/* 戻るボタンと入力フォームのコンテナ */}
      <div className="flex items-center space-x-3">
        {/* 戻る矢印アイコン */}
        <ArrowLeft className="text-white h-6 w-6 cursor-pointer" />

        {/* 入力フォーム部分のコンテナ */}
        <div className="flex-1 flex flex-col space-y-2">
          {/* 現在地の入力行 */}
          <div className="flex items-center space-x-3">
            {/* 現在地の青い丸アイコン */}
            <Circle fill="white" className="text-cyan-400 h-3 w-3 fill-current" />
            
            {/* 現在地のInput風の表示 */}
            <div className="flex-1 border-b border-white pb-1">
              <span className="text-white text-base opacity-90">現在地</span>
            </div>
          </div>

          {/* アイコン間の縦線（画像では見えにくいですが、場所を示すための視覚要素） */}
          <div className="ml-[13px] h-3 border-l border-white/50"></div> 

          {/* 目的地の入力行 */}
          <div className="flex items-center space-x-3">
            {/* 目的地の赤いピンアイコン */}
            <MapPin className="text-red-500 h-6 w-6" />
            
            {/* 目的地のInput風の表示 */}
            <div className="flex-1 border-b border-white pb-1">
              <span className="text-white text-lg font-medium">玉川屋</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}