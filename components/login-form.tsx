"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error(error)
      setError("メールアドレスまたはパスワードが間違っています")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const firebaseUser = result.user
      const idToken = await firebaseUser.getIdToken();

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      router.push("/home")
    } catch (error) {
      console.error(error)
      setError("Googleログインに失敗しました。")
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">ログイン</h1>
      </div>
      <div className="grid gap-6">
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <div className="grid gap-3">
          <input 
            id="email" 
            disabled 
            type="email" 
            placeholder="メールアドレス" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
          </div>
          <input 
            id="password" 
            disabled 
            placeholder="パスワード"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button disabled type="submit" className="w-full">
          ログイン
        </Button>
        <hr/>
        <Button
            type="button"
            className="w-full mt-4 bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-400"
            onClick={handleGoogleLogin}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
            />
            </svg>
          Googleでログイン
        </Button>
      </div>
      <div className="text-center text-sm">
        アカウントをお持ちではありませんか?{" "}
        <a href="#" className="underline underline-offset-4">
          新規作成
        </a>
      </div>
    </form>
  )
}
