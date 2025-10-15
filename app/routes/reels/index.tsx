import { Link } from 'react-router';

export default function ReelsPage() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 sm:p-20
                    bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white">

      {/* ページタイトル */}
      <h1 className="text-3xl font-bold text-center mb-12">リール動画生成</h1>

      {/* リール生成ボタン */}
      <Link to="/reels-loading">
        <button
          className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600"
        >
          リール動画を生成（あと一回）
        </button>
      </Link>

      {/* 注意文 */}
      <p className="text-xs text-gray-300 mt-2 text-center">
        2回目以降はポイントを消費します。<br/>
        リール動画生成可能回数は0:00にリセットされます。
      </p>
    </div>
  );
}

