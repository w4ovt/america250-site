import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { isNull } from 'drizzle-orm';

export async function GET() {
  try {
    // ON AIR if any activation has end_time NULL
    const rows = await db
      .select()
      .from(volunteer_activations)
      .where(isNull(volunteer_activations.end_time));
    const onAir = rows.length > 0;
    return NextResponse.json({ onAir });
  } catch (err) {
    console.error('ON AIR check error:', err);
    return NextResponse.json(
      { onAir: false, error: 'Failed to check ON AIR status' },
      { status: 500 }
    );
  }
}


