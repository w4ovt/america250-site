import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { eq, and, sql } from 'drizzle-orm';

// POST: Create new activation
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time
      // end_time intentionally omitted on creation
    } = data;

    // Basic validation
    if (
      !frequency ||
      !mode ||
      !operator_name ||
      !callsign ||
      !state ||
      !start_time
    ) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Enforce only one active activation per operator
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

    // Insert new activation (end_time = NULL)
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

// GET: List all current ON AIR activations
export async function GET() {
  try {
    // Only show activations where end_time IS NULL (still ON AIR)
    const activations = await db
      .select({
        id: volunteer_activations.id,
        frequency: volunteer_activations.frequency,
        mode: volunteer_activations.mode,
        operator_name: volunteer_activations.operator_name,
        callsign: volunteer_activations.callsign,
        state: volunteer_activations.state,
        // Optionally include: start_time, end_time if desired for later features
      })
      .from(volunteer_activations)
      .where(sql`${volunteer_activations.end_time} IS NULL`)
      .orderBy(volunteer_activations.id);

    return NextResponse.json({ activations });
  } catch (error) {
    console.error('GET /api/activations error:', error);
    return NextResponse.json(
      { activations: [], error: 'Failed to load activations' },
      { status: 500 }
    );
  }
}

