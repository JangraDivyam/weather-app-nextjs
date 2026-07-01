import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { searchHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(searchHistory).where(eq(searchHistory.userId, session.user.id));
  return NextResponse.json({ success: true });
}
