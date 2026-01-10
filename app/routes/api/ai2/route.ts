import type { ActionFunction } from "react-router";
import OpenAI from "openai";

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const spot = form.get("spot");
    const lat = form.get("lat");
    const lng = form.get("lng");

    if (
      !spot ||
      typeof spot !== "string" ||
      !lat ||
      !lng ||
      isNaN(Number(lat)) ||
      isNaN(Number(lng))
    ) {
      return Response.json(
        { error: "Invalid spot or coordinates" },
        { status: 400 },
      );
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

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
            text: `
            あなたはJSON生成専用アシスタントです。
            説明文・コードフェンス・前後の文章は一切出力せず、
            以下の形式の JSON のみを返してください。

            {
              "category": string,
              "desc": string
            }
            `
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            以下をもとに、このスポットの情報を出力してください。
            
            ・スポット名: ${spot}
            ・緯度: ${latitude}
            ・経度: ${longitude}
            
            以下を出力すること。
            ・category: （一言で）
            ・desc: （端的に場所の魅力と特徴を説明）
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
