import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Force dynamic — never statically generate this route
export const dynamic = "force-dynamic";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const KEY = "portfolio:views";

// GET — return current count
export async function GET() {
  try {
    const redis = getRedis();
    const views = (await redis.get<number>(KEY)) ?? 0;
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

// POST — increment and return new count
export async function POST() {
  try {
    const redis = getRedis();
    const views = await redis.incr(KEY);
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
