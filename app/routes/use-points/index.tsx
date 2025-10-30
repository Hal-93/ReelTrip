import React from "react";
import { Link } from "react-router";

export default function ReelsGeneratePage() {
  return (
    <div
      className="relative min-h-screen flex flex-col justify-between
                 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white p-6"
    >
      {/* 左上の戻るボタン */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => window.history.back()}
          className="text-white text-2xl font-bold"
        >
          ←
        </button>
      </div>

      {/* 中央下のボタンと補足文 */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
        <Link to="/popup">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg text-lg w-80 text-center"
          >
            ポイントを使用してリール動画を生成
          </button>
        </Link>
        <div className="text-white text-sm text-center w-80">
          2回目以降はポイントを消費します<br />
          リール動画生成可能回数は0:00にリセットされます
        </div>
      </div>
    </div>
  );
}
