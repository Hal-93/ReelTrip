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
    };
  }, [map, coordinates, title, image, onMarkerClick]);

  return null;
}
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

type TravelMode = "car" | "walk" | "spot";

export default function MapPage() {
  const { token } = useLoaderData<typeof loader>();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<string | null>(null);
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);
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
    if (!userLocation) {
      alert("現在地が取得できていません。");
      return;
    }

    setPinLocation(coordinates);
    setDestinationPlace(title);
    setDestinationImage(image);
    setIsDrawerOpen(true);
  };

  /* -------------------------- Map 初期化 -------------------------- */
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
      (error) => console.error("現在地取得失敗:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      () => console.error("位置情報拒否"),
    );

    return () => {
      map.remove();
    };
  }, [token]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const el = document.createElement("div");
    el.style.width = "28px";
    el.style.height = "28px";
    el.style.backgroundColor = "#1D9BF0";
    el.style.borderRadius = "50%";
    el.style.border = "4px solid white";
    el.style.boxShadow = "0 0 8px rgba(0,0,0,0.5)";
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(userLocation)
      .addTo(mapRef.current);

    return () => {
      marker.remove();
    };
  }, [userLocation]);

  useEffect(() => {
    if (!token || !userLocation || !pinLocation || travelMode === "spot") {
      setDistance("--- km");
      setDuration("--- 分");
      return;
    }

    const fetchDistance = async () => {
      try {
        let mapboxProfile: string;
        if (travelMode === "car") {
          mapboxProfile = "driving";
        } else if (travelMode === "walk") {
          mapboxProfile = "walking";
        } else {
          return;
        }
        const url = `https://api.mapbox.com/directions/v5/mapbox/${mapboxProfile}/${userLocation[0]},${userLocation[1]};${pinLocation[0]},${pinLocation[1]}?access_token=${token}`;
        console.log(`[Mapbox API] Fetching route for mode: ${mapboxProfile}`);
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distKm = (data.routes[0].distance / 1000).toFixed(1);
          setDistance(`${distKm} km`);
          const totalSeconds = route.duration;
          const totalMinutes = Math.round(totalSeconds / 60);

          let displayDuration: string;
          if (totalMinutes < 60) {
            displayDuration = `${totalMinutes} 分`;
          } else {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            if (minutes === 0) {
              displayDuration = `${hours} 時間`;
            } else {
              displayDuration = `${hours} 時間 ${minutes} 分`;
            }
          }

          setDuration(displayDuration);

          console.log(
            `[Result] Mode: ${mapboxProfile}, Time: ${displayDuration}, Dist: ${distKm} km`,
          );
        } else {
          setDistance(null);
          setDuration(null);
        }
      } catch (error) {
        console.error("距離取得エラー:", error);
        setDistance(null);
        setDuration(null);
      }
    };
    fetchDistance();
  }, [token, userLocation, pinLocation, travelMode]);

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

    setTravelMode("car");
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
          duration={duration}
          place={destinationPlace}
          spotTitle={destinationPlace}
          spotImage={destinationImage}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onTabChange={setTravelMode}
          currentTab={travelMode}
        />
      )}
    </div>
  );
}
