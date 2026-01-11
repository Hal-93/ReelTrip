import { getUser } from "~/lib/models/auth.server";
import { getUserReelLocations } from "~/lib/models/reel.server";
import { useNavigate, useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { DrawerDemo } from "~/components/map/mapfooter";
import { MapHeader } from "~/components/map/mapheader";
import TaskBar from "~/components/taskbar/taskbar";
import { Button } from "~/components/ui/button";

type MarkerWithPopupProps = {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  title: string;
  image: string;
  category?: string | null;
  description?: string | null;
  onPopupClick: (
    coordinates: [number, number],
    title: string,
    image: string,
    category?: string | null,
    description?: string | null,
  ) => void;
};

export function MarkerWithPopup({
  map,
  coordinates,
  title,
  image,
  category,
  description,
  onPopupClick,
}: MarkerWithPopupProps) {
  useEffect(() => {
    if (!map) return;

    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-content";
    popupContainer.style.cursor = "pointer";

    const renderPopup = (size: number) => {
      popupContainer.innerHTML = `
        <div style="
          width:${size}px;
          height:${size}px;
          overflow:hidden;
          border-radius:10px;
        ">
          <img 
            src="${image}" 
            style="
              width:100%;
              height:100%;
              object-fit:cover;
              display:block;
            " 
          />
        </div>
      `;
    };

    renderPopup(120);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 18,
    })
      .setLngLat(coordinates)
      .setDOMContent(popupContainer);

    const marker = new mapboxgl.Marker({ color: "#ff3333" })
      .setLngLat(coordinates)
      .addTo(map);

    const handleZoom = () => {
      const zoom = map.getZoom();

      let size = 100;
      if (zoom >= 14) size = 140;
      else if (zoom >= 12) size = 120;

      renderPopup(size);

      if (zoom < 11) {
        marker.getElement().style.display = "block";
        popup.remove();
      } else {
        marker.getElement().style.display = "none";
        if (!popup.isOpen()) popup.addTo(map);
      }
    };

    const handleClick = () => {
      map.flyTo({ center: coordinates, zoom: 14.5, duration: 800 });
      onPopupClick(coordinates, title, image, category, description);
    };

    map.on("zoom", handleZoom);
    marker.getElement().addEventListener("click", handleClick);
    popupContainer.addEventListener("click", handleClick);

    handleZoom();

    return () => {
      map.off("zoom", handleZoom);
      marker.remove();
      popup.remove();
      marker.getElement().removeEventListener("click", handleClick);
      popupContainer.removeEventListener("click", handleClick);
    };
  }, [map, coordinates, title, image, category, description, onPopupClick]);

  return null;
}

export const links = () => [
  {
    rel: "stylesheet",
    href: "https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css",
  },
];

export async function loader({ request }: { request: Request }) {
  const token = process.env.MAPBOX_API ?? "";

  const user = await getUser(request);
  if (!user) {
    return { token, spots: [] };
  }

  const locations = await getUserReelLocations({ userId: user.id });

  const spots = locations
    ? await Promise.all(
        locations.map(async (p) => {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${p.lng},${p.lat}.json?access_token=${token}`,
          );
          const data = await res.json();

          const placeName =
            data.features?.[0]?.text ??
            data.features?.[0]?.place_name ??
            "Spot";

          return {
            id: p.id,
            title: placeName,
            coordinates: [p.lng, p.lat] as [number, number],
            image: p.image,
            category: p.category ?? null,
            description: p.description ?? null,
          };
        }),
      )
    : [];

  return { token, spots };
}

type TravelMode = "car" | "walk" | "spot";

export default function MapPage() {
  const { token, spots } = useLoaderData<typeof loader>();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [pinLocation, setPinLocation] = useState<[number, number] | null>(null);
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<string | null>(null);
  const [destinationImage, setDestinationImage] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>("car");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

  const handlePopupClick = async (
    coordinates: [number, number],
    title: string,
    image: string,
    category?: string | null,
    description?: string | null,
  ) => {
    setPinLocation(coordinates);
    setDestinationImage(image);
    setSelectedCategory(category ?? null);
    setSelectedDescription(description ?? null);

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${token}`,
    );
    const data = await res.json();
    setDestinationPlace(data.features?.[0]?.place_name ?? title);

    setTravelMode("car");
    setIsDrawerOpen(true);
  };

  const handleToReel = () => {
    navigate("/reels/preview");
  };

  useEffect(() => {
    if (!mapContainerRef.current || !token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/so03jp/cmacq6ily00l501rf5j67an3w",
      center: [139.720204, 35.783899],
      zoom: 12,
    });
    mapRef.current = map;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { longitude, latitude } = pos.coords;
        setUserLocation([longitude, latitude]);
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`);
        const data = await res.json();
        setCurrentPlace(data.features?.[0]?.place_name ?? "現在地");
        map.flyTo({ center: [longitude, latitude], zoom: 13 });
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
      <div className="absolute top-0.25 left-1/2 -translate-x-1/2 z-30 flex rounded-full bg-black/60 backdrop-blur">
        <Button
          variant="ghost"
          className="rounded-full px-4 text-white"
          onClick={handleToReel}
        >
          リール
        </Button>
        <Button
          variant="ghost"
          className="rounded-full px-4 text-white/70"
        >
          マップ
        </Button>
      </div>

      <div style={{ position: "absolute", top: "30px", left: 0, right: 0, zIndex: 20 }}>
        <MapHeader
          currentPlace={currentPlace ?? undefined}
          destinationPlace={destinationPlace ?? undefined}
        />
      </div>

      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {mapRef.current &&
        spots.map((place) => (
          <MarkerWithPopup
            key={place.id}
            map={mapRef.current}
            coordinates={place.coordinates}
            title={place.title}
            image={place.image}
            category={place.category}
            description={place.description}
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
            category={selectedCategory}
            description={selectedDescription}
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