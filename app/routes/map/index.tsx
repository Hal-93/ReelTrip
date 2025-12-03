import { useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

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

  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!token || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = token;

      if (cancelled) return;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/so03jp/cmacq6ily00l501rf5j67an3w",
        center: [139.767, 35.681],
        zoom: 11,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      mapRef.current.on("click", (e) => {
        const newLocation: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setPinLocation(newLocation);
      });
    })();

    return () => {
      cancelled = true;
      if (markerRef.current) markerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
    };
  }, [token]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (pinLocation) {
      if (markerRef.current) {
        markerRef.current.setLngLat(pinLocation);
      } else {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat(pinLocation)
          .addTo(mapRef.current);
      }

      mapRef.current.flyTo({ center: pinLocation, zoom: 15, duration: 800 });
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [pinLocation]);

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
