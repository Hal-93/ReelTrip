import { redirect } from "react-router";

export async function action() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
  );

  return redirect("/", { headers });
}