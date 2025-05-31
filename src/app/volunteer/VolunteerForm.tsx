'use client';

import React, { useState, useEffect } from 'react';

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
    if (name === "state") {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else if (name === "callsign") {
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

    // Front-end validation
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
        setForm(initialForm); // Clear form
        // Refresh activation count
        fetch('/api/activations/count')
          .then(res => res.json())
          .then(data => setActivationCount(data.count))
          .catch(() => setActivationCount(null));
      }
    } catch (err: any) {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255,255,240,0.96)',
        border: '2px solid #B8860B',
        borderRadius: '10px',
        padding: '2rem',
        maxWidth: 480,
        margin: '2rem auto',
        fontFamily: 'Goudy Oldstyle, serif',
        boxShadow: '0 6px 32px #bbb8a0',
      }}
      aria-label="Volunteer Activation Form"
    >
      <h2 style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>
        Volunteer Activation Form
      </h2>

      <div
        className="activation-count-banner"
        style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 'bold' }}
      >
        {activationCount !== null
          ? <>Current activation number: <span style={{ color: '#7a5230' }}>{activationCount}</span></>
          : <>Loading activation number...</>
        }
      </div>

      <label>
        Frequency<br />
        <input
          type="text"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem' }}
          required
        />
      </label>

      <label>
        Mode<br />
        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem' }}
          required
        >
          {MODE_OPTIONS.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </label>

      <label>
        Operator Name<br />
        <select
          name="operator_name"
          value={form.operator_name}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem' }}
          required
        >
          {OPERATOR_OPTIONS.map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </label>

      <label>
        Callsign<br />
        <select
          name="callsign"
          value={form.callsign}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem', textTransform: 'uppercase' }}
          required
        >
          {CALLSIGN_OPTIONS.map(callsign => (
            <option key={callsign} value={callsign}>{callsign}</option>
          ))}
        </select>
      </label>

      <label>
        State<br />
        <input
          type="text"
          name="state"
          value={form.state}
          maxLength={2}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem', textTransform: 'uppercase' }}
          required
        />
      </label>

      <label>
        Start Time<br />
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem' }}
          required
        />
      </label>

      <label>
        End Time<br />
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 16, fontSize: '1rem' }}
          required
        />
      </label>

      {error && (
        <div
          style={{
            color: '#8B0000',
            background: '#fff6f6',
            border: '1px solid #e9b3b3',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: 6,
          }}
        >
          {error}
        </div>
      )}
      {message && (
        <div
          style={{
            color: '#155724',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: 6,
          }}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1.1rem',
          background: '#B8860B',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Submitting...' : 'Submit Activation'}
      </button>
    </form>
  );
}