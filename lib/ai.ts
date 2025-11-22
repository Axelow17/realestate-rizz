// lib/ai.ts

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL_ID =
  process.env.HF_MODEL_ID || "stabilityai/stable-diffusion-2-1";

if (!HF_API_KEY) {
  console.warn("HF_API_KEY is not set. AI image generation will not work.");
}

export async function generateHouseImageBuffer(
  prompt: string
): Promise<Buffer | null> {
  if (!HF_API_KEY) return null;

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  if (!res.ok) {
    console.error("HF error:", res.status, await res.text().catch(() => ""));
    return null;
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function buildHouseImagePrompt(args: {
  username: string;
  houseType: string;
}) {
  return [
    `futuristic illustration of a house representing: "${args.houseType}"`,
    "neon cyberpunk style, isometric view, bright, playful, cute, cartoonish",
    "high detail, 3d render, soft lighting"
  ].join(", ");
}
