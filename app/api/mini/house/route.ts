// app/api/mini/house/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserByFid } from "@/lib/neynar";
import {
  getOrCreateHouseForUser,
  StoredHouse
} from "@/lib/storage";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const fid = Number(body?.fid || 0);
    if (!fid) {
      return NextResponse.json(
        { error: "Missing fid" },
        { status: 400 }
      );
    }

    const user = await getUserByFid(fid);
    if (!user) {
      return NextResponse.json(
        { error: "User not found in Neynar" },
        { status: 404 }
      );
    }

    const house: StoredHouse = await getOrCreateHouseForUser({
      fid,
      username: user.username,
      followers: user.follower_count,
      following: user.following_count
    });

    const shareUrl = `${BASE_URL}/share?fid=${fid}`;
    const leaderboardUrl = `${BASE_URL}/leaderboard`;

    return NextResponse.json({
      house,
      shareUrl,
      leaderboardUrl
    });
  } catch (e) {
    console.error("Error in /api/mini/house:", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}