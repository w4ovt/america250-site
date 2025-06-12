import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Count all rows where end_time IS NULL (currently ON AIR)
    const result = await db
      .select()
      .from(volunteer_activations)
      .where(sql`${volunteer_activations.end_time} IS NULL`);

    return NextResponse.json({ count: result.length });
  } catch (err) {
    console.error('Error getting activation count:', err);
    return NextResponse.json({ count: 0, error: 'Failed to fetch count' }, { status: 500 });
  }
}
