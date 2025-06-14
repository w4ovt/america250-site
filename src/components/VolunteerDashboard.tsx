// src/components/VolunteerDashboard.tsx

'use client';
import React, { useState, useEffect } from 'react';
import styles from './VolunteerDashboard.module.css';

// --- Type definitions ---
type VolunteerInfo = {
  name: string;
  callsign: string;
  state: string;
  isAdmin: boolean;
} | null;

type VolunteerDashboardProps = {
  locked: boolean;
  volunteerInfo: VolunteerInfo;
};

// --- Constants for form options and localStorage keys ---
const MODES = ['SSB', 'CW', 'FM', 'AM', 'DIGI'];
const STATES = [
  'NC', 'VA', 'SC', 'GA', 'FL', 'AL', 'TN', 'KY', 'OH', 'PA', 'MD', 'WV', 'DE',
  'NY', 'NJ', 'CT', 'MA', 'RI', 'NH', 'VT', 'ME', 'TX', 'AR', 'OK', 'LA', 'MS',
  'MO', 'IA', 'MN', 'WI', 'IL', 'IN', 'MI', 'SD', 'ND', 'NE', 'KS', 'CO', 'WY',
  'MT', 'ID', 'WA', 'OR', 'CA', 'NV', 'AZ', 'NM', 'UT', 'AK', 'HI'
];

const LOCAL_STORAGE_KEY = 'volunteer_unlocked';
const PIN_STORAGE_KEY = 'volunteerPin';
const ACTIVATION_KEY = 'volunteer_activation_state';

