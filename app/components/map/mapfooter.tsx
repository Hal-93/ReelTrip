"use client";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CarFront, TramFront, Footprints, X } from "lucide-react"; // 📌 Xアイコンを追加


interface DrawerDemoProps {
  distance: string | null;
  place?: string | null;
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}


export function DrawerDemo({ distance, place, open, onOpenChange }: DrawerDemoProps) {
  const displayDist = distance || "--- km";
  const displayPlace = place || "お店のpin(仮)";

  return (
    
    <Drawer open={open} onOpenChange={onOpenChange}>
      
      
      <DrawerTrigger asChild>
        <Button variant="outline" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 shadow-xl rounded-full px-6 max-w-[90vw] truncate">
            {displayPlace}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto w-full bg-[#004f83cc]">
          
          <div className="absolute top-4 right-4 z-10">
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-white hover:bg-white/20">
                  <X className="h-6 w-6" />
              </Button>
          </div>
          
        <Tabs defaultValue="car">
          <TabsList className="bg-transparent w-full h-16 mt-16">
            <TabsTrigger value="car" className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <CarFront style={{ width: 32, height: 32 }} /> Car
            </TabsTrigger>
            <TabsTrigger value="train" className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <TramFront style={{ width: 32, height: 32 }} /> Train
            </TabsTrigger>
            <TabsTrigger value="walk" className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              <Footprints style={{ width: 32, height: 32 }} /> walk
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 border-b border-white"></div>

          <ContentTab value="car" distance={displayDist} />
          <ContentTab value="train" distance={displayDist} />
          <ContentTab value="walk" distance={displayDist} />

        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}

function ContentTab({ value, distance }: { value: string, distance: string }) {
  return (
    <TabsContent value={value}>
      <DrawerDescription asChild>
        <div className="p-4 pb-0 m-16">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold tracking-tighter text-white m-1">
                現在地から
              </div>
              
              <div className="text-5xl font-bold tracking-tighter text-cyan-300 m-1 mt-4">
                {distance}
              </div>

            </div>
          </div>
        </div>
      </DrawerDescription>
    </TabsContent>
  );
}