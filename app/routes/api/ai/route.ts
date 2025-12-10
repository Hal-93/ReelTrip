import type { ActionFunction } from "react-router";
import OpenAI from "openai";

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

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
            text: "genre と quality を JSON 形式で返せ"
        }
        ]
    },
    {
        role: "user",
        content: [
        {
            type: "text",
            text: "写真内容から genre(G/A/S/N) と quality(true/false) を分類し、JSON で返せ。"
        },
        {
            type: "image_url",
            image_url: { url: `data:image/png;base64,${base64}` }
        }
        ]
    }
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