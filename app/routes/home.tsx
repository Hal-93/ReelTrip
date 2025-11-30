import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { SparklesCore } from "~/components/ui/sparkles";
import { BentoGrid, BentoGridItem } from "~/components/ui/bento-grid";
//import { LampContainer } from "~/components/ui/lamp";
import { Carousel, Card } from "~/components/ui/apple-cards-carousel";
//import { AnimatedTestimonials } from "~/components/ui/animated-testimonials";
//import { ChevronDown } from "lucide-react";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  //IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

export function meta() {
  return [
    { title: "ReelTrip" },
    {
      name: "description",
      content: "ReelTrip - あなたの旅をリールにする新しいSNS体験。",
    },
  ];
}

//const Skeleton = () => (
//<div className="flex-1 w-full h-36 rounded-xl bg-gray-200"></div>
//);

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const items = [
    {
      title: "AIが写真からリール風動画を作成",
      description: "",
      header: (
        <img
          src="/images/movie-AI.png"
          alt="動画生成イメージ"
          className="w-full h-50 object-cover rounded-xl"
        />
      ),
      icon: <IconClipboardCopy className="h-4 w-4 text-blue-400" />,
    },
    {
      title: "位置情報から旅の地図を生成",
      description: "",
      header: (
        <img
          src="/images/map-screen-AI.png"
          alt="動画生成イメージ"
          className="w-harf h-50 object-cover rounded-xl"
        />
      ),
      icon: <IconFileBroken className="h-4 w-4 text-green-400" />,
    },
    {
      title: "BGM自動選択",
      description: "",
      header: (
        <img
          src="/images/app-inside-music-AI.png"
          alt="動画生成イメージ"
          className="w-harf h-50 object-cover rounded-xl"
        />
      ),
      icon: <IconSignature className="h-4 w-4 text-yellow-400" />,
    },
    {
      title: "リールのお気に入り機能",
      description: "",
      header: (
        <img
          src="/images/good-marker-AI.png"
          alt="動画生成イメージ"
          className="w-harf h-55 object-cover rounded-xl"
        />
      ),
      icon: <IconTableColumn className="h-4 w-4 text-pink-400" />,
    },
    {
      title: "マップ画面にすぐ飛べる",
      description: "",
      header: (
        <img
          src="/images/movie-to-map-AI.png"
          alt="動画生成イメージ"
          className="w-full h-55 object-cover rounded-xl"
        />
      ),
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-purple-400" />,
    },
    {
      title: "自治体からのチップ機能",
      description: "",
      header: (
        <img
          src="/images/tip-happy-AI.png"
          alt="動画生成イメージ"
          className="w-full h-55 object-cover rounded-xl"
        />
      ),
      icon: <IconBoxAlignRightFilled className="h-4 w-4 text-red-400" />,
    },
  ];
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
      <div className="absolute inset-0">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={60}
          className="w-full h-full"
        />
      </div>

      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white font-sans">
        {/* 背景 */}
        <div className="absolute inset-0">
          {/* 旅イラストを薄く重ねる */}
          <img
            src="/images/travel-icons.png" // 透明背景の旅行アイコンをまとめた画像
            className="w-full h-full object-cover opacity-10"
            alt="travel icons"
          />

          {/* SparklesCoreでカラフルな紙吹雪っぽい粒 */}
          <SparklesCore
            background="transparent"
            minSize={0.2}
            maxSize={0.8}
            particleDensity={40}
            className="w-full h-full text-yellow-400" // bg-white の代わりに Tailwind の色を反映
          />

          {/* コンフェッティ粒 */}
          <div className="absolute inset-0 pointer-events-none">
            <SparklesCore
              background="transparent"
              minSize={0.2}
              maxSize={1}
              particleDensity={60}
              className="w-full h-full"
            />
          </div>

          {/* 旅アイコン：スーツケース（左下） */}
          <motion.img
            src="/images/bag-AI.png"
            className="absolute bottom-16 left-10 w-60 h-auto opacity-90 drop-shadow-xl"
            animate={{ y: [0, -10, 0], rotate: [-6, -2, -6] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />

          {/* 電車（右上） */}
          <motion.img
            src="/images/Train-AI.png"
            className="absolute top-14 right-35 w-80 h-auto opacity-90"
            animate={{ x: [0, 20, 0], y: [0, -8, 0], rotate: [-6, 10, -6] }}
            transition={{ repeat: Infinity, duration: 5 }}
          />

          {/* カメラ（右下） */}
          <motion.img
            src="/images/camera-AI.png"
            className="absolute bottom-10 right-16 w-50 h-auto opacity-90"
            animate={{ y: [0, 12, 0], rotate: [-6, -20, -6] }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
          {/* map（コレ！） */}
          <motion.img
            src="/images/map-AI.png"
            className="absolute w-56 h-auto top-20 left-10 opacity-70"
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          {/* ヒーローコンテンツ */}
          <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6">
            {/* キラキラするタイトル */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-transparent animate-pulse"
            >
              ReelTrip
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-6 max-w-2xl text-lg text-gray-100 text-center"
            >
              写真をアップロードするだけで、AIがあなたの旅をリール映像に。
              新しいSNS体験がここに。
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Link to="/signup">
                <button className="mt-10 px-10 py-4 bg-white text-black font-semibold rounded-full shadow-xl hover:bg-gray-200 transition">
                  今すぐ始める
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ヒーローコンテンツ */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent"
          >
            ReelTrip
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 max-w-2xl text-lg text-gray-100"
          >
            写真をアップロードするだけで、AIがあなたの旅をリール映像に。新しいSNS体験がここに。
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Link to="/signup">
              <button className="mt-10 px-10 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-200 transition">
                今すぐ始める
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="relative z-10 bg-gradient-to-b from-blue-700 via-blue-500 to-blue-300 overflow-hidden py-16">
        {/* 見出し */}
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-12">
          ReelTripでできること↓
        </h2>

        <div className="max-w-6xl mx-auto gap-y-8 gap-x-6">
          <BentoGrid className="max-w-4xl mx-auto grid grid-cols-3 gap-6 auto-rows-[10rem]">
            {items.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className="!h-[28rem] flex flex-col justify-start gap-4"
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      <section className="relative z-10 bg-gradient-to-b from-white via-blue-200 to-blue-700 py-24 border-t border-gray-200 overflow-hidden">
        <div className="w-full h-full py-20">
          <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-gray-900 font-sans text-center mb-16">
            人気のリール
          </h2>
          {isClient && (
            <Carousel
              items={data.map((card, index) => (
                <Card key={card.src} card={card} index={index} />
              ))}
            />
          )}
        </div>
      </section>

      <footer className="relative z-10 py-24 text-center bg-gradient-to-b from-blue-700 via-blue-200 to-white">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-semibold mb-6 text-gray-900 drop-shadow-lg"
        >
          あなたの旅を、リールにしよう。
        </motion.h3>
        <Link to="/signup">
          <button className="px-10 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-medium shadow-md transition">
            無料で始める
          </button>
        </Link>
      </footer>
    </div>
  );
}

const DummyContent = () => (
  <>
    {[...new Array(3).fill(1)].map((_, index) => (
      <div
        key={"dummy-content" + index}
        className="bg-[#111] p-8 md:p-14 rounded-3xl mb-4 text-gray-200"
      >
        <p className="text-base md:text-2xl font-sans max-w-3xl mx-auto mb-6">
          旅の思い出をより美しく。ReelTripが自動生成するリールであなたの旅を再体験。
        </p>
        <img
          src="https://assets.aceternity.com/macbook.png"
          alt="ReelTrip preview"
          height="500"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
        />
      </div>
    ))}
  </>
);

const data = [
  {
    category: "都市",
    title: "東京の夜景",
    src: "https://be-en.co.jp/cdn/shop/products/0307134812_6406c20ced583.jpg?v=1708723259",
    content: <DummyContent />,
  },
  {
    category: "自然",
    title: "富士山麓の絶景旅",
    src: "https://static.gltjp.com/glt/data/article/21000/20499/20231024_133525_76bf97f1_w1920.webp",
    content: <DummyContent />,
  },
  {
    category: "海",
    title: "沖縄の透き通る青い海",
    src: "https://article.his-j.com/assets/kokunai/2021/12/1%E6%B0%B4%E7%B4%8D%E5%B3%B6AdobeStock_255879779.jpg",
    content: <DummyContent />,
  },
  {
    category: "歴史",
    title: "京都の古き街並み",
    src: "https://images.microcms-assets.io/assets/a792edb2ff5946069b3513f2d3e198d2/6e3b909864c7457ea6b1db025fd8b988/sannnenzaka_1.jpg",
    content: <DummyContent />,
  },
];
