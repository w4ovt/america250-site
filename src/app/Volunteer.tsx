'use client';

import React, { useState } from 'react';

const initialForm = {
  frequency: '',
  mode: '',
  operator_name: '',
  state: '',
  start_time: '',
  end_time: '',
};

export default function VolunteerForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Basic front-end validation
    if (
      !form.frequency ||
      !form.mode ||
      !form.operator_name ||
      !form.state ||
      !form.start_time ||
      !form.end_time
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/volunteer', {
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
        <input
          type="text"
          name="mode"
          value={form.mode}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem' }}
          required
        />
      </label>

      <label>
        Operator Name<br />
        <input
          type="text"
          name="operator_name"
          value={form.operator_name}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 12, fontSize: '1rem' }}
          required
        />
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