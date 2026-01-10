import type { ActionFunctionArgs } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import {
  createReelFromSelectedKeys,
  setUserReel,
} from "~/lib/models/reel.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return JSON.stringify({ error: "Method Not Allowed" });
  }

  const user = await getUser(request);
  if (!user) {
    return JSON.stringify({ error: "Unauthorized" });
  }

  try {
    const body = await request.json();
    const { keys, videoObjectName, downloadLink } = body ?? {};

    if (
      !Array.isArray(keys) ||
      keys.length === 0 ||
      !videoObjectName ||
      !downloadLink
    ) {
      return JSON.stringify(
        { status: 400 }
      );
    }

    // Create Reel + File AFTER video generation is complete
    const reel = await createReelFromSelectedKeys({
      userId: user.id,
      selectedPictureObjectNames: keys,
      video: {
        fileName: "reel.mp4",
        objectName: videoObjectName,
        downloadLink,
      },
      caption: null,
    });

    // Set this reel as user's reel
    await setUserReel({
      userId: user.id,
      reelId: reel.id,
    });

    return JSON.stringify({
      ok: true,
      reelId: reel.id,
    });
  } catch (err) {
    console.error("complete reel error:", err);
    return JSON.stringify(
      { status: 500 }
    );
  }
}
