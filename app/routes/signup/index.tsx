import { LoginForm } from "~/components/login-form";

export default function SignUpPage() {
  return (
    <div
      className="p-8 min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white"
    >
      {/* ログインリンク */}
      <div className="mt-4">
        <LoginForm/>
      </div>
    </div>
  );
}
