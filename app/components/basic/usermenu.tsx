import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Pencil } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { User } from "@prisma/client";

export function UserSidebar({
  user,
  filesCount,
  followingCount = 0,
  followerCount = 0,
}: {
  user: User;
  filesCount: number;
  followingCount?: number;
  followerCount?: number;
}) {
  return (
    <aside className="w-72">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          {user.avatar ? (
            <AvatarImage src={user.avatar} />
          ) : (
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          )}
        </Avatar>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">@{user.id}</p>
        </div>
        <Link to="/settings" className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Pencil size={16} />
            <span>編集</span>
          </Button>
        </Link>
      </div>
      <div className="mt-6 flex justify-around border-t border-gray-200 pt-4">
        <div className="text-center">
          <p className="text-lg font-semibold">{filesCount}</p>
          <p className="text-sm text-gray-500">投稿数</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{followingCount}</p>
          <p className="text-sm text-gray-500">フォロー</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{followerCount}</p>
          <p className="text-sm text-gray-500">フォロワー</p>
        </div>
      </div>
      <ScrollArea className="mt-6 h-48 border border-gray-200 rounded-md p-4">
        <CardHeader>
          <CardTitle>通知</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">通知はここに表示されます。</p>
        </CardContent>
      </ScrollArea>
    </aside>
  );
}
