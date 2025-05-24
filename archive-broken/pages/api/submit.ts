// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("BODY RECEIVED:", req.body); // Debug logging
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { band, frequency, mode, name, callsign, state, comments } = req.body;

  // Validate required fields
  if (!band || !frequency || !mode || !name || !callsign || !state) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate callsign format
  const callsignRegex = /^[A-Z0-9]{3,8}$/;
  if (!callsignRegex.test(callsign.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid callsign format' });
  }

  try {
    await pool.query(
      `INSERT INTO activations (band, frequency, mode, name, callsign, state, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        band,
        Number(frequency),
        mode,
        name,
        callsign.toUpperCase(),
        state,
        comments || null
      ]
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("DB insert failed:", errorMessage);
    return res.status(500).json({ error: 'Database error' });
  }
}