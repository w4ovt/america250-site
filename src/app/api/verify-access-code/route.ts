import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code } = await req.json();
  const expectedCode = process.env.VOLUNTEER_ACCESS_CODE;
  return NextResponse.json({
    valid: code?.toLowerCase() === expectedCode?.toLowerCase()
  });
}