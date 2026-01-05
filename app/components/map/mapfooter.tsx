"use client";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CarFront, Footprints, X, MapPin } from "lucide-react";
type TravelMode = "car" | "walk" | "spot";

interface DrawerDemoProps {
  distance: string | null;
  duration: string | null;
  place?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;

  spotTitle?: string | null;
  spotImage?: string | null;

  onTabChange: (mode: TravelMode) => void;
  currentTab: TravelMode;
}

export function DrawerDemo({
  distance,
  duration,
  place,
  open,
  onOpenChange,
  spotTitle,
  spotImage,
  onTabChange,
  currentTab,
}: DrawerDemoProps) {
  const displayDist = distance || "--- km";
  const displayTime = duration || "--- 分";
  const displayPlace = place || "お店のpin(仮)";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 shadow-xl rounded-full px-6 max-w-[90vw] truncate"
        >
          {displayPlace}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto w-full bg-[#004f83d3]">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={(value) => onTabChange(value as TravelMode)}
        >
          <TabsList className="bg-transparent w-full h-16 mt-16">
            <TabsTrigger
              value="car"
              className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CarFront style={{ width: 32, height: 32 }} /> Car
            </TabsTrigger>
            <TabsTrigger
              value="walk"
              className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Footprints style={{ width: 32, height: 32 }} /> Walk
            </TabsTrigger>
            <TabsTrigger
              value="spot"
              className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <MapPin style={{ width: 32, height: 32 }} /> Spot
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 border-b border-white"></div>

          <div className="min-h-[350px]">
            <ContentTab
              value="car"
              distance={displayDist}
              duration={displayTime}
            />
            <ContentTab
              value="walk"
              distance={displayDist}
              duration={displayTime}
            />

            <SpotTab
              value="spot"
              title={spotTitle ?? ""}
              image={spotImage ?? ""}
            />
          </div>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}

function ContentTab({
  value,
  distance,
  duration,
}: {
  value: string;
  distance: string;
  duration: string;
}) {
  return (
    <TabsContent value={value}>
      <DrawerDescription asChild>
        <div className="p-4 pb-0 m-16">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold tracking-tighter text-white m-1">
                現在地から
              </div>

              <div className="flex justify-center gap-6 mt-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-white/70">時間</span>
                  <span className="text-5xl font-bold tracking-tighter text-cyan-300">
                    {duration}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-white/70">距離</span>
                  <span className="text-4xl font-bold tracking-tighter text-white">
                    {distance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerDescription>
    </TabsContent>
  );
}

function SpotTab({
  value,
  title,
  image,
}: {
  value: string;
  title: string;
  image: string;
}) {
  return (
    <TabsContent value={value}>
      <div className="p-4 pb-0 m-10 text-center">
        <img
          src={image}
          alt={title}
          className="w-full max-w-[300px] mx-auto rounded-xl shadow-lg"
        />
        <div className="text-3xl font-bold text-white mb-4">{title}</div>
      </div>
    </TabsContent>
  );
}
