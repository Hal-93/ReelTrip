import { useLoaderData } from "react-router";
import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

import { DrawerDemo } from "~/components/map/mapfooter";
import { MapHeader } from "~/components/map/mapheader";

export const links = () => [
  {
    rel: "stylesheet",
    href: "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css",
  },
];

export async function loader() {
  return { token: process.env.MAPBOX_API ?? "" };
}

export default function MapPage() {
  const { token } = useLoaderData<typeof loader>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!token) return;

    let map: mapboxgl.Map | null = null;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = token;

      if (cancelled) return;

      map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/so03jp/cmacq6ily00l501rf5j67an3w",
        center: [139.767, 35.681],
        zoom: 11,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [token]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div
          ref={mapContainerRef}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
        <MapHeader />
      </div>

      <DrawerDemo />
    </div>
  );
}
