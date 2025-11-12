import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { SparklesCore } from "~/components/ui/sparkles";
import { BentoGrid, BentoGridItem } from "~/components/ui/bento-grid";
import { LampContainer } from "~/components/ui/lamp";
import { Carousel, Card } from "~/components/ui/apple-cards-carousel";
import { AnimatedTestimonials } from "~/components/ui/animated-testimonials";
import { ChevronDown } from "lucide-react";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
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

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const items = [
    {
      title: "AIがあなたの旅を自動編集",
      description:
        "アップロードした写真をAIが自動で選別・補正し、最適なリール動画を生成します。",
      header: <Skeleton />,
      icon: <IconClipboardCopy className="h-4 w-4 text-blue-400" />,
    },
    {
      title: "位置情報から旅の地図を生成",
      description:
        "写真のEXIF情報を元に、旅のルートをインタラクティブマップで表示します。",
      header: <Skeleton />,
      icon: <IconFileBroken className="h-4 w-4 text-green-400" />,
    },
    {
      title: "BGM自動選択",
      description:
        "旅の雰囲気に合わせてAIがBGMを自動選曲。映像体験をさらに魅力的に。",
      header: <Skeleton />,
      icon: <IconSignature className="h-4 w-4 text-yellow-400" />,
    },
    {
      title: "リールのシェア機能",
      description:
        "作成したリールをワンタップでSNSに共有。友人と旅の思い出を簡単にシェア。",
      header: <Skeleton />,
      icon: <IconTableColumn className="h-4 w-4 text-pink-400" />,
    },
    {
      title: "クラウド保存と同期",
      description:
        "全てのリールを安全にクラウドへ保存。デバイスを問わずいつでもアクセス可能。",
      header: <Skeleton />,
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-purple-400" />,
    },
    {
      title: "オフライン編集対応",
      description:
        "ネット接続がない場所でもリールのプレビューや簡易編集が可能です。",
      header: <Skeleton />,
      icon: <IconBoxAlignTopLeft className="h-4 w-4 text-orange-400" />,
    },
    {
      title: "旅人同士のつながり",
      description:
        "あなたのリールを通して、同じ場所を旅した人々とつながる新しいSNS体験。",
      header: <Skeleton />,
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

      <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        >
          ReelTrip
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 max-w-2xl text-lg text-gray-300"
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

      <section className="relative z-10 bg-gradient-to-b from-black via-gray-900 to-black">
        <LampContainer>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-24 bg-gradient-to-br from-slate-200 to-slate-400 py-6 bg-clip-text text-center text-6xl md:text-6xl font-bold tracking-tight text-transparent"
          >
            ReelTripでできること
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center mt-8"
          >
            <ChevronDown className="w-12 h-12 text-gray-300 animate-bounce" />
          </motion.div>
        </LampContainer>
        <div className="max-w-6xl mx-auto px-6">
          <BentoGrid className="max-w-4xl mx-auto">
            {items.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      <section className="relative z-10 py-32 bg-gradient-to-t from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-10">ユーザーの声</h2>
          <AnimatedTestimonials
            testimonials={[
              {
                name: "1",
                quote:
                  "動画生成が早くて自然。SNS共有もワンタップでできて、投稿の手間が減った。",
                designation: "映像クリエイター",
                src: "/avatars/1.png",
              },
              {
                name: "2",
                quote:
                  "ReelTripで旅行の写真をAIが編集してくれるのがすごい。旅の感動をそのまま映像に残せた。",
                designation: "旅行フォトグラファー",
                src: "/avatars/2.png",
              },
              {
                name: "3",
                quote:
                  "思い出をリールにまとめられるのが楽しい。音楽や映像がAIでマッチするのが驚き。",
                designation: "旅好きライター",
                src: "/avatars/3.png",
              },
              {
                name: "4",
                quote:
                  "家族旅行の写真をアップしただけで、まるでプロが作ったような映像に。子どもたちも大喜び！",
                designation: "会社員・父親",
                src: "/avatars/4.png",
              },
              {
                name: "5",
                quote:
                  "撮影地のルートが自動で地図に表示されて便利。旅の記録をまとめるのに最適なアプリ。",
                designation: "バックパッカー",
                src: "/avatars/5.png",
              },
              {
                name: "6",
                quote:
                  "オフラインでも編集できるのが助かる。山登りやキャンプの記録にも使える。",
                designation: "アウトドア愛好家",
                src: "/avatars/6.png",
              },
            ]}
          />
        </div>
      </section>

      <section className="relative z-10 bg-black py-24 border-t border-gray-800 overflow-hidden">
        <div className="w-full h-full py-20">
          <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-200 font-sans text-center mb-16">
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

      <footer className="relative z-10 py-24 text-center bg-gradient-to-t from-gray-900 to-black">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-semibold mb-6"
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
    title: "東京の夜景リール",
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
