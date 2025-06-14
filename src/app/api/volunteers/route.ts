import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { eq, or } from 'drizzle-orm';
import { volunteers } from '@db/schema';

export async function GET() {
  try {
    const volunteerList = await db
      .select({
        name: volunteers.name,
        callsign: volunteers.callsign,
        state: volunteers.state
      })
      .from(volunteers);

    return NextResponse.json(volunteerList);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load volunteers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, callsign, state, pin } = await req.json();
    
    // Validate input
    if (!name || !callsign?.match(/^[A-Z0-9]{3,10}$/i) || !pin?.match(/^\d{4,8}$/)) {
      return NextResponse.json(
        { error: 'Invalid volunteer data' },
        { status: 400 }
      );
    }

    // Check for existing callsign or PIN
    const existing = await db.select()
      .from(volunteers)
      .where(or(
        eq(volunteers.callsign, callsign.toUpperCase()),
        eq(volunteers.pin, pin)
      ));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Callsign or PIN already exists' },
        { status: 409 }
      );
    }

    // Insert new volunteer
    const result = await db.insert(volunteers).values({
      name,
      callsign: callsign.toUpperCase(),
      state: state.toUpperCase(),
      pin
    }).returning();

    return NextResponse.json({ success: true, volunteer: result[0] });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}
