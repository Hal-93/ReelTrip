import { useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { DrawerDemo } from "~/components/map/mapfooter";
import { MapHeader } from "~/components/map/mapheader";

type MarkerWithPopupProps = {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  title: string;
  image: string;

  onMarkerClick: (
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
  onMarkerClick,
}: MarkerWithPopupProps) {
  useEffect(() => {
    if (!map) return;

    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-content";
    popupContainer.innerHTML = `
      <h4 style="margin:0 0 4px 0; font-size:14px;">${title}</h4>
      <img src="${image}" style="
        width:100%;
        max-width:250px; 
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

    const handleClick = () => {
      map.flyTo({ center: coordinates, zoom: 16, duration: 800 });
      onMarkerClick(coordinates, title, image);
    };

    marker.getElement().addEventListener("click", handleClick);

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
      marker.getElement().removeEventListener("click", handleClick);
      map.off("zoom", handleZoom);
    };
  }, [map, coordinates, title, image, onMarkerClick]);

  return null;
}

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

  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<string | null>(null);
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // -------------------------

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const samplePlaces: MapPlace[] = [
    {
      id: 1,
      title: "INIAD 東洋大学 情報連携学部",
      coordinates: [139.720204, 35.783899],
      image: "https://picsum.photos/400/300",
    },
  ];

  const fetchDistance = async (
    start: [number, number],
    end: [number, number],
  ) => {
    if (!token) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?access_token=${token}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const distKm = (data.routes[0].distance / 1000).toFixed(1);
        setDistance(`${distKm} km`);
      }
    } catch (err) {
      console.error("距離取得エラー:", err);
      setDistance(null);
    }
  };

  const handleMarkerClick = (
    coordinates: [number, number],
    title: string,
    image: string,
  ) => {
    if (userLocation) {
      setPinLocation(coordinates);
      setDestinationPlace(title);
      setDestinationImage(image);
      setIsDrawerOpen(true);
    } else {
      alert("現在地が取得できていません。");
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || !token || mapRef.current) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/so03jp/cmacq6ily00l501rf5j67an3w",
      center: [139.720204, 35.783899],
      zoom: 14,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);

          try {
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`,
            );
            const data = await res.json();
            setCurrentPlace(
              data.features?.[0]?.place_name ?? "住所取得できません",
            );
          } catch (error) {
            console.error("現在地住所取得失敗:", error);
            setCurrentPlace("住所取得できません");
          }

          mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
        },
        (error) => console.error("現在地取得失敗:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    }

    return () => {
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
    };
  }, [token]);

  useEffect(() => {
    if (userLocation && pinLocation) {
      fetchDistance(userLocation, pinLocation);
    } else {
      setDistance(null);
    }
  }, [userLocation, pinLocation]);

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

        <MapHeader
          currentPlace={currentPlace ?? undefined}
          destinationPlace={destinationPlace ?? undefined}
        />

        {mapRef.current &&
          samplePlaces.map((place) => (
            <MarkerWithPopup
              key={place.id}
              map={mapRef.current}
              coordinates={place.coordinates}
              title={place.title}
              image={place.image}
              onMarkerClick={handleMarkerClick}
            />
          ))}
      </div>

      {pinLocation && (
        <DrawerDemo
          distance={distance}
          place={destinationPlace}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          spotTitle={destinationPlace}
          spotImage={destinationImage}
        />
      )}
    </div>
  );
}
