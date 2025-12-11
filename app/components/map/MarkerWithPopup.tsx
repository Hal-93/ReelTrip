import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

type MarkerProps = {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  title: string;
  image: string;
  onPopupClick: (coords: [number, number], title: string, image: string) => void;
};

export function MarkerWithPopup({
  map,
  coordinates,
  title,
  image,
  onPopupClick,
}: MarkerProps) {
  useEffect(() => {
    if (!map) return;

    // -----------------------------
    // ポップアップのコンテナ
    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-content";
    popupContainer.style.cursor = "pointer";
    popupContainer.style.padding = "4px";
    popupContainer.style.maxWidth = "180px";  // 幅を小さく
    popupContainer.style.fontSize = "12px";   // フォントを小さく

    popupContainer.innerHTML = `
      <h4 style="margin:0 0 2px 0; font-size:12px;">${title}</h4>
      <img src="${image}" 
        style="width:100%; max-width:180px; border-radius:6px; display:block;" />
    `;

    // -----------------------------
    // Mapbox Popup 作成
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
    })
      .setLngLat(coordinates)
      .setDOMContent(popupContainer)
      .addTo(map);

    // -----------------------------
    // クリック時の挙動
    popupContainer.addEventListener("click", () => {
      map.flyTo({ center: coordinates, zoom: 16, duration: 800 });
      onPopupClick(coordinates, title, image);
    });

    // -----------------------------
    // ズームに応じた表示/非表示（14未満で非表示）
    const handleZoom = () => {
      const zoom = map.getZoom();
      if (zoom < 11) {       // 変更ポイント
        popup.remove();       // ズームアウトで非表示
      } else {
        if (!popup.isOpen()) popup.addTo(map); // ズームインで再表示
      }
    };

    map.on("zoom", handleZoom);
    handleZoom(); // 初期表示チェック

    // -----------------------------
    // クリーンアップ
    return () => {
      popup.remove();
      map.off("zoom", handleZoom);
    };
  }, [map, coordinates, title, image, onPopupClick]);

  return null;
}
