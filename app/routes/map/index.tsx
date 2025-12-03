import { useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { DrawerDemo } from "~/components/map/mapfooter";
import { MapHeader } from "~/components/map/mapheader";

// --------------------------
// MarkerWithPopup コンポーネント
// --------------------------
type MarkerWithPopupProps = {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  title: string;
  image: string;
};

export function MarkerWithPopup({ map, coordinates, title, image }: MarkerWithPopupProps) {
  useEffect(() => {
    if (!map) return;

    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-content";
    popupContainer.innerHTML = `
      <h4 style="margin:0 0 4px 0; font-size:14px;">${title}</h4>
      <img src="${image}" style="
        width:100%;
        max-width:250px;     /* 最大幅を指定 */
        height:auto;
        border-radius:6px;
        display:block;
        margin:0;
      " />
    `;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
    })
      .setLngLat(coordinates)
      .setDOMContent(popupContainer)
      .addTo(map);

    const marker = new mapboxgl.Marker({ color: "#ff3333" })
      .setLngLat(coordinates)
      .addTo(map);

    // クリックでズーム
    marker.getElement().addEventListener("click", () => {
      map.flyTo({ center: coordinates, zoom: 16, duration: 800 });
    });

    // ズーム連動で画像サイズを微調整
    const handleZoom = () => {
      const zoom = map.getZoom();
      const scale = Math.min(1, 0.7 + (zoom - 14) * 0.05);
      const img = popupContainer.querySelector("img") as HTMLElement;
      if (img) img.style.width = `${scale * 100}%`;
    };

    map.on("zoom", handleZoom);

    return () => {
      marker.remove();
      popup.remove();
      map.off("zoom", handleZoom);
    };
  }, [map, coordinates, title, image]);

  return null;
}

// --------------------------
// MapPage
// --------------------------
export const links = () => [
  {
    rel: "stylesheet",
    href: "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css",
  },
];

export async function loader() {
  return { token: process.env.MAPBOX_API ?? "" };
}

type MapPlace = {
  id: number;
  title: string;
  coordinates: [number, number];
  image: string;
};

export default function MapPage() {
  const { token } = useLoaderData<typeof loader>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);

  // サンプルデータ
  const samplePlaces: MapPlace[] = [
    {
      id: 1,
      title: "INIAD 東洋大学 情報連携学部",
      coordinates: [139.720204, 35.783899],
      image: "https://picsum.photos/400/300",
    },
  ];

  // 地図初期化
  useEffect(() => {
    if (!mapContainerRef.current || !token || mapRef.current) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [139.720204, 35.783899],
      zoom: 14,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // 現在地取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);

          try {
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
            );
            const data = await res.json();
            setCurrentPlace(data.features?.[0]?.place_name ?? "住所取得できません");
          } catch {
            setCurrentPlace("住所取得できません");
          }

          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
        },
        (error) => console.error("現在地取得失敗:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    return () => {
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
    };
  }, [token]);

  // 現在地マーカー
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(userLocation);
    } else {
      const el = document.createElement("div");
      el.className = "user-location-marker";
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(userLocation)
        .addTo(mapRef.current);
    }
  }, [userLocation]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
        <MapHeader currentPlace={currentPlace ?? undefined} />

        {mapRef.current &&
          samplePlaces.map((place) => (
            <MarkerWithPopup
              key={place.id}
              map={mapRef.current}
              coordinates={place.coordinates}
              title={place.title}
              image={place.image}
            />
          ))}
      </div>
      <DrawerDemo />
    </div>
  );
}
