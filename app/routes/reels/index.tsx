export async function loader() {
  return { files: [] };
}

import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export default function ReelsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `api/group?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();
          const group = Array.isArray(data) ? data : data.group;
          if (Array.isArray(group)) {
            setFiles(group.map((g: { key: string }) => g.key));
          }
        } catch {
          // fail silently
        }
      },
      () => {
        // fail silently
      }
    );
  }, []);

  return (
    <div
      className="font-sans flex flex-col items-center justify-center min-h-screen p-8 sm:p-20
                    bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white"
    >
      <h1 className="text-3xl font-bold text-center mb-12">リール動画生成</h1>

      <button
        onClick={async () => {
          if (files.length === 0) {
            return;
          }
          setLoading(true);

          const selected = files;

          const res = await fetch("http://127.0.0.1:8000/make-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keys: selected }),
          });

          const data = await res.json();
          console.log("data:", data);
          setLoading(false);

          navigate("/reels/preview", {
            state: { video_url: data.video_url },
          });
        }}
        className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600"
      >
        リール動画を生成（あと∞回）
      </button>

      <p className="text-xs text-gray-300 mt-2 text-center">
        2回目以降はポイントを消費します。
        <br />
        リール動画生成可能回数は0:00にリセットされます。
      </p>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
          <span className="text-lg font-semibold">生成中...</span>
        </div>
      )}
    </div>
  );
}
