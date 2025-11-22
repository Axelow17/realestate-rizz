// app/api/house-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { buildHouseImagePrompt, generateHouseImageBuffer } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || "anon";
  const houseType = searchParams.get("houseType") || "mysterious tiny house";

  const prompt = buildHouseImagePrompt({ username, houseType });

  const buf = await generateHouseImageBuffer(prompt);
  if (!buf) {
    return new NextResponse("AI image unavailable", { status: 500 });
  }

  return new NextResponse(buf as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
