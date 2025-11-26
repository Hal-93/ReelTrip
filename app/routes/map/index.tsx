import { useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl'; 

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
  
  const mapRef = useRef<mapboxgl.Map | null>(null); 
  const pinMarkerRef = useRef<mapboxgl.Marker | null>(null); 
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null); 
  
  
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

     
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            setUserLocation([longitude, latitude]); 
            
            mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
          },
          (error) => {
            console.error("現在地の取得に失敗しました:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
      
      
      mapRef.current.on('click', (e) => {
        const newLocation: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setPinLocation(newLocation);
      });
      
    })();

    return () => {
      cancelled = true;
      if (pinMarkerRef.current) pinMarkerRef.current.remove();
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
    };
  }, [token]);


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

      
      mapRef.current.flyTo({ 
        center: pinLocation, 
        zoom: 15, 
        duration: 800 
      });

    } else if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }
  }, [pinLocation]);


  
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat(userLocation);
    } else {
        
        const el = document.createElement('div');
        el.className = 'user-location-marker'; 

        userMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat(userLocation)
          .addTo(mapRef.current);
    }
  }, [userLocation]);
  
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
        <MapHeader />
      </div>
      <DrawerDemo />
    </div>
  );
}