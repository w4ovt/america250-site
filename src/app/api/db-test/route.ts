// src/app/api/activations/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../db/drizzle';
import { volunteer_activations } from '../../../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

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
      // end_time intentionally omitted
    } = data;

    // Validation
    if (!frequency || !mode || !operator_name || !callsign || !state || !start_time) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Only one active activation per operator
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

    // Insert new activation (with null end_time)
    const result = await db.insert(volunteer_activations).values({
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time,
      end_time: null
    }).returning({ id: volunteer_activations.id });

    // Get activation_number as the id of the inserted row
    const activation_number = result[0]?.id;

    return NextResponse.json({
      success: true,
      activation_number,
      activation_id: activation_number // both keys for clarity
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit activation' },
      { status: 500 }
    );
  }
}
