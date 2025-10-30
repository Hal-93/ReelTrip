import { useLoaderData, redirect } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import { getFilesByUser } from "~/lib/models/file.server";
import { Pencil } from "lucide-react";
import { Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b lg:hidden">
        <img src="/icon.png" width={32} height={32}/>
        <Sheet>
          <SheetTrigger asChild>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback>{user.name?.slice(0, 2)?.toUpperCase() ?? "US"}</AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4">
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback>{user.name?.slice(0, 2)?.toUpperCase() ?? "US"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link to="/edit-settings" className="flex items-center gap-1">
                  <Pencil className="h-4 w-4" />
                  編集
                </Link>
              </Button>
              <div>
                <p className="text-xs text-muted-foreground mb-1">統計</p>
                <div className="flex gap-3">
                  <div>
                    <p className="text-base font-semibold">{files.length}</p>
                    <p className="text-xs text-muted-foreground">投稿数</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">フォロー</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">フォロワー</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="h-28 rounded-sm border bg-muted/30">
                <div className="p-2 space-y-2">
                  <p className="text-xs text-muted-foreground">ここにお知らせを表示できます。</p>
                  <p className="text-xs text-muted-foreground">最近アップロードしたファイルの処理状況など。</p>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full py-6 px-4 flex gap-6">
        <div className="w-full lg:w-2/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                あなたの投稿
                <span className="text-sm text-muted-foreground">{files.length} 件</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {files.map((file) => (
                  <Card key={file.id} className="overflow-hidden p-0">
                    <div className="aspect-square bg-muted/40">
                      <img src={file.downloadLink} alt={file.fileName ?? ""} className="object-cover w-full h-full" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{file.fileName ?? "Untitled"}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(file.createdAt).toLocaleString()}</p>
                    </div>
                  </Card>
                ))}
                {files.length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-full">
                    まだ投稿がありません。右上の「アップロード」から追加してください。
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback>{user.name?.slice(0, 2)?.toUpperCase() ?? "US"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link to="/edit-settings" className="flex items-center gap-1">
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <p className="text-xs text-muted-foreground mb-1">統計</p>
                <div className="flex gap-3">
                  <div>
                    <p className="text-base font-semibold">{files.length}</p>
                    <p className="text-xs text-muted-foreground">投稿数</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">フォロー</p>
                  </div>
                  <div>
                    <p className="text-base font-semibold">0</p>
                    <p className="text-xs text-muted-foreground">フォロワー</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="h-32 rounded-sm border bg-muted/30">
                <div className="p-2 space-y-2">
                  <p className="text-xs text-muted-foreground">ここにお知らせを表示できます。</p>
                  <p className="text-xs text-muted-foreground">運営からのお知らせや、最近アップロードしたファイルの処理状況など。</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
