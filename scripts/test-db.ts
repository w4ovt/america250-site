import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { volunteers } from '../db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function test() {
  try {
    const result = await db.select().from(volunteers);
    console.log('Volunteers:', result);
  } catch (e) {
    console.error('DB Error:', e);
  }
}

test();
