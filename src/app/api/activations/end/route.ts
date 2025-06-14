import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm"; // Added sql import
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing activation ID" }, { status: 400 });
  }
  try {
    const result = await db.update(volunteer_activations)
      .set({ 
        end_time: sql`CURRENT_TIMESTAMP` // Use PostgreSQL's current timestamp
      })
      .where(eq(volunteer_activations.id, id))
      .returning();
      
    if (result.length === 0) {
      return NextResponse.json({ error: "Activation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, ended: result[0] });
  } catch (error) {
    console.error("End activation error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}