// === VolunteerDashboard Component ===
export default function VolunteerDashboard({
  locked,
  volunteerInfo,
}: VolunteerDashboardProps) {
  // --- Local state for the activation form ---
  const [frequency, setFrequency] = useState('');
  const [mode, setMode] = useState('');
  const [state, setState] = useState('');
  const [activationNumber, setActivationNumber] = useState<number | null>(null);
  const [activationId, setActivationId] = useState<number | null>(null);
  const [activationMessage, setActivationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [endActivationInput, setEndActivationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- On mount or volunteerInfo change, set state field for the volunteer ---
  useEffect(() => {
    if (volunteerInfo) {
      setState(volunteerInfo.state);
    }
  }, [volunteerInfo]);

  // --- On mount, load activation state from localStorage ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ACTIVATION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setActivationNumber(parsed.activationNumber ?? null);
        setActivationId(parsed.activationId ?? null);
        setActivationMessage(parsed.activationMessage ?? null);
      }
    } catch {
      // Ignore JSON parse errors or missing localStorage
    }
  }, []);

  // --- Save activation state to localStorage on relevant state change ---
  useEffect(() => {
    try {
      localStorage.setItem(
        ACTIVATION_KEY,
        JSON.stringify({ activationNumber, activationId, activationMessage })
      );
    } catch {
      // Ignore quota/localStorage issues
    }
  }, [activationNumber, activationId, activationMessage]);

  // --- Handler: Start a new activation ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setActivationMessage(null);
    setIsSubmitting(true);

    if (!volunteerInfo) {
      setErrorMessage('You must enter a valid Volunteer PIN to activate.');
      setIsSubmitting(false);
      return;
    }
    if (!frequency || !mode || !state) {
      setErrorMessage('Frequency, Mode, and State are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/activations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frequency,
          mode,
          operator_name: volunteerInfo.name,
          callsign: volunteerInfo.callsign,
          state,
          start_time: new Date().toISOString(),
        }),
      });
      const result = await response.json();

      if (result.success) {
        setActivationNumber(result.activation_number ?? null);
        setActivationId(result.activation_id ?? null);
        setActivationMessage(
          `Activation #${result.activation_number} started. Thank you for volunteering!`
        );
        setErrorMessage(null);
        setEndActivationInput('');
      } else {
        setErrorMessage(result.error || 'Failed to submit activation.');
      }
    } catch {
      setErrorMessage('Failed to submit activation.');
    }
    setIsSubmitting(false);
  }

  // --- Handler: End an activation ---
  async function handleEndActivation(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const idToEnd = activationId || parseInt(endActivationInput, 10);
    if (!idToEnd) {
      setErrorMessage('Please enter a valid activation number to end.');
      return;
    }

    try {
      const response = await fetch('/api/activations/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idToEnd }),
      });
      const result = await response.json();

      if (result.success) {
        setActivationMessage('Your activation has ended. Thank you for volunteering!');
        setActivationNumber(null);
        setActivationId(null);
        setEndActivationInput('');
        try {
          localStorage.removeItem(ACTIVATION_KEY);
        } catch {}
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error || 'Failed to end activation.');
      }
    } catch {
      setErrorMessage('Failed to end activation.');
    }
  }

  // --- Handler: Remove PIN Access (self-contained) ---
  function handleRemovePin() {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(PIN_STORAGE_KEY);
      localStorage.removeItem(ACTIVATION_KEY);
    } catch {}
    // Reload page to force return to PIN entry state
    window.location.reload();
  }

  // --- Render Volunteer Dashboard ---
  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardHeader}>Volunteer Dashboard</div>

      {/* === Start New Activation Form === */}
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        aria-disabled={locked || !volunteerInfo}
      >
        <fieldset
          className={styles.fieldset}
          disabled={locked || !volunteerInfo || isSubmitting || !!activationId}
        >
          <legend className={styles.legend}>Start a New Activation</legend>
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              name="name"
              value={volunteerInfo?.name ?? ''}
              disabled
              autoComplete="off"
            />
          </label>
          <label className={styles.label}>
            Callsign
            <input
              className={styles.input}
              name="callsign"
              value={volunteerInfo?.callsign ?? ''}
              disabled
              autoComplete="off"
            />
          </label>
          <label className={styles.label}>
            State
            <select
              className={styles.input}
              name="state"
              value={state}
              onChange={e => setState(e.target.value)}
              required
              disabled={locked || !volunteerInfo}
            >
              <option value="">Select...</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Frequency (MHz, e.g. 7.195)
            <input
              className={styles.input}
              name="frequency"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              placeholder="Frequency in MHz"
              required
              disabled={locked || !volunteerInfo}
            />
          </label>
          <label className={styles.label}>
            Mode
            <select
              className={styles.input}
              name="mode"
              value={mode}
              onChange={e => setMode(e.target.value)}
              required
              disabled={locked || !volunteerInfo}
            >
              <option value="">Select...</option>
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <button
            className={styles.button}
            type="submit"
            disabled={locked || !volunteerInfo || isSubmitting || !!activationId}
          >
            {isSubmitting ? 'Submitting...' : 'Start Activation'}
          </button>
        </fieldset>
      </form>

      {/* === Status and Error Messages === */}
      {activationMessage && (
        <div className={styles.success} role="status" aria-live="polite">
          {activationMessage}
        </div>
      )}
      {errorMessage && (
        <div className={styles.error} role="alert">
          {errorMessage}
        </div>
      )}

      {/* === End Activation Form === */}
      <form
        className={styles.form}
        onSubmit={handleEndActivation}
        aria-disabled={locked || !volunteerInfo}
      >
        <fieldset
          className={styles.fieldset}
          disabled={locked || !volunteerInfo || isSubmitting || !activationId}
        >
          <legend className={styles.legend}>End Activation</legend>
          <label className={styles.label}>
            Activation Number
            <input
              className={styles.input}
              type="number"
              value={activationId ?? endActivationInput}
              onChange={e => setEndActivationInput(e.target.value)}
              placeholder="Activation Number"
              required={!activationId}
              disabled={!!activationId}
            />
          </label>
          <button
            className={styles.buttonSecondary}
            type="submit"
            disabled={locked || !volunteerInfo || isSubmitting || !activationId}
          >
            End Activation
          </button>
        </fieldset>
      </form>

      {/* === Remove PIN Access Button === */}
      {volunteerInfo && (
        <button
          className={styles.removePinButton}
          type="button"
          onClick={handleRemovePin}
        >
          Remove PIN Access
        </button>
      )}

      {/* === Activation Number Display === */}
      {activationNumber && (
        <div className={styles.activationNumber}>
          Your Activation Number: <b>{activationNumber}</b>
        </div>
      )}
    </div>
  );
}
