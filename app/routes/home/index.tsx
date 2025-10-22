import { useLoaderData, redirect } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import { getFilesByUser } from "~/lib/models/file.server";
import { Pencil, Plus } from "lucide-react";
import { Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }

  const files = await getFilesByUser(user.id);


  return { user, files };
}

export default function Home() {
  const { user, files } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-700 to-blue-900">
      {/* プロフィールセクション */}
      <div className="flex flex-col items-center pt-12">
        {/* プロフィール画像 */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center">
            <img
              src={user.avatar || ""}
              className="rounded-full border w-24 h-24 object-cover"
            />
          </div>
          {/* プロフィール画像の編集アイコン */}
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
            <Plus size={16} className="text-purple-600" />
          </button>
        </div>

        {/* ニックネーム・編集ボタン */}
        <div className="flex items-center mt-4 space-x-2">
          <h2 className="text-white font-bold text-lg">{user.name}</h2>
          <Link to="/edit-settings">
            <button className="flex items-center text-sm bg-white text-black px-3 py-1 rounded-full shadow">
              編集
              <Pencil size={14} className="ml-1" />
            </button>
          </Link>
        </div>
        <p className="text-white mt-1 text-sm">X ポイント</p>
      </div>

      {/* 投稿履歴 */}
      <div className="grid grid-cols-3 gap-2 p-4 mt-6">
        <div className="col-span-3 text-white text-sm mb-2">投稿</div>
        {files.map((file) => (
          <div
            key={file.id}
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <img
              src={file.downloadLink}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}