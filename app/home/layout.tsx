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
    <div className="w-full">{children}</div>
    </>
  );
}