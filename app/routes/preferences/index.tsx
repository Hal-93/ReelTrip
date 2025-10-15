import { useState } from 'react';
import { Link } from 'react-router';

const topics = [
  'グルメ', '景色', '海', 'アクティビティ',
  '山', '温泉', '癒し', '非日常感'
];

export default function PreferencesPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    if (selected.includes(topic)) {
      setSelected(selected.filter(t => t !== topic));
    } else {
      setSelected([...selected, topic]);
    }
  };

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 sm:p-20 gap-6
                    bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white">

      {/* ヘッダー */}
      <h1 className="text-3xl font-bold text-center">あなたの好みを選択してください</h1>
      <p className="text-sm text-center text-gray-300">
        好みのトピックに基づいて、動画がパーソナライズされます。
      </p>

      {/* トピック選択 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-6">
        {topics.map(topic => (
          <div key={topic} className="flex justify-between items-center bg-white text-black rounded-xl px-4 py-3">
            <span>{topic}</span>
            <button
              onClick={() => toggleTopic(topic)}
              className={`w-8 h-8 flex justify-center items-center rounded-full
                         ${selected.includes(topic) ? 'bg-blue-500 text-white' : 'bg-sky-200 text-black'}`}
            >
              {selected.includes(topic) ? '✓' : '+'}
            </button>
          </div>
        ))}
      </div>

      {/* 決定ボタン（リンクで ReelsPage へ） */}
      <Link to="/reels">
        <button
          className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600"
        >
          決定
        </button>
      </Link>
    </div>
  );
}
