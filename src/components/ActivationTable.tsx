'use client';

import React, { useEffect, useState } from 'react';
import styles from './ActivationTable.module.css';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchActivations() {
      setLoading(true);
      try {
        const res = await fetch('/api/activations');
        if (!res.ok) throw new Error('Failed to fetch activations');
        const data = await res.json();
        if (isMounted) {
          setRows(Array.isArray(data.activations) ? data.activations : []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Could not load activations.');
          setRows([]);
        }
      }
      if (isMounted) setLoading(false);
    }
    fetchActivations();
    const interval = setInterval(fetchActivations, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 700);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Always pad to at least 5 rows for the table view
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
      {/* Desktop/tablet: Table view with minimum 5 rows */}
      {!isMobile && (
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
      )}

      {/* Mobile: Card view, show all activations as cards */}
      {isMobile && (
        <div className={styles.cardList} aria-label="Activation Table (Mobile)">
          {loading ? (
            <div className={styles.card} style={{ textAlign: 'center' }}>
              Loading activations...
            </div>
          ) : error ? (
            <div className={styles.card} style={{ color: '#b40000' }}>
              {error}
            </div>
          ) : rows.length === 0 ? (
            <div className={styles.card} style={{ textAlign: 'center' }}>
              No activations.
            </div>
          ) : (
            rows.map((row, idx) => {
              let idValue = '';
              if (typeof row.id === 'number') {
                idValue = String(row.id);
              } else if (typeof row.id === 'string' && !row.id.startsWith('dummy-')) {
                idValue = row.id;
              }
              return (
                <div
                  className={styles.card}
                  key={typeof row.id === 'number' ? row.id : `mobile-${idx}`}
                >
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>ID:</span>
                    <span className={styles.cardValue}>{idValue}</span>
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
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
