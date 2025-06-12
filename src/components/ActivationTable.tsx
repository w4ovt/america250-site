// src/components/ActivationTable.tsx

'use client';

import React, { useEffect, useState } from 'react';
import styles from './ActivationTable.module.css';

// Table column headers
const COLUMNS = ['ID', 'FREQUENCY', 'MODE TYPE', 'NCS NAME', 'CALLSIGN', 'STATE'];

type ActivationRow = {
  id: number | string;
  frequency: string;
  mode: string;
  operator_name: string;
  callsign: string;
  state: string;
};

export default function ActivationTable() {
  const [rows, setRows] = useState<ActivationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current activations from Neon DB via API
    async function fetchActivations() {
      setLoading(true);
      try {
        const res = await fetch('/api/activations');
        if (!res.ok) throw new Error('Failed to fetch activations');
        const data = await res.json();
        setRows(Array.isArray(data.activations) ? data.activations : []);
        setError(null);
      } catch (err: any) {
        setError('Could not load activations.');
        setRows([]);
      }
      setLoading(false);
    }
    fetchActivations();
    // Optional: poll every 30s
    const interval = setInterval(fetchActivations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Pad table to a minimum of 5 rows for desktop display (use negative unique IDs for dummy rows)
  const MIN_ROWS = 5;
  const PADDED_ROWS = [
    ...rows,
    ...Array(Math.max(0, MIN_ROWS - rows.length))
      .fill(null)
      .map((_, idx) => ({
        id: `dummy-${idx}`,
        frequency: '',
        mode: '',
        operator_name: '',
        callsign: '',
        state: '',
      })),
  ];

  return (
    <div className={styles.tableWrapper}>
      {/* Table for desktop/tablet */}
      <table className={styles.activationTable} aria-label="Activation Table">
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COLUMNS.length} style={{ textAlign: 'center', fontSize: '1.1rem' }}>
                Loading activations...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={COLUMNS.length} style={{ color: '#b40000', textAlign: 'center' }}>
                {error}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            // Ensure 5 rows are displayed when there are no activations
            [...Array(MIN_ROWS).keys()].map((_, idx) => (
              <tr key={`dummy-${idx}`}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))
          ) : (
            PADDED_ROWS.map((row, idx) => (
              <tr key={typeof row.id === 'number' ? row.id : `dummy-${idx}`}>
                <td>{typeof row.id === 'number' ? row.id : ''}</td>
                <td>{row.frequency}</td>
                <td>{row.mode}</td>
                <td>{row.operator_name}</td>
                <td>{row.callsign}</td>
                <td>{row.state}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Mobile card view */}
      <div className={styles.cardList} aria-label="Activation Table (Mobile)">
        {loading ? (
          <div className={styles.card} style={{ textAlign: 'center' }}>Loading activations...</div>
        ) : error ? (
          <div className={styles.card} style={{ color: '#b40000' }}>{error}</div>
        ) : rows.length === 0 ? (
          <div className={styles.card}>No activations are currently ON AIR.</div>
        ) : (
          rows.map((row, idx) => (
            <div className={styles.card} key={typeof row.id === 'number' ? row.id : `mobile-dummy-${idx}`}>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>ID:</span>
                <span className={styles.cardValue}>{row.id}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Frequency:</span>
                <span className={styles.cardValue}>{row.frequency}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Mode Type:</span>
                <span className={styles.cardValue}>{row.mode}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>NCS Name:</span>
                <span className={styles.cardValue}>{row.operator_name}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Callsign:</span>
                <span className={styles.cardValue}>{row.callsign}</span>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>State:</span>
                <span className={styles.cardValue}>{row.state}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
