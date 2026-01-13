import { getUser } from "~/lib/models/auth.server";
import { generateMakeVideoKeys } from "~/lib/models/reel.server";

export async function generateKeysFromPreference(request: Request) {
  const user = await getUser(request);
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  const form = await request.formData();
  const preference = form.get("preference") as "見る" | "遊ぶ" | "食べる" | null;

  if (!preference) {
    throw new Response(
      JSON.stringify({ error: "preference is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const keys = await generateMakeVideoKeys({
    userId: user.id,
    preference,
  });

  return keys;
}
