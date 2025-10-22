import { Link } from "react-router";

export default function SignUpPage() {
  return (
    <div
      className="font-sans flex flex-col items-center min-h-screen p-8 sm:p-20 gap-6
                 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white"
    >
      {/* ヘッダー */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 relative">
          {/* ここで自分の画像を読み込めます */}
          <img
            src="/rounded_image 1.png" // ← public フォルダに保存した画像ファイル名に変更
            alt="App Icon"
            style={{ objectFit: "contain" }}
          />
        </div>
        <h1 className="text-3xl font-bold">Reel Trip</h1>
      </div>

      {/* フォーム */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="email"
          placeholder="メールアドレス"
          className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="パスワード"
          className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="パスワード確認"
          className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* アカウントタイプ */}
        <select className="px-4 py-3 rounded-lg bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="general">一般</option>
          <option value="municipality">自治体</option>
        </select>

        {/* 新規登録ボタン */}

        <Link to="/user-settings" className="inline-block w-full">
          <button className="mt-4 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 w-full">
            新規登録
          </button>
        </Link>
      </div>

      {/* ログインリンク */}
      <div className="mt-4">
        <Link to="/login">
          <button className="text-sm underline text-white">
            アカウントをお持ちの方はこちら
          </button>
        </Link>
      </div>
    </div>
  );
}
