"use client";

import { Pencil, Plus } from "lucide-react";
import Link from "next/link";


export default function MyPage() {
  return (
    <>
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-700 to-blue-900">
      {/* プロフィールセクション */}
      <div className="flex flex-col items-center pt-12">
        {/* プロフィール画像 */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
              />
            </svg>
          </div>
          {/* プロフィール画像の編集アイコン */}
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
            <Plus size={16} className="text-purple-600" />
          </button>
        </div>

        {/* ニックネーム・編集ボタン */}
        <div className="flex items-center mt-4 space-x-2">
          <h2 className="text-white font-bold text-lg">ニックネーム</h2>
          <Link href="/edit-settings">
            <button className="flex items-center text-sm bg-white text-black px-3 py-1 rounded-full shadow">
             編集
              <Pencil size={14} className="ml-1" />
            </button>
          </Link>
          
        </div>
        <p className="text-white mt-1 text-sm">所持ポイント数 XX</p>
      </div>

      {/* 投稿履歴 */}
      <div className="grid grid-cols-3 gap-2 p-4 mt-6">
        <div className="col-span-3 text-white text-sm mb-2">
          自分の投稿履歴
        </div>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 aspect-square rounded-lg"
          />
        ))}
      </div>
    </div>
    </>
  );
}