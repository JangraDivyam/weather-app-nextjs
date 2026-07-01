import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { favouriteCity } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { city, country } = await req.json();
  if (!city || !country) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    await db.insert(favouriteCity).values({
      id: randomUUID(),
      userId: session.user.id,
      city,
      country,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already saved" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { city } = await req.json();
  await db.delete(favouriteCity).where(
    and(eq(favouriteCity.userId, session.user.id), eq(favouriteCity.city, city))
  );
  return NextResponse.json({ success: true });
}
