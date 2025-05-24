import { NextResponse } from 'next/server';
import { db } from '../../../../db/drizzle';

export async function GET() {
  try {
    await db.execute('SELECT 1');
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({
      error: `Database connection failed: ${error.message}`
    }, { status: 500 });
  }
}