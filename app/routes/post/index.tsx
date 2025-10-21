import { useState } from "react";
import { Camera } from "lucide-react";


export default function MyPage() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [season, setSeason] = useState<"春" | "夏" | "秋" | "冬" | null>(null);
  const [checklist, setChecklist] = useState({
    brightness: false,
    center: false,
    focus: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    console.log("投稿データを送信...");
  };

  return (
    <>
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-700 to-blue-900">
      {/* プロフィールセクション */}
      <div className="flex flex-col items-center pt-12 text-white">
        <h1 className="text-3xl font-bold mb-2 p-4">写真投稿</h1>
          {/* 画像アップロード */}
          <label className="relative cursor-pointer flex flex-col items-center mb-4">
            {image ? (
              <img
              src={image}
              alt="preview"
              width={300}
              height={200}
              className="rounded-xl shadow-lg object-cover" 
              style={{ width: '300px', height: '200px' }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-72 h-48 bg-white rounded-xl shadow-md">
                <Camera size={32} className="text-gray-500" />
                <p className="text-gray-600 mt-2">写真選択</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* 位置情報（サンプル） */}
          <div className="text-white text-sm mb-2">
            位置情報: 京都府京都市北区金閣寺町1-2-3
          </div>
          {/* 日付（サンプル） */}
          <div className="text-white text-sm mb-2">
            日付: 2025年10月15日
          </div>

          {/* 金額入力 */}
          <div className="flex items-center gap-2 mb-2">
            <label className="text-white">金額入力（任意）:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-md px-2 py-1 w-24 text-right"
                placeholder="500"
              />
            <span className="text-white">円</span>
          </div>

          {/* 季節選択 */}
          <div className="flex gap-2 mb-2">
            {["春", "夏", "秋", "冬"].map((s) => (
            <button
              key={s}
                onClick={() => setSeason(s as "春" | "夏" | "秋" | "冬")}
              className={`px-4 py-1 rounded-full ${
                season === s
                  ? "bg-orange-400 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {s}
            </button>
            ))}
          </div>

          {/* 位置情報入力フォーム */}
          <div className="flex flex-col w-72 mb-2">
            <label className="text-white text-sm mb-1">位置情報</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例: 京都府京都市北区金閣寺町1-2-3"
              className="rounded-md px-2 py-1"
            />
          </div>

          {/* 日付手入力 */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-white">日にち:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-md px-2 py-1"
                />
            </div>

          {/* チェックリスト */}
      <div className="bg-white rounded-2xl p-4 shadow-md w-72 mb-4">
        <h2 className="text-lg font-bold mb-2 text-gray-700">チェックリスト</h2>
        <div className="flex flex-col gap-2 text-gray-700">
          {[
            { key: "brightness", label: "明るさは十分ですか？" },
            { key: "center", label: "被写体は中心に配置されていますか？" },
            { key: "focus", label: "ピントは合っていますか？" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checklist[item.key as keyof typeof checklist]}
                onChange={() =>
                  setChecklist((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof checklist],
                  }))
                }
                className="accent-blue-500 w-5 h-5"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

          {/* 投稿ボタン */}
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg">
            投稿
          </button>
    
      </div>
    </div>
    </>
  );
}