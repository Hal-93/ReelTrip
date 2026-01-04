"use client";

import TaskBar from "~/components/taskbar/taskbar";

export default function Favorites() {
  const likedPosts = [
    {
      id: 1,
      name: "玉川屋",
      address: "東京都西多摩郡1-1-1",
      category: "コーヒーショップ・喫茶店",
    },
    {
      id: 2,
      name: "玉川屋",
      address: "東京都西多摩郡1-1-1",
      category: "コーヒーショップ・喫茶店",
    },
    {
      id: 3,
      name: "玉川屋",
      address: "東京都西多摩郡1-1-1",
      category: "コーヒーショップ・喫茶店",
    },
    {
      id: 4,
      name: "玉川屋",
      address: "東京都西多摩郡1-1-1",
      category: "コーヒーショップ・喫茶店",
    },
  ];
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-700 to-blue-900">
        <div className="h-12" /> {/* 上部スペース */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-white">
          <h1 className="text-3xl font-bold mb-2 p-4">スポット</h1>
          {likedPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              {/* 左側の画像プレースホルダーとテキスト */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-300 rounded-md" />
                <div>
                  <p className="font-bold text-white text-xl">{post.name}</p>
                  <p className="text-base text-white/80">{post.address}</p>
                  <p className="text-base text-white/80">{post.category}</p>
                </div>
              </div>

              {/* 右矢印 */}
              <span className="text-white text-3xl">›</span>
            </div>
          ))}
        </div>
      </div>
      <TaskBar />
    </>
  );
}
