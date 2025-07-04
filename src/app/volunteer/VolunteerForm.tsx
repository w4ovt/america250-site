// src/app/volunteer/VolunteerForm.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './VolunteerForm.module.css';

// Props for the VolunteerForm
type VolunteerFormProps = {
  locked: boolean; // Disable form actions if true
  volunteerInfo: {
    name: string;
    callsign: string;
    state: string;
    isAdmin: boolean;
  } | null;
  onActivationChange?: () => void; // Callback for table refresh, if needed
};

// Modes and States dropdowns for selection
const STATES = [
  'NC', 'VA', 'SC', 'GA', 'FL', 'AL', 'TN', 'KY', 'WV', 'MD', 'DE', 'PA', 'OH', 'NY', 'NJ'
];
const MODES = ['SSB', 'CW', 'FM', 'AM', 'DIGI'];
const LOCAL_STORAGE_KEY = 'volunteer_activation_state';

// Main VolunteerForm component
export default function VolunteerForm({
  locked,
  volunteerInfo,
  onActivationChange,
}: VolunteerFormProps) {
  // Form fields
  const [operatorName, setOperatorName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [state, setState] = useState('');
  const [frequency, setFrequency] = useState('');
  const [mode, setMode] = useState('');
  const [activationNumber, setActivationNumber] = useState<number | null>(null);
  const [activationId, setActivationId] = useState<number | null>(null);
  const [activationMessage, setActivationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [endActivationInput, setEndActivationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autofocus frequency input
  const freqRef = useRef<HTMLInputElement>(null);

  // On mount: load activation state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setActivationNumber(parsed.activationNumber ?? null);
        setActivationId(parsed.activationId ?? null);
        setActivationMessage(parsed.activationMessage ?? null);
      }
    } catch {}
  }, []);

  // Save activation state on change
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ activationNumber, activationId, activationMessage })
      );
    } catch {}
  }, [activationNumber, activationId, activationMessage]);

  // Autofill volunteer data when available (and clear on logout)
  useEffect(() => {
    if (volunteerInfo) {
      setOperatorName(volunteerInfo.name);
      setCallsign(volunteerInfo.callsign);
      setState(volunteerInfo.state);
      setErrorMessage(null);
    } else {
      setOperatorName('');
      setCallsign('');
      setState('');
    }
    setFrequency('');
    setMode('');
    setActivationNumber(null);
    setActivationId(null);
    setActivationMessage(null);
    setEndActivationInput('');
  }, [volunteerInfo]);

  // Autofocus frequency input if unlocked
  useEffect(() => {
    if (!locked && freqRef.current) {
      freqRef.current.focus();
    }
  }, [locked, volunteerInfo]);

  // --- Submit new activation ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setActivationMessage(null);
    setIsSubmitting(true);

    // Validate: must be unlocked, have all fields, freq must be valid
    if (
      locked ||
      !operatorName ||
      !callsign ||
      !state ||
      !frequency ||
      !mode ||
      !/^\d+(\.\d+)?$/.test(frequency)
    ) {
      setErrorMessage('All fields required. Frequency must be in MHz (e.g. 7.195)');
      setIsSubmitting(false);
      return;
    }

    try {
      // POST activation to API
      const response = await fetch('/api/activations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frequency,
          mode,
          operator_name: operatorName,
          callsign,
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
        if (onActivationChange) onActivationChange();
      } else {
        setErrorMessage(result.error || 'Failed to submit activation.');
      }
    } catch {
      setErrorMessage('Failed to submit activation.');
    }
    setIsSubmitting(false);
  }

  // --- End activation ---
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
        setActivationMessage('Your activation has ended. Thank you!');
        setActivationNumber(null);
        setActivationId(null);
        setEndActivationInput('');
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {}
        setErrorMessage(null);
        if (onActivationChange) onActivationChange();
      } else {
        setErrorMessage(result.error || 'Failed to end activation.');
      }
    } catch {
      setErrorMessage('Failed to end activation.');
    }
  }

  // --- RENDER ---
  return (
    <div className={styles.volunteerFormWrapper} aria-live="polite">
      <h2
        className={styles.header}
        style={{ marginBottom: '1.4rem', marginTop: '0.2rem', fontWeight: 700 }}
      >
        Volunteer Dashboard
      </h2>

      {/* Start a New Activation */}
      <form className={styles.form} onSubmit={handleSubmit} aria-disabled={locked}>
        <fieldset disabled={locked || isSubmitting} className={styles.fieldset}>
          <legend className={styles.legend}>Start a New Activation</legend>

          {/* Name (readonly, autofill) */}
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              name="operatorName"
              value={operatorName}
              readOnly
              tabIndex={-1}
              disabled
              aria-readonly
            />
          </label>

          {/* Callsign (readonly, autofill) */}
          <label className={styles.label}>
            Callsign
            <input
              className={styles.input}
              name="callsign"
              value={callsign}
              readOnly
              tabIndex={-1}
              disabled
              aria-readonly
            />
          </label>

          {/* State (dropdown, pre-select user state) */}
          <label className={styles.label}>
            State
            <select
              className={styles.input}
              name="state"
              value={state}
              onChange={e => setState(e.target.value)}
              required
              disabled={locked}
            >
              <option value="">Select...</option>
              {STATES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {/* Frequency input (MHz label) */}
          <label className={styles.label}>
            Frequency (MHz)
            <input
              className={styles.input}
              name="frequency"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              placeholder="e.g. 7.195"
              required
              ref={freqRef}
              disabled={locked}
              inputMode="decimal"
              autoComplete="off"
            />
          </label>

          {/* Mode dropdown */}
          <label className={styles.label}>
            Mode
            <select
              className={styles.input}
              name="mode"
              value={mode}
              onChange={e => setMode(e.target.value)}
              required
              disabled={locked}
            >
              <option value="">Select...</option>
              {MODES.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          {/* Start Activation button */}
          <button
            className={styles.button}
            type="submit"
            disabled={locked || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Start Activation'}
          </button>
        </fieldset>
      </form>

      {/* Success and Error Messages */}
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

      {/* End Activation */}
      <form className={styles.form} onSubmit={handleEndActivation}>
        <fieldset disabled={locked || isSubmitting} className={styles.fieldset}>
          <legend className={styles.legend}>End an Activation</legend>
          <label className={styles.label}>
            Activation Number
            <input
              className={styles.input}
              type="number"
              value={activationId ?? endActivationInput}
              onChange={e => setEndActivationInput(e.target.value)}
              placeholder="Activation Number"
              required={!activationId}
              disabled={!!activationId || locked}
              inputMode="numeric"
            />
          </label>
          <button
            className={styles.buttonSecondary}
            type="submit"
            disabled={locked || isSubmitting}
          >
            End Activation
          </button>
        </fieldset>
      </form>
    </div>
  );
}
