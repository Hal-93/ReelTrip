import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CheckSquare } from "lucide-react";

export default function FirstPostGuide() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-8 bg-gradient-to-b from-cyan-300 to-indigo-800">
      {/* タイトル */}
      <div className="w-full max-w-sm">
        <Card className="bg-white/90 rounded-2xl shadow-lg">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-xl font-bold">初めての投稿ガイド</h1>

            {/* 投稿写真のコツ */}
            <div>
              <p className="font-semibold text-lg mb-2">📸 投稿写真のコツ</p>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                <li>明るい場所で撮影しましょう</li>
                <li>被写体を中心に配置しましょう</li>
                <li>ピントを合わせましょう</li>
              </ul>
            </div>

            {/* チェックリスト */}
            <div>
              <p className="flex items-center gap-2 font-semibold text-lg mb-1">
                <CheckSquare size={20} /> AIのチェック機能
              </p>
              <p className="text-sm leading-relaxed">
                ・AIがあなたの画像をチェックしています。
                <br />
                ・条件に満たない写真は、AIによって許可されない場合があります。
                <br />
                ・もしエラーが出たらもう一度写真を撮ってアップロードし直してください。
              </p>
            </div>

            {/* 戻るボタン */}
            <div className="pt-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}