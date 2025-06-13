import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';

// Helper: Get current UTC time as "HH:mm:ss"
function getCurrentUTCTimeString() {
  const now = new Date();
  return now.toISOString().slice(11, 19); // "HH:mm:ss"
}

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing activation ID" }, { status: 400 });
  }
  try {
    const result = await db.update(volunteer_activations)
      .set({ end_time: getCurrentUTCTimeString() })
      .where(eq(volunteer_activations.id, id))
      .returning();
    if (result.length === 0) {
      return NextResponse.json({ error: "Activation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, ended: result[0] });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

