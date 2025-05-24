import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(process.cwd(), 'certs', 'cert.pem')).toString(),
      }
    : false,
  max: 5,
});