import { NextResponse } from 'next/server';
import { db } from '../../../../db/drizzle';
import { activations } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      frequency,
      mode,
      operator_name,
      state,
      start_time,
      end_time,
    } = data;

    // Get the cumulative activation number
    const totalCount = await db.select().from(activations);
    const activation_number = totalCount.length + 1;

    // Get the per-operator activation number
    const operatorCount = await db
      .select()
      .from(activations)
      .where(eq(activations.operator_name, operator_name));
    const operator_activation_number = operatorCount.length + 1;

    // Insert new activation
    await db.insert(activations).values({
      frequency,
      mode,
      operator_name,
      state,
      start_time: new Date(start_time),
      end_time: end_time ? new Date(end_time) : null,
      activation_number,
      operator_activation_number,
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