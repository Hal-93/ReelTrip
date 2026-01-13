import OpenAI from "openai";

export async function analyzeImageWithAI(spotName: string, lat: string, lng: string) {
  if (!spotName || isNaN(Number(lat)) || isNaN(Number(lng))) {
    throw new Error("Invalid spot or coordinates");
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
          text: `あなたはJSON生成専用アシスタントです。説明文・コードフェンス・前後の文章は一切出力せず、以下の形式の JSON のみを返してください。{ "category": string, "desc": string }`,
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `以下をもとに、このスポットの情報を出力してください。\n・スポット名: ${spotName}\n・緯度: ${latitude}\n・経度: ${longitude}\n以下を出力すること。\n・category: （一言で）\n・desc: （端的に場所の魅力と特徴を説明）`,
        },
      ],
    },
  ] as const;

  const resp = await oai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages as any,
  });

  const raw = resp.choices[0]?.message?.content || "{}";
  let parsed: { category?: string; desc?: string } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned non-JSON");
  }

  return {
    category: parsed.category || "",
    desc: parsed.desc || "",
  };
}
