import { useLoaderData } from "react-router";
import { groupPicturesByLocation } from "~/lib/models/picture.server";

export const loader = async () => {
  const groups = await groupPicturesByLocation();
  return groups;
};

export default function Test() {
  const data = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
