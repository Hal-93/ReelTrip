import { redirect, useNavigate, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { useState } from "react";
import { getUser } from "~/lib/models/auth.server";


export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/signup");
  }

  return { user };
}

export default function ReelsPage() {
  const navigate = useNavigate();
  const { user } = useLoaderData() as { user: { id: string } };
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [preference, setPreference] = useState<"見る" | "遊ぶ" | "食べる">("見る");

  return (
    <div
      className="font-sans flex flex-col items-center justify-center min-h-screen p-8 sm:p-20
                    bg-gradient-to-b bg-gradient-to-b from-[#1b73ce] via-blue-800 to-[#023c73] text-white"
    >

      <div className="mb-8 w-full max-w-md">
        <p className="text-sm font-semibold mb-3 text-center text-blue-200">
          今の気分を選択
        </p>
        <div className="flex gap-4 justify-center">
          {(["見る", "遊ぶ", "食べる"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreference(p)}
              className={`px-5 py-2 rounded-full border transition
                ${
                  preference === p
                    ? "bg-white text-blue-800 border-white shadow-lg"
                    : "bg-blue-700/40 text-white border-blue-300 hover:bg-blue-600"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={async () => {
          setLoading(true);

          let fetchedFiles: string[] = [];
          try {
            const res = await fetch("/api/image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ preference, userId: user.id }),
            });

            const data = await res.json();
            if (Array.isArray(data.keys)) {
              fetchedFiles = data.keys;
              setFiles(data.keys);
            }
          } catch {
            // fail silently
          }

          if (fetchedFiles.length === 0) {
            setLoading(false);
            return;
          }

          const resVideo = await fetch("/py/make-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              keys: fetchedFiles,
              preference,
            }),
          });

          const dataVideo = await resVideo.json();
          console.log("data:", dataVideo);

          await fetch("/api/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              keys: fetchedFiles,
              videoObjectName: dataVideo.video_key,
              downloadLink: dataVideo.video_url,
            }),
          });

          setLoading(false);

          navigate("/reels/preview");
        }}
        className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600"
      >
        リール動画を生成（あと∞回）
      </button>

      <p className="text-xs text-gray-300 mt-2 text-center">
        リール動画生成可能回数は0:00にリセットされます
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
