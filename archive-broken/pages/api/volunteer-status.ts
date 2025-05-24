// pages/api/volunteer-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../db';

// Type definitions
interface ActivationRecord {
  activation_id: number;
  band: string;
  frequency: number;
  mode: string;
  name: string;
  callsign: string;
  state: string;
  comments: string | null;
  timestamp: Date;
}

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivationRecord[] | ErrorResponse>
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9); // Unique ID for tracing
  
  try {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Validate HTTP method
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ 
        error: `Method ${req.method} Not Allowed` 
      });
    }

    // Parameter validation
    const limit = Math.min(parseInt(req.query.limit as string) || 1, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

    // Query execution
    const result = await pool.query<ActivationRecord>(
      `SELECT activation_id, band, frequency, mode, name, 
              callsign, state, comments, timestamp 
       FROM activations 
       ORDER BY timestamp DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Structured success logging
    console.info(JSON.stringify({
      type: 'DB_QUERY_SUCCESS',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      requestId,
      rowCount: result.rowCount,
      parameters: { limit, offset }
    }));

    return res.status(200).json(result.rows);
    
  } catch (err: unknown) {
    // Error handling
    const error = err instanceof Error ? err : new Error('Unknown error');
    const errorData = {
      type: 'DB_QUERY_FAILURE',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      requestId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        // Postgres-specific error fields
        ...(typeof err === 'object' && 'code' in err! ? { code: (err as any).code } : {}),
        ...(typeof err === 'object' && 'detail' in err! ? { detail: (err as any).detail } : {})
      },
      request: {
        method: req.method,
        url: req.url,
        query: req.query
      }
    };

    // Structured error logging
    console.error(JSON.stringify(errorData));

    // Secure error response
    return res.status(500).json({
      error: process.env.NODE_ENV === 'development' 
        ? `Database error: ${error.message}` 
        : 'Internal server error'
    });
  }
}