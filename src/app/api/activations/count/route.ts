import { NextResponse } from 'next/server';
import { db } from '@db/drizzle';
import { volunteer_activations } from '@db/schema';

export async function GET() {
  try {
    const totalCount = await db.select().from(volunteer_activations);
    return NextResponse.json({ count: totalCount.length });
  } catch (err) {
    console.error('Error getting activation count:', err);
    return NextResponse.json({ count: 0, error: 'Failed to fetch count' }, { status: 500 });
  }
}