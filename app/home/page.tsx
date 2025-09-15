
import { getUser } from "@/lib/models/auth.server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getFilesByUser } from "@/lib/models/file.server";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  const files = await getFilesByUser(user.id)

  if (!files.length) {
    return <p>まだアップロードされた画像はありません。</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="relative aspect-square overflow-hidden rounded-md"
        >
          <Image
            src={file.downloadLink}
            alt={file.fileName}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}