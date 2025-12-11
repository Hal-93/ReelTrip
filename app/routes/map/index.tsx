import { useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { DrawerDemo } from "~/components/map/mapfooter";
import { MapHeader } from "~/components/map/mapheader";
import { MarkerWithPopup } from "~/components/map/MarkerWithPopup";

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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<string | null>(null);
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const samplePlaces: MapPlace[] = [
    {
      id: 1,
      title: "INIAD 東洋大学 情報連携学部",
      coordinates: [139.720204, 35.783899],
      image: "https://picsum.photos/400/300",
    },
  ];

  /* ---------------------- Map 初期化 ---------------------- */
  useEffect(() => {
    if (!mapContainerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/so03jp/cmacq6ily00l501rf5j67an3w",
      center: [139.720204, 35.783899],
      zoom: 14,
    });

    mapRef.current = map;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude, latitude } = pos.coords;
        setUserLocation([longitude, latitude]);

        const r = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`,
        );
        const d = await r.json();
        setCurrentPlace(d.features?.[0]?.place_name ?? "現在地");

        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
        });
      },
      () => console.error("位置情報拒否"),
    );

    return () => {
      map.remove();
    };
  }, [token]);

  /* ---------------------- 現在地マーカー追加（大きめ） ---------------------- */
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const el = document.createElement("div");
    el.style.width = "28px"; // 幅を大きく
    el.style.height = "28px"; // 高さを大きく
    el.style.backgroundColor = "#1D9BF0";
    el.style.borderRadius = "50%";
    el.style.border = "4px solid white"; // ボーダー太め
    el.style.boxShadow = "0 0 8px rgba(0,0,0,0.5)"; // 影強め

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(userLocation)
      .addTo(mapRef.current);

    return () => {
      marker.remove();
    };
  }, [userLocation]);

  /* ---------------------- ピン距離計算 ---------------------- */
  useEffect(() => {
    if (!token || !userLocation || !pinLocation) return;

    const fetchDistance = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${pinLocation[0]},${pinLocation[1]}?access_token=${token}`;
      const res = await fetch(url);
      const data = await res.json();
      const distKm = (data.routes[0].distance / 1000).toFixed(1);
      setDistance(`${distKm} km`);
    };
    fetchDistance();
  }, [userLocation, pinLocation]);

  /* ---------------------- ポップアップクリック ---------------------- */
  const handlePopupClick = async (
    coordinates: [number, number],
    title: string,
    image: string,
  ) => {
    setPinLocation(coordinates);
    setDestinationImage(image);

    const r = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${token}`,
    );
    const d = await r.json();
    const placeName = d.features?.[0]?.place_name ?? title;
    setDestinationPlace(placeName);

    setIsDrawerOpen(true);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
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
        <DrawerDemo
          distance={distance}
          place={destinationPlace}
          spotTitle={destinationPlace}
          spotImage={destinationImage}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </div>
  );
}
