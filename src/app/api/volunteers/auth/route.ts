// src/app/api/volunteers/auth/route.ts

import { NextResponse } from "next/server";
import { db } from '@db/drizzle';
import { volunteers } from '@db/schema';
import { eq } from "drizzle-orm";

/**
 * Volunteer PIN authentication API endpoint.
 * Accepts POST with { pin: string }.
 * Returns volunteer details if PIN is valid.
 * Also returns isAdmin flag for admin dashboard unlock.
 *
 * Example request: { pin: "7317" }
 * Example success response: 
 *   { success: true, name: "Marc", callsign: "W4OVT", state: "NC", isAdmin: true }
 * Example failure response:
 *   { success: false, error: "PIN not recognized." }
 */
export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    if (!pin || typeof pin !== "string" || !pin.match(/^\d{4,8}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN format." },
        { status: 400 }
      );
    }

    // Query the volunteers table for a matching PIN
    const result = await db
      .select({
        name: volunteers.name,
        callsign: volunteers.callsign,
        state: volunteers.state,
        is_admin: volunteers.is_admin,
      })
      .from(volunteers)
      .where(eq(volunteers.pin, pin));

    if (result.length === 0) {
      // No matching volunteer found for PIN
      return NextResponse.json(
        { success: false, error: "PIN not recognized. Please try again." },
        { status: 401 }
      );
    }

    // Success: Return volunteer details, isAdmin flag
    const volunteer = result[0];
    return NextResponse.json({
      success: true,
      name: volunteer.name,
      callsign: volunteer.callsign,
      state: volunteer.state,
      isAdmin: Boolean(volunteer.is_admin),
    });
  } catch (error) {
    // Generic error handler
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
