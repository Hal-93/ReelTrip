import { LoginForm } from "~/components/login-form";

export default function SignUpPage() {
  return (
    <div
      className="p-8 min-h-screen bg-gradient-to-b from-[#1b73ce] via-blue-800 to-[#023c73] text-white"
    >
      {/* ログインリンク */}
      <div className="mt-4">
        <LoginForm/>
      </div>
    </div>
  );
}
