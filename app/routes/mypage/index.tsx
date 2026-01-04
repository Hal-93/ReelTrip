// import React, { FC } from "react";
// import { Pencil, Plus, Home, Heart, Upload, User } from "lucide-react";

import type { FC } from "react";
import { Pencil, Plus, User } from "lucide-react";


const MyPage: FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-700 to-blue-900">
      <div className="flex flex-col items-center pt-12">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center">
            <User size={48} className="text-purple-600" />
          </div>
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
            <Plus size={16} className="text-purple-600" />
          </button>
        </div>

        <div className="flex items-center mt-4 space-x-2">
          <h2 className="text-white font-bold text-lg">ニックネーム</h2>
          <button className="flex items-center text-sm bg-white text-black px-3 py-1 rounded-full shadow">
            編集
            <Pencil size={14} className="ml-1" />
          </button>
        </div>

        <p className="text-white mt-1 text-sm">所持ポイント数 XX</p>
      </div>

      {/* 投稿履歴 */}
      <div className="grid grid-cols-3 gap-2 p-4 mt-6 flex-1">
        <div className="col-span-3 text-white text-sm mb-2">自分の投稿履歴</div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default MyPage;
