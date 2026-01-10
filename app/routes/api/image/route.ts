import type { ActionFunctionArgs } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import { generateMakeVideoKeys, createReelFromSelectedKeys } from "~/lib/models/reel.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    return new Response(null, { status: 401 });
  }

  const body = await request.json();
  const preference = body.preference as "見る" | "遊ぶ" | "食べる" | undefined;

  if (!preference) {
    return new Response(
      JSON.stringify({ error: "preference is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const keys = await generateMakeVideoKeys({
    userId: user.id,
    preference,
  });

  const reel = await createReelFromSelectedKeys({
    userId: user.id,
    selectedPictureObjectNames: keys,
    video: {
      fileName: "reel.mp4",
      objectName: `videos/${user.id}-${Date.now()}.mp4`,
      downloadLink: "",
    },
    caption: null,
  });

  return new Response(
    JSON.stringify({ keys, reel }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
