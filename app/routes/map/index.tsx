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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentPlace, setCurrentPlace] = useState<string | null>(null); // 現在地住所
  const [destinationPlace, setDestinationPlace] = useState<string | null>(null); // ピン住所

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const pinMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // ---------------------
  // 地図初期化
  // ---------------------
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

      // ---------------------
      // 現在地の取得
      // ---------------------
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { longitude, latitude } = position.coords;
            setUserLocation([longitude, latitude]);

            // 現在地住所の取得
            try {
              const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
              );
              const data = await res.json();
              const place = data.features?.[0]?.place_name ?? "住所を取得できません";
              setCurrentPlace(place);
            } catch (err) {
              console.error(err);
              setCurrentPlace("住所を取得できません");
            }

            mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
          },
          (error) => {
            console.error("現在地の取得に失敗しました:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }

      // ---------------------
      // ピンをクリックした場所の取得
      // ---------------------
      mapRef.current.on("click", async (e) => {
        const newLocation: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setPinLocation(newLocation);

        // ピン住所取得
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${newLocation[0]},${newLocation[1]}.json?access_token=${token}`
          );
          const data = await res.json();
          const place = data.features?.[0]?.place_name ?? "住所を取得できません";
          setDestinationPlace(place);
        } catch (err) {
          console.error(err);
          setDestinationPlace("住所を取得できません");
        }
      });
    })();

    return () => {
      cancelled = true;
      if (pinMarkerRef.current) pinMarkerRef.current.remove();
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
    };
  }, [token]);

  // ---------------------
  // ピン表示制御
  // ---------------------
  useEffect(() => {
    if (!mapRef.current) return;

    if (pinLocation) {
      if (pinMarkerRef.current) {
        pinMarkerRef.current.setLngLat(pinLocation);
      } else {
        pinMarkerRef.current = new mapboxgl.Marker()
          .setLngLat(pinLocation)
          .addTo(mapRef.current);
      }

      mapRef.current.flyTo({ center: pinLocation, zoom: 15, duration: 800 });
    } else if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }
  }, [pinLocation]);

  // ---------------------
  // 現在地マーカー
  // ---------------------
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(userLocation);
    } else {
      const el = document.createElement("div");
      el.className = "user-location-marker"; // CSSで丸マーカーを設定可能
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(userLocation)
        .addTo(mapRef.current);
    }
  }, [userLocation]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
        <MapHeader currentPlace={currentPlace ?? undefined} destinationPlace={destinationPlace ?? undefined} />
      </div>
      <DrawerDemo />
    </div>
  );
}
