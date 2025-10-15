import { LoginForm } from "~/components/login-form"

export default function LoginPage() {
  return (
    <div
      className="font-sans flex flex-col items-center min-h-screen p-8 sm:p-20 gap-6
                      bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white grid min-h-svh lg:grid-cols-2"
    >
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
    </div>
    <div className="h-full bg-muted relative hidden lg:block">
      PC用カバー画像
    </div>
  </div>
  )
}