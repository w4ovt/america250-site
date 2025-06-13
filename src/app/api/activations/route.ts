import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { eq, and, sql } from 'drizzle-orm';

// POST: Create new activation (UNCHANGED)
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Incoming data: ", data);

    const { frequency, mode, operator_name, callsign, state, start_time } = data;

    // Validation remains the same
    if (!frequency || !mode || !operator_name || !callsign || !state || !start_time) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Existing active activation check
    const active = await db.select()
      .from(volunteer_activations)
      .where(
        and(
          eq(volunteer_activations.operator_name, operator_name),
          sql`${volunteer_activations.end_time} IS NULL`
        )
      );

    if (active.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You already have an active activation. End it before starting a new one.' },
        { status: 409 }
      );
    }

    // Insert logic remains the same
    const result = await db.insert(volunteer_activations).values({
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time,
      end_time: null
    }).returning({ id: volunteer_activations.id });

    const activation_number = result[0]?.id;
    return NextResponse.json({ success: true, activation_number, activation_id: activation_number });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit activation' },
      { status: 500 }
    );
  }
}

// GET: List ALL activations (CORRECTED VERSION)
export async function GET() {
  try {
    const activations = await db
      .select({
        id: volunteer_activations.id,
        frequency: volunteer_activations.frequency,
        mode: volunteer_activations.mode,
        operator_name: volunteer_activations.operator_name,
        callsign: volunteer_activations.callsign,
        state: volunteer_activations.state,
        start_time: volunteer_activations.start_time,  // Added for UI
        end_time: volunteer_activations.end_time       // Added for UI
      })
      .from(volunteer_activations)
      .orderBy(volunteer_activations.id);

    // Return array directly instead of wrapping in {activations}
    return NextResponse.json(activations);

  } catch (error) {
    console.error('GET /api/activations error:', error);
    // Return empty array on error to match expected format
    return NextResponse.json([], { status: 500 });
  }
}



