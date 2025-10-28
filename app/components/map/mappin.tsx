// import { Button } from "~/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
} from "~/components/ui/card"

import travelIllustration from "public/image.png";

export function MapPin() {
  return (
    <Card className="w-40 h-40 flex flex-col items-center">
      <CardAction>
    
      {/* <div className="pt-1 pb-1"> */}
        <div className="flex items-center justify-between w-full font-bold space-x-2">
          <span className="pl-3">店舗名</span>
          <span className="text-neutral-500 text-sm pr-3">¥1000~</span>
        </div>
      {/* </div> */}

        <CardContent>
            <div className="relative">
            <img
            src={travelIllustration}
            alt="仮画像"
            className="w-full h-full object-contain rounded-xl"
            />
        </div>
        </CardContent>
      </CardAction>
    </Card>
  )
}
