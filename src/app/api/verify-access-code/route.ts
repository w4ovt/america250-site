// src/app/api/verify-access-code/route.ts

import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      frequency,
      mode,
      operator_name,
      callsign,     // NEW FIELD
      state,
      start_time,
      end_time,     // Not required on creation, but included if you intend to handle it
    } = data;

    // Validate all required fields
    if (
      !frequency ||
      !mode ||
      !operator_name ||
      !callsign ||
      !state ||
      !start_time
      // Remove !end_time if not required for a new activation
    ) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Insert new activation (get the activation number/id from returning)
    const result = await db.insert(volunteer_activations).values({
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time,
      end_time: end_time ?? null // If not provided, set to null
    }).returning({ id: volunteer_activations.id });

    // activation_number is the id just inserted
    const activation_number = result[0]?.id;

    // Get the per-operator activation count (if you need this for display)
    const operatorCount = await db
      .select()
      .from(volunteer_activations)
      .where(eq(volunteer_activations.operator_name, operator_name));
    const operator_activation_number = operatorCount.length;

    return NextResponse.json({
      success: true,
      activation_number,
      operator_activation_number,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit activation' },
      { status: 500 }
    );
  }
}
