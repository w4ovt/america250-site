import { NextResponse } from 'next/server';
import { db } from '../../../../db/drizzle';
import { volunteer_activations } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time,
      end_time,
    } = data;

    // Get the cumulative activation number
    const totalCount = await db.select().from(volunteer_activations);
    const activation_number = totalCount.length + 1;

    // Get the per-operator activation number
    const operatorCount = await db
      .select()
      .from(volunteer_activations)
      .where(eq(volunteer_activations.operator_name, operator_name));
    const operator_activation_number = operatorCount.length + 1;

    // Insert new activation
    await db.insert(volunteer_activations).values({
      frequency,
      mode,
      operator_name,
      callsign,
      state,
      start_time,
      end_time,
    });

    return NextResponse.json({
      success: true,
      activation_number,
      operator_activation_number
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit activation' },
      { status: 500 }
    );
  }
}