import { getUser } from "@/lib/models/auth.server";
import { redirect } from "next/navigation";
import Upload from "./upload";

export default async function UploadPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return <Upload user={user} />;
}