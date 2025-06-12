import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { activation_id, end_time } = data;

    if (!activation_id || !end_time) {
      return NextResponse.json(
        { success: false, error: 'Activation ID and end_time are required.' },
        { status: 400 }
      );
    }

    await db
      .update(volunteer_activations)
      .set({ end_time })
      .where(eq(volunteer_activations.id, Number(activation_id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('End activation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to end activation' },
      { status: 500 }
    );
  }
}


