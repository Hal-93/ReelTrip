import { useState } from 'react';

const hints = [
  { title: 'Reel Trip について', content: 'ヒントを見てReel Trip を知り尽くそう！！' },
  { title: 'ポイントの使い方', content: '自治体から付与されたチップで貯めたポイントでリール動画を再生成することが出来ます。行きたい旅先がもっと見つかるかも!?' },
  { title: '写真のチェックポイント', content: '明るさは十分？被写体は中央？ピントが合っているか確認して投稿しよう！' },
  { title: '写真をもっと魅力的に！', content: '自然光で撮影すると映えやすい！シンプルな構図を意識するとベスト！' },
  { title: 'あなた専用のリール', content: 'あなたの好みに合わせてパーソナライズ！旅先の新しい発見が待っています！' },
  { title: 'Reel Trip で見つかる旅', content: '季節ごとのおすすめや、知らなかった穴場スポットに出会えるのが魅力です！' },
  { title: '旅をシェアしよう！', content: 'あなたの投稿が、誰かの次の旅のきっかけになるかもしれません。たくさん投稿しよう！' },
  { title: 'チップについて', content: 'あなたの投稿が地域を魅力的に伝えると、自治体から感謝の意を込めてチップが付与されます。小さな投稿が地域を応援する力に！' }
];

export default function ReelsLoadingPage() {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % hints.length); // ループ
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8
                    bg-white text-black relative">

      {/* ローディングマークと文字 */}
      <div className="flex flex-col items-center mb-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <span className="text-lg font-semibold">ローディング中</span>
      </div>

      {/* ヒント */}
      <div className="flex flex-col items-center px-6 text-center">
        <h2 className="text-sky-500 text-xl font-bold mb-2">{hints[current].title}</h2>
        <p className="text-black text-sm">{hints[current].content}</p>
      </div>

      {/* 「タッチして次のページへ」ボタン */}
      <button
        onClick={handleNext}
        className="absolute bottom-20 text-blue-500 text-sm flex items-center gap-1"
      >
        → タッチして次のページへ
      </button>

      {/* ページインジケータ */}
      <div className="flex gap-2 absolute bottom-10">
        {hints.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-black' : 'bg-gray-300'}`}
          ></span>
        ))}
      </div>
    </div>
  );
}
