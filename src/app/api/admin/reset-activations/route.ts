// src/app/api/volunteers/auth/route.ts

import { NextResponse } from "next/server";
import { db } from "@db/drizzle";
import { volunteers } from "@db/schema";
import { and, eq } from "drizzle-orm";

// POST: Authenticate volunteer by PIN and return volunteer info with admin flag
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { pin } = await req.json();

    if (!pin) {
      // No PIN provided, reject
      return NextResponse.json(
        { success: false, error: "PIN is required." },
        { status: 400 }
      );
    }

    // Look up volunteer by PIN
    const volunteerRows = await db
      .select({
        name: volunteers.name,
        callsign: volunteers.callsign,
        state: volunteers.state,
        isAdmin: volunteers.is_admin,
      })
      .from(volunteers)
      .where(eq(volunteers.pin, pin))
      .limit(1);

    // If not found, respond with error
    if (volunteerRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "PIN not recognized. Please try again." },
        { status: 401 }
      );
    }

    // Get the volunteer row
    const volunteer = volunteerRows[0];

    // Respond with volunteer info and isAdmin flag
    return NextResponse.json({
      success: true,
      name: volunteer.name,
      callsign: volunteer.callsign,
      state: volunteer.state,
      isAdmin: volunteer.isAdmin === true, // Explicitly ensure boolean
    });
  } catch (error) {
    // Catch-all for unexpected errors
    console.error("PIN authentication error:", error);
    return NextResponse.json(
      { success: false, error: "Server error authenticating PIN." },
      { status: 500 }
    );
  }
}

// Only allow POST for this endpoint
export const GET = undefined;
export const PUT = undefined;
export const DELETE = undefined;
