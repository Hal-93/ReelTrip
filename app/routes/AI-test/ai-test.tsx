import { Form, useActionData } from "react-router";
import OpenAI from "openai";
import { type ActionFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return "画像がありません";
  }

  // ファイル → base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  // OpenAI クライアント
  const oai = new OpenAI({
    apiKey: process.env.API_KEY, 
    baseURL: process.env.BASE_URL,
  });

  // プロンプト
  const messages = [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: "genre と quality を JSON 形式で返せ"
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text:
            "写真内容からジャンル(Gourmet/Sightseeing/Activity/None)を分類し、genre=(G/A/S/N) を、暗い・不鮮明なら quality=false、それ以外は true を返せ。JSON のみ返答せよ。"
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${base64}`
          }
        }
      ]
    }
  ];

  // OpenAI 実行
  const resp = await oai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return ({ result: resp.choices[0].message.content });
}

// ---------- Component ----------
export default function AiTest() {
  const data = useActionData() as { result?: string };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>画像判定テスト</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="post" encType="multipart/form-data">
          <input
            type="file"
            name="image"
            accept="image/*"
            className="border p-2 rounded-md w-full"
          />
          <Button type="submit" className="mt-4 w-full">送信</Button>
        </Form>
        {data?.result && (
          <p className="mt-4 text-lg">
            {data.result}
          </p>
        )}
      </CardContent>
    </Card>
  );
}