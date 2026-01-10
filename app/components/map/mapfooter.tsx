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

  category?: string | null;
  description?: string | null;

  onTabChange: (mode: TravelMode) => void;
  currentTab: TravelMode;
}

export function DrawerDemo({
  distance,
  duration,
  open,
  onOpenChange,
  spotTitle,
  category,
  description,
  onTabChange,
  currentTab,
}: DrawerDemoProps) {
  const displayDist = distance || "--- km";
  const displayTime = duration || "--- 分";
  // エラー解消：使われていない変数 displayPlace を削除しました

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <div className="hidden" /> 
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
              category={category ?? ""}
              description={description ?? ""}
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
  category,
  description,
}: {
  value: string;
  title: string;
  category: string;
  description: string;
}) {
  return (
    <TabsContent value={value}>
      <div className="p-4 m-8 text-center">

        <div className="mt-4 text-2xl font-bold text-white">
          {title}
        </div>

        {category && (
          <div className="mt-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm text-white">
              {category}
            </span>
          </div>
        )}

        {description && (
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            {description}
          </p>
        )}

        {!category && !description && (
          <p className="mt-4 text-sm text-white/50">
            スポットの詳細情報はありません。
          </p>
        )}
      </div>
    </TabsContent>
  );
}