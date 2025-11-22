// lib/storage.ts

import { generateHouseForUser, HouseResult } from "@/lib/house-generator";

export type StoredHouse = HouseResult & {
  fid: number;
  createdAt: string;
};

export type LeaderboardEntry = {
  fid: number;
  username: string;
  houseType: string;
  absurdPrice: string;
  voteCount: number;
  createdAt: string;
};

// In-memory stores (per process)
// NOTE: replace with Redis/DB if you want persistence across restarts.
const houseStore = new Map<string, StoredHouse>();
const voteStore = new Map<string, Set<number>>(); // key = targetFid, value = Set of voterFid

type SimpleUserProfile = {
  fid: number;
  username: string;
  followers: number;
  following: number;
};

export async function getOrCreateHouseForUser(
  user: SimpleUserProfile
): Promise<StoredHouse> {
  const key = String(user.fid);
  const existing = houseStore.get(key);
  if (existing) return existing;

  const result = generateHouseForUser({
    username: user.username,
    followers: user.followers,
    following: user.following
  });

  const stored: StoredHouse = {
    ...result,
    fid: user.fid,
    createdAt: new Date().toISOString()
  };

  houseStore.set(key, stored);
  return stored;
}

export async function getHouseByFid(
  fid: number
): Promise<StoredHouse | null> {
  return houseStore.get(String(fid)) ?? null;
}

export async function voteForHouse(
  voterFid: number,
  targetFid: number
): Promise<{
  ok: boolean;
  reason?: string;
  voteCount?: number;
}> {
  if (voterFid === targetFid) {
    return { ok: false, reason: "You cannot vote for your own house." };
  }

  const targetKey = String(targetFid);
  if (!houseStore.has(targetKey)) {
    return { ok: false, reason: "Target house does not exist yet." };
  }

  let voters = voteStore.get(targetKey);
  if (!voters) {
    voters = new Set<number>();
    voteStore.set(targetKey, voters);
  }

  if (voters.has(voterFid)) {
    return { ok: false, reason: "You already voted for this house." };
  }

  voters.add(voterFid);

  return { ok: true, voteCount: voters.size };
}

export function getVoteCount(targetFid: number): number {
  const voters = voteStore.get(String(targetFid));
  return voters ? voters.size : 0;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const entries: LeaderboardEntry[] = [];

  for (const [fidStr, house] of houseStore.entries()) {
    const fid = Number(fidStr);
    const voteCount = getVoteCount(fid);
    if (voteCount <= 0) continue;

    entries.push({
      fid,
      username: house.username,
      houseType: house.houseType,
      absurdPrice: house.absurdPrice,
      voteCount,
      createdAt: house.createdAt
    });
  }

  entries.sort((a, b) => {
    if (b.voteCount !== a.voteCount) return b.voteCount - a.voteCount;
    return a.createdAt.localeCompare(b.createdAt);
  });

  return entries.slice(0, limit);
}

export async function getAllHouses(): Promise<StoredHouse[]> {
  return Array.from(houseStore.values()).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );
}
