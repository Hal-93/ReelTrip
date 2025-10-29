import { useState } from "react";
import { Link } from "react-router";

export default function UserSettingsPage() {
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [prefecture, setPrefecture] = useState("");

  return (
    <div
      className="font-sans flex flex-col items-center min-h-screen p-8 sm:p-20 gap-6
                    bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white"
    >
      {/* ヘッダー */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <h1 className="text-3xl font-bold">Reel Trip</h1>
      </div>

      {/* フォーム */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="ユーザーID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="ニックネーム"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 居住地選択（47都道府県） */}
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">居住地を選択</option>
          <option value="北海道">北海道</option>
          <option value="青森県">青森県</option>
          <option value="岩手県">岩手県</option>
          <option value="宮城県">宮城県</option>
          <option value="秋田県">秋田県</option>
          <option value="山形県">山形県</option>
          <option value="福島県">福島県</option>
          <option value="茨城県">茨城県</option>
          <option value="栃木県">栃木県</option>
          <option value="群馬県">群馬県</option>
          <option value="埼玉県">埼玉県</option>
          <option value="千葉県">千葉県</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
          <option value="新潟県">新潟県</option>
          <option value="富山県">富山県</option>
          <option value="石川県">石川県</option>
          <option value="福井県">福井県</option>
          <option value="山梨県">山梨県</option>
          <option value="長野県">長野県</option>
          <option value="岐阜県">岐阜県</option>
          <option value="静岡県">静岡県</option>
          <option value="愛知県">愛知県</option>
          <option value="三重県">三重県</option>
          <option value="滋賀県">滋賀県</option>
          <option value="京都府">京都府</option>
          <option value="大阪府">大阪府</option>
          <option value="兵庫県">兵庫県</option>
          <option value="奈良県">奈良県</option>
          <option value="和歌山県">和歌山県</option>
          <option value="鳥取県">鳥取県</option>
          <option value="島根県">島根県</option>
          <option value="岡山県">岡山県</option>
          <option value="広島県">広島県</option>
          <option value="山口県">山口県</option>
          <option value="徳島県">徳島県</option>
          <option value="香川県">香川県</option>
          <option value="愛媛県">愛媛県</option>
          <option value="高知県">高知県</option>
          <option value="福岡県">福岡県</option>
          <option value="佐賀県">佐賀県</option>
          <option value="長崎県">長崎県</option>
          <option value="熊本県">熊本県</option>
          <option value="大分県">大分県</option>
          <option value="宮崎県">宮崎県</option>
          <option value="鹿児島県">鹿児島県</option>
          <option value="沖縄県">沖縄県</option>
        </select>

        {/* 設定ボタン */}

        <Link to="/preferences" className="inline-block w-full">
          <button className="mt-4 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 w-full">
            設定
          </button>
        </Link>
      </div>
    </div>
  );
}
