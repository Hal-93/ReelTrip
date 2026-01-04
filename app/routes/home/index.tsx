import { useLoaderData, redirect, useSearchParams } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { UserSidebar } from "~/components/basic/usermenu";
import { getFilesByUser } from "~/lib/models/file.server";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import TaskBar from "~/components/taskbar/taskbar";

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
  const [selectedImage, setSelectedImage] = useState<(typeof files)[0] | null>(
    null,
  );

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("uploaded") === "1") {
      toast("ポイントを獲得しました！");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />
      <TaskBar/>
      <header className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
        <img src="/icon.png" width={32} height={32} />
        <Sheet>
          <SheetTrigger asChild>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback>
                {user.name?.slice(0, 2)?.toUpperCase() ?? "US"}
              </AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4">
            <UserSidebar user={user} filesCount={files.length} />
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full py-6 px-4 flex gap-6">
        <div className="w-full lg:w-2/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                あなたの投稿
                <span className="text-sm text-muted-foreground">
                  {files.length} 件
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-[1px] bg-white">
                {files.map((file) => (
                  <Dialog
                    key={file.id}
                    open={selectedImage?.id === file.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedImage(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <div
                        className="aspect-square overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(file)}
                      >
                        <img
                          src={file.downloadLink}
                          alt={file.fileName ?? ""}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                      {selectedImage && (
                        <div className="flex flex-col items-center space-y-4">
                          <img
                            src={selectedImage.downloadLink}
                            alt={selectedImage.fileName ?? ""}
                            className="max-w-full max-h-[60vh] object-contain rounded"
                          />
                          <div className="w-full px-2">
                            <p className="text-sm text-muted-foreground">
                              投稿日:{" "}
                              {selectedImage.createdAt
                                ? new Date(
                                    selectedImage.createdAt,
                                  ).toLocaleString()
                                : "---"}{" "}
                              -by @{selectedImage.userId}
                            </p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
                {files.length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-full">
                    まだ投稿がありません。「アップロード」から追加してください。
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <Card className="h-full">
            <CardContent className="space-y-4">
              <UserSidebar user={user} filesCount={files.length} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Link
        to="/upload"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition z-50"
      >
        <Plus />
      </Link>
    </div>
  );
}
