"use client";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { CarFront, TramFront, Footprints } from "lucide-react";

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">お店のpin(仮)</Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto w-full bg-[#004f83cc]">
        <Tabs defaultValue="car">
          <TabsList className="bg-transparent w-full h-16 mt-16">
            <TabsTrigger
              value="car"
              className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CarFront style={{ width: 32, height: 32 }} />
              Car
            </TabsTrigger>
            <TabsTrigger
              value="train"
              className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <TramFront style={{ width: 32, height: 32 }} />
              Train
            </TabsTrigger>
            <TabsTrigger
              value="walk"
              className="text-2xl font-medium flex items-center space-x-2 px-4 py-2 text-white data-[state=active]:text-cyan-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Footprints style={{ width: 32, height: 32 }} />
              walk
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 border-b border-white"></div>

          {/* 車の時 */}
          <TabsContent value="car">
            <DrawerDescription>
              <div className="p-4 pb-0 m-16">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1">
                    <div className="text-3xl font-bold tracking-tighter text-white m-1">
                      現在地から
                    </div>
                    <div className="text-2xl font-bold tracking-tighter text-white m-1">
                      X 分
                    </div>
                    <div className="text-2xl font-bold tracking-tighter text-white m-1">
                      Y km
                    </div>
                  </div>
                </div>
              </div>
            </DrawerDescription>
          </TabsContent>

          {/* 電車の時 */}
          <TabsContent value="train">
            <DrawerDescription>
              <div className="p-4 pb-0 m-16">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1">
                    <div className="text-3xl font-bold tracking-tighter text-white m-1">
                      現在地から
                    </div>
                    <div className="text-2xl font-bold tracking-tighter text-white m-1">
                      XX 分
                    </div>
                    <div className="text-2xl font-bold tracking-tighter text-white m-1">
                      YY km
                    </div>
                  </div>
                </div>
              </div>
            </DrawerDescription>
          </TabsContent>

          {/* 徒歩の時 */}
          <TabsContent value="walk">
            <DrawerDescription>
              <div className="p-4 pb-0 m-16">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1">
                    <div className="text-3xl font-bold tracking-tighter text-white m-1">
                      現在地から
                    </div>
                    <div className="text-2xl font-bold tracking-tighter text-white m-1">
                      XXX 分
                    </div>
                    <div className="text-2xl font-bold tracking-tighter text-white m-1">
                      YYY km
                    </div>
                  </div>
                </div>
              </div>
            </DrawerDescription>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
