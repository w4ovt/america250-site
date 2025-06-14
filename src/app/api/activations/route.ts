import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { eq, and, sql } from 'drizzle-orm';

// POST: Create new activation with proper start_time handling
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Incoming data: ", data);

    const { frequency, mode, operator_name, callsign, state, start_time } = data;

    // Validate required fields
    if (!frequency || !mode || !operator_name || !callsign || !state || !start_time) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Convert start_time to Date object
    const parsedStartTime = new Date(start_time);
    if (isNaN(parsedStartTime.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid start_time format' },
        { status: 400 }
      );
    }

    // Check for existing active activation
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
        { success: false, error: 'Existing active activation found' },
        { status: 409 }
      );
    }

    // Insert with proper Date type
    const result = await db.insert(volunteer_activations).values({
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time: parsedStartTime, // Date object instead of string
      end_time: null
    }).returning({ id: volunteer_activations.id });

    const activation_number = result[0]?.id;
    return NextResponse.json({ 
      success: true, 
      activation_number, 
      activation_id: activation_number 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit activation' },
      { status: 500 }
    );
  }
}


// GET: List ALL activations (no changes)
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
        start_time: volunteer_activations.start_time,
        end_time: volunteer_activations.end_time
      })
      .from(volunteer_activations)
      .orderBy(volunteer_activations.id);

    return NextResponse.json(activations);

  } catch (error) {
    console.error('GET /api/activations error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
