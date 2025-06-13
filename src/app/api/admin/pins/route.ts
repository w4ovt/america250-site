import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from '@db/drizzle';
import { pins } from '@db/schema';

const ADMIN_PIN = process.env.ADMIN_PIN || "7317";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization")?.trim();
  console.log('AUTH HEADER:', authHeader); // <-- Inside handler
  
  if (authHeader !== ADMIN_PIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const allPins = await db.select().from(pins);
    return NextResponse.json(allPins);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization")?.trim();
  console.log('AUTH HEADER:', authHeader); // <-- Inside handler
  
  if (authHeader !== ADMIN_PIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { pin, volunteer } = await req.json();
  try {
    const newPin = await db.insert(pins).values({
      pin: pin.toString(),
      volunteer
    }).returning();
    return NextResponse.json(newPin[0]);
  } catch (error) {
    return NextResponse.json({ error: "PIN already exists" }, { status: 409 });
  }
}

export async function DELETE(req: Request) {
  const authHeader = req.headers.get("Authorization")?.trim();
  console.log('AUTH HEADER:', authHeader); // <-- Inside handler
  
  if (authHeader !== ADMIN_PIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  try {
    await db.delete(pins).where(eq(pins.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
