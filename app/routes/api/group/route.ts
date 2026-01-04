import { getNearestPictureGroup } from "~/lib/models/picture.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const latParam = url.searchParams.get("lat");
  const lngParam = url.searchParams.get("lng");

  if (!latParam || !lngParam) {
    return [];
  }

  const lat = Number(latParam);
  const lng = Number(lngParam);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return [];
  }

  const group = await getNearestPictureGroup(lat, lng);
  return group;
}
