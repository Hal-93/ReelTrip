import type { LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import { getUserReel } from "~/lib/models/reel.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user) {
    return new Response(
      JSON.stringify({ reel: null }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const reel = await getUserReel({
    userId: user.id,
  });

  const safePayload = JSON.parse(JSON.stringify({ reel }));
  return new Response(
    JSON.stringify(safePayload),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
