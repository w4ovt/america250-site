'use client';
import React, { useState, useEffect } from 'react';

// List of US state abbreviations for dropdown
const STATES_LIST = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
  'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
  'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const PIN_STORAGE_KEY = 'volunteerPin';
const LOCAL_STORAGE_KEY = 'volunteer_authenticated';

interface Volunteer {
  name: string;
  callsign: string;
  state: string;
  pin: string;
}

export default function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [form, setForm] = useState<Volunteer>({
    name: '',
    callsign: '',
    state: '',
    pin: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch volunteers for dropdowns on mount
  useEffect(() => {
    fetch('/api/volunteers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVolunteers(data);
      });
  }, []);

  // Handler for form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    // Basic validation
    if (!form.name || !form.callsign || !form.state || !form.pin) {
      setStatus('All fields are required.');
      setLoading(false);
      return;
    }
    if (!/^[A-Z0-9]{3,10}$/.test(form.callsign.toUpperCase())) {
      setStatus('Callsign must be 3-10 letters/numbers.');
      setLoading(false);
      return;
    }
    if (!/^\d{4,8}$/.test(form.pin)) {
      setStatus('PIN must be 4-8 digits.');
      setLoading(false);
      return;
    }

    // Submit to API
    const res = await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        callsign: form.callsign.toUpperCase()
      })
    });

    if (res.ok) {
      // Store PIN and authentication in localStorage
      localStorage.setItem(PIN_STORAGE_KEY, form.pin);
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
      setStatus('Volunteer registered and authenticated.');
      setVolunteers([...volunteers, { ...form, callsign: form.callsign.toUpperCase() }]);
      setForm({ name: '', callsign: '', state: '', pin: '' });
    } else {
      const data = await res.json();
      setStatus(data.error || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
        border: '4px solid #a47c37',
        borderRadius: 18,
        padding: '2.5rem 1.5rem',
        maxWidth: 500,
        margin: '2rem auto',
        boxShadow: '0 3px 13.5px #cfad7533',
        fontFamily: "'goudystd', serif"
      }}
      aria-labelledby="volunteerManagementHeading"
    >
      <h2 id="volunteerManagementHeading" style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#513404' }}>
        Volunteer Management
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
            required
            style={{ marginLeft: 8, minWidth: 150 }}
          />
        </label>
        <label>
          Callsign:
          <input
            type="text"
            name="callsign"
            value={form.callsign}
            onChange={handleChange}
            autoComplete="off"
            required
            style={{ marginLeft: 8, minWidth: 100, textTransform: 'uppercase' }}
            pattern="[A-Z0-9]{3,10}"
            title="3-10 uppercase letters/numbers"
          />
        </label>
        <label>
          State:
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            style={{ marginLeft: 8, minWidth: 70 }}
          >
            <option value="">Select State</option>
            {STATES_LIST.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <label>
          PIN:
          <input
            type="password"
            name="pin"
            value={form.pin}
            onChange={handleChange}
            autoComplete="off"
            required
            style={{ marginLeft: 8, minWidth: 80 }}
            pattern="\d{4,8}"
            title="4-8 digit PIN"
          />
        </label>
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {status && <div style={{ marginTop: 18, color: status.includes('failed') ? '#b40000' : '#227722' }}>{status}</div>}

      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: '1.1rem', color: '#513404', marginBottom: 8 }}>Registered Volunteers</h3>
        <select style={{ minWidth: 200 }}>
          <option value="">Select Volunteer</option>
          {volunteers.map((v, idx) => (
            <option key={v.callsign + idx} value={v.callsign}>
              {v.name} ({v.callsign})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

