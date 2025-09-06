"use client"

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        await signOut(auth);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    return (
        <Button onClick={handleLogout}>ログアウト</Button>
    )
}