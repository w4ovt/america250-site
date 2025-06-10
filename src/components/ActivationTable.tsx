// src/components/ActivationTable.tsx

import React from 'react';
import styles from './ActivationTable.module.css';

const COLUMNS = ['ID', 'FREQUENCY', 'MODE TYPE', 'NCS NAME', 'CALLSIGN', 'STATE'];
const SAMPLE_ROWS = [
  ['1', '14.250', 'SSB', 'Marc', 'W4OVT', 'NC'],
  ['2', '7.250', 'CW', 'Michelle', 'N3YRZ', 'MD'],
  ['3', '3.885', 'AM', 'Jim', 'KE4ZUN', 'NC'],
  ['4', '14.070', 'FT8', 'Ken', 'K7ARN', 'AZ'],
  ['5', '3.993', 'SSB', 'Joe', 'K4PX', 'KY'],
  ['6', '7.180', 'SSB', 'Tony', 'KA3BPN', 'PA'],
  ['7', '14.300', 'SSB', 'Molly', 'W3NY', 'PA'],
  ['8', '7.258', 'CW', 'BJ', 'KO7T', 'WA'],
];

export default function ActivationTable() {
  return (
    <div className={styles.tableWrapper}>

      {/* Desktop/Table: Semantic Table */}
      <table className={styles.activationTable} aria-label="Activation Table">
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SAMPLE_ROWS.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={colIdx} data-label={COLUMNS[colIdx]}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile/Card view: Each row as a flex card */}
      <div className={styles.cardList} aria-label="Activation Table (Mobile)">
        {SAMPLE_ROWS.map((row, rowIdx) => (
          <div className={styles.card} key={rowIdx}>
            {row.map((cell, colIdx) => (
              <div className={styles.cardRow} key={colIdx}>
                <span className={styles.cardLabel}>{COLUMNS[colIdx]}:</span>
                <span className={styles.cardValue}>{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

