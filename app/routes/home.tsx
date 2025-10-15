export function meta() {
  return [{ title: "ReelTrip" }, { name: "description", content: "ReelTrip" }];
}

import { Link } from 'react-router';
import travelIllustration from '../public/image.png'; // イラスト画像を置く

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 gap-8
                    bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* ウェルカムテキスト */}
      <h1 className="text-3xl font-bold text-center">Reel Trip へようこそ</h1>

      {/* 旅行イラスト */}
      <div className="w-64 h-64 relative">
        <img
          src={travelIllustration}
          alt="旅行している人のイラスト"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* 同意文 */}
      <p className="text-center text-sm sm:text-base max-w-md">
        「同意して続ける」をタップすることにより、あなたは
        利用規約に同意し、プライバシーポリシーを理解したうえで
        REELTRIPによる個人データの取扱いに同意したものとみなされます。
      </p>

      {/* 同意ボタン */}
      <Link to="/signup">
        <button
          className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600"
        >
          同意して続ける
        </button>
      </Link>
    </div>
  );
}