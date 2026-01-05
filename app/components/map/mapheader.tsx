import { ArrowLeft, Circle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

type MapHeaderProps = {
  currentPlace?: string; // 現在地住所
  destinationPlace?: string; // 目的地住所
};

export function MapHeader({ currentPlace, destinationPlace }: MapHeaderProps) {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center pt-2"
      style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
    >
      <ArrowLeft
        className="text-[#004f83] h-8 w-1/12 cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="bg-[#004f83d3] bg-opacity-80 p-4 rounded-xl shadow-lg w-10/12">
        <div className="flex items-center space-x-3">
          <div className="flex-1 flex flex-col space-y-2">
            {/* 現在地 */}
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <Circle className="h-6 w-6 text-sky-500" />
                <Circle className="absolute h-2.5 w-2.5  fill-sky-500 stroke-0" />
              </div>
              <div className="flex-1">
                <span className="text-white text-lg font-medium">
                  {currentPlace ?? "現在地"}
                </span>
              </div>
            </div>

            <div className="flex-1 border-b border-white"></div>

            {/* 目的地 */}
            <div className="flex items-center space-x-3">
              <MapPin className="text-[#D20F30] h-6 w-6 " />
              <div className="flex-1">
                <span className="text-white text-lg font-medium">
                  {destinationPlace ?? ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
