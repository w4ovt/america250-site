'use client';

import React, { useState, useEffect } from 'react';
import styles from './VolunteerForm.module.css';

const MODE_OPTIONS = [
  'SSB', 'CW', 'FT8', 'FT4', 'FM', 'AM', 'PSK31', 'Olivia', 'Thor', 'EchoLink', 'RTTY'
];
const OPERATOR_OPTIONS = ['Marc Bowen'];
const CALLSIGN_OPTIONS = ['W4OVT'];

const initialForm = {
  frequency: '',
  mode: MODE_OPTIONS[0],
  operator_name: OPERATOR_OPTIONS[0],
  callsign: CALLSIGN_OPTIONS[0],
  state: '',
  start_time: '',
  end_time: '',
};

export default function VolunteerForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activationCount, setActivationCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/activations/count')
      .then(res => res.json())
      .then(data => setActivationCount(data.count))
      .catch(() => setActivationCount(null));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "state" || name === "callsign") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (
      !form.frequency ||
      !form.mode ||
      !form.operator_name ||
      !form.callsign ||
      !form.state ||
      !form.start_time ||
      !form.end_time
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (/\s/.test(form.callsign)) {
      setError('Callsign must be a single word (no spaces).');
      setLoading(false);
      return;
    }
    if (form.state.length !== 2) {
      setError('State must be a 2-letter abbreviation.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/activations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Submission failed.');
      } else {
        setMessage('Activation logged successfully!');
        setForm(initialForm);
        fetch('/api/activations/count')
          .then(res => res.json())
          .then(data => setActivationCount(data.count))
          .catch(() => setActivationCount(null));
      }
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} aria-label="Volunteer Activation Form">
      <h2 className={styles.title}>Volunteer Activation Form</h2>

      <div className={styles.activationCount}>
        Current activation number: <span>{activationCount !== null ? activationCount : 'Loading...'}</span>
      </div>

      <label className={styles.label}>
        Frequency
        <input
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>

      <label className={styles.label}>
        Mode
        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className={styles.select}
          required
        >
          {MODE_OPTIONS.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Operator Name
        <select
          name="operator_name"
          value={form.operator_name}
          onChange={handleChange}
          className={styles.select}
          required
        >
          {OPERATOR_OPTIONS.map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Callsign
        <select
          name="callsign"
          value={form.callsign}
          onChange={handleChange}
          className={styles.select}
          required
        >
          {CALLSIGN_OPTIONS.map(callsign => (
            <option key={callsign} value={callsign}>{callsign}</option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        State
        <input
          name="state"
          maxLength={2}
          value={form.state}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>

      <label className={styles.label}>
        Start Time
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>

      <label className={styles.label}>
        End Time
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}
      {message && <div className={styles.message}>{message}</div>}

      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? 'Submitting...' : 'Submit Activation'}
      </button>
    </form>
  );
}