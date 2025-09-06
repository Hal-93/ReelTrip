import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/models/auth.server";
import { LogoutButton } from "@/components/logout";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Props = {
  children: ReactNode;
};

export default async function HomeLayout({ children }: Props) {
    const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
    <LogoutButton />
    <div className="flex flex-col items-center space-y-8 mt-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image
            src={user.avatar || ""}
            alt={`${user.name}のアバター`}
            width={100}
            height={100}
            className="rounded-full border"
          />
          <CardTitle className="text-center">{user.name}</CardTitle>
          <CardDescription className="text-center">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <div className="text-xs text-muted-foreground">UID: {user.firebaseUid}</div>
        </CardContent>
      </Card>
      <div className="w-full max-w-md">{children}</div>
    </div>
    </>
  );
}