import type { ActionFunction } from "react-router";
import OpenAI from "openai";

const spot = "吟風 赤羽店";
const latitude = 35.77952660059958;
const longitude = 139.72441244424638;

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    // const base64 = buffer.toString("base64");

    const oai = new OpenAI({
      apiKey: process.env.API_KEY,
      baseURL: process.env.BASE_URL,
    });

    const messages = [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "あなたはスポットのジャンル分類と概要説明を行うアシスタントです。スポット名を最優先に判断し、緯度・経度は補助情報として使用してください。",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            以下の情報をもとに、このスポットの情報を出力してください。
            
            ・スポット名: ${spot}
            ・緯度: ${latitude}
            ・経度: ${longitude}
            
            出力形式は以下に従ってください：

            ジャンル: （一言で）
            概要: （端的に場所の魅力と特徴を説明）
            `,
          },
        ],
      },
    ] satisfies OpenAI.ChatCompletionMessageParam[];

    const resp = await oai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return Response.json({ result: resp.choices[0].message.content });
  } catch (e) {
    console.error("[AI ERROR]", e);
    return Response.json({ error: "AI processing failed" }, { status: 500 });
  }
};
