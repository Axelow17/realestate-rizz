// app/api/leaderboard/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || "10") || 10;

  const data = await getLeaderboard(limit);

  return NextResponse.json({
    leaderboard: data
  });
}
