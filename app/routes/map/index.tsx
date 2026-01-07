import { useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { DrawerDemo } from "~/components/map/mapfooter";
import { MapHeader } from "~/components/map/mapheader";
import TaskBar from "~/components/taskbar/taskbar"; // ✅ タスクバーを復活

/* ================= MarkerWithPopup ================= */

type MarkerWithPopupProps = {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  title: string;
  image: string;
  onPopupClick: (
    coordinates: [number, number],
    title: string,
    image: string,
  ) => void;
};

export function MarkerWithPopup({
  map,
  coordinates,
  title,
  image,
  onPopupClick,
}: MarkerWithPopupProps) {
  useEffect(() => {
    if (!map) return;

    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-content";
    popupContainer.style.cursor = "pointer";
    popupContainer.innerHTML = `
      <h4 style="margin:0 0 4px 0; font-size:14px;">${title}</h4>
      <img src="${image}" style="width:100%; max-width:250px; height:auto; border-radius:6px; display:block;" />
    `;

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 0, // ✅ ピンを消したため座標に合わせる
      anchor: "bottom", // ✅ 座標の真上にポップアップを表示
    })
      .setLngLat(coordinates)
      .setDOMContent(popupContainer);

    // ✅ 赤いピン(marker)の作成・表示処理を削除しました

    // ✅ ズームに応じた表示/非表示の制御
    const handleZoom = () => {
      const zoom = map.getZoom();
      if (zoom < 11) {
        popup.remove(); // 11未満で非表示
      } else {
        if (!popup.isOpen()) popup.addTo(map); // 11以上で表示
      }
    };

    const handleClick = () => {
      // ✅ ズームレベルを14.5に緩和（寄りすぎ防止）
      map.flyTo({ center: coordinates, zoom: 14.5, duration: 800 });
      onPopupClick(coordinates, title, image);
    };

    // イベント登録
    map.on("zoom", handleZoom);
    // ✅ marker へのイベント登録を削除し、popupContainer への登録のみ維持
    popupContainer.addEventListener("click", handleClick);

    handleZoom(); // 初回実行

    return () => {
      map.off("zoom", handleZoom);
      // ✅ marker.remove() を削除
      popup.remove();
      popupContainer.removeEventListener("click", handleClick);
    };
  }, [map, coordinates, title, image, onPopupClick]);

  return null;
}

/* ================= Remix ================= */

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

type TravelMode = "car" | "walk" | "spot";

/* ================= Page ================= */

export default function MapPage() {
  const { token } = useLoaderData<typeof loader>();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<string | null>(null);
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>("car");

  const samplePlaces: MapPlace[] = [
    {
      id: 1,
      title: "INIAD 東洋大学 情報連携学部",
      coordinates: [139.720204, 35.783899],
      image: "https://picsum.photos/400/300",
    },
  ];

  const handlePopupClick = async (
    coordinates: [number, number],
    title: string,
    image: string,
  ) => {
    setPinLocation(coordinates);
    setDestinationImage(image);

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${token}`,
    );
    const data = await res.json();
    setDestinationPlace(data.features?.[0]?.place_name ?? title);

    setTravelMode("car");
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (!mapContainerRef.current || !token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/so03jp/cmacq6ily00l501rf5j67an3w",
      center: [139.720204, 35.783899],
      zoom: 12, // ✅ 初期のズームも12に緩和
    });
    mapRef.current = map;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude, latitude } = pos.coords;
        setUserLocation([longitude, latitude]);
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`);
        const data = await res.json();
        setCurrentPlace(data.features?.[0]?.place_name ?? "現在地");
        map.flyTo({ center: [longitude, latitude], zoom: 13 }); // ✅ 現在地表示も13に緩和
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
    return () => { map.remove(); };
  }, [token]);

  useEffect(() => {
    let marker: mapboxgl.Marker | null = null;
    if (mapRef.current && userLocation) {
      const el = document.createElement("div");
      el.style.width = "24px"; el.style.height = "24px";
      el.style.backgroundColor = "#1D9BF0"; el.style.borderRadius = "50%"; el.style.border = "3px solid white";
      marker = new mapboxgl.Marker({ element: el }).setLngLat(userLocation).addTo(mapRef.current);
    }
    return () => { marker?.remove(); };
  }, [userLocation]);

  useEffect(() => {
    if (!token || !userLocation || !pinLocation || travelMode === "spot") return;
    const fetchDistance = async () => {
      const profile = travelMode === "car" ? "driving" : "walking";
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${userLocation[0]},${userLocation[1]};${pinLocation[0]},${pinLocation[1]}?access_token=${token}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.routes?.[0]) return;
      setDistance(`${(data.routes[0].distance / 1000).toFixed(1)} km`);
      const min = Math.round(data.routes[0].duration / 60);
      setDuration(min < 60 ? `${min} 分` : `${Math.floor(min / 60)} 時間 ${min % 60} 分`);
    };
    fetchDistance();
  }, [token, userLocation, pinLocation, travelMode]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <MapHeader
        currentPlace={currentPlace ?? undefined}
        destinationPlace={destinationPlace ?? undefined}
      />

      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {mapRef.current &&
        samplePlaces.map((place) => (
          <MarkerWithPopup
            key={place.id}
            map={mapRef.current}
            coordinates={place.coordinates}
            title={place.title}
            image={place.image}
            onPopupClick={handlePopupClick}
          />
        ))}

      {pinLocation && (
        <div style={{ position: "relative", zIndex: 60 }}>
          <DrawerDemo
            distance={distance}
            duration={duration}
            place={destinationPlace}
            spotTitle={destinationPlace}
            spotImage={destinationImage}
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            onTabChange={setTravelMode}
            currentTab={travelMode}
          />
        </div>
      )}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        <TaskBar />
      </div>
    </div>
  );
}