import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

type Props = {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  title: string;
  image: string;
};

export function MarkerWithPopup({ map, coordinates, title, image }: Props) {
  useEffect(() => {
    if (!map) return;

    // ポップアップ要素作成
    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-content";
    popupContainer.innerHTML = `
      <h4 style="margin:0 0 4px 0; font-size:14px;">${title}</h4>
      <img src="${image}" style="width:100%; height:auto; border-radius:6px; display:block; margin:0;" />
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

    return () => {
      marker.remove();
      popup.remove();
    };
  }, [map, coordinates, title, image]);

  return null; // DOMには何も出力しない
}
