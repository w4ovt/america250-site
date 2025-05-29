import { NextResponse } from 'next/server';
import { db } from '../../../../db/drizzle';
import { volunteer_activations } from '../../../../db/schema';

// POST /api/volunteer
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation (expand as needed)
    const { frequency, mode, operator_name, state, start_time, end_time } = data;
    if (
      !frequency ||
      !mode ||
      !operator_name ||
      !state ||
      !start_time ||
      !end_time
    ) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Write to Neon DB
    const result = await db.insert(volunteer_activations).values({
      frequency,
      mode,
      operator_name,
      state,
      start_time,
      end_time,
    });

    return NextResponse.json(
      { message: 'Activation logged successfully.', result },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error.', details: err.message },
      { status: 500 }
    );
  }
}