'use client';
import React, { useState, useEffect } from 'react';

// --- PIN MANAGEMENT CONSOLE ---
interface PinEntry {
  id: number;
  pin: string;
  volunteer: string;
}

function PinManager() {
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pins, setPins] = useState<PinEntry[]>([]);
  const [newPin, setNewPin] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    setStatus('');
    try {
      const res = await fetch('/api/admin/pins', {
        headers: { Authorization: adminPinInput.trim() }
      });
      if (res.ok) {
        const data = await res.json();
        setPins(data);
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setIsAuthenticated(false);
        setAuthError('Authentication failed');
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError('Network error');
    }
    setLoading(false);
  };

  const fetchPins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pins', {
        headers: { Authorization: adminPinInput.trim() }
      });
      if (res.ok) {
        const data = await res.json();
        setPins(data);
      }
    } catch {}
    setLoading(false);
  };

  const handleAddPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminPinInput.trim()
        },
        body: JSON.stringify({
          pin: newPin,
          volunteer
        })
      });
      if (res.ok) {
        setNewPin('');
        setVolunteer('');
        setStatus('PIN added successfully');
        fetchPins();
      } else {
        const data = await res.json();
        setStatus(data.error || 'Error adding PIN');
      }
    } catch {
      setStatus('Network error');
    }
    setLoading(false);
  };

  const handleDeletePin = async (id: number) => {
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pins', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: adminPinInput.trim()
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setStatus('PIN deleted');
        fetchPins();
      } else {
        setStatus('Delete failed');
      }
    } catch {
      setStatus('Network error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPinInput('');
    setPins([]);
    setStatus('');
    setAuthError('');
  };

  return (
    <div
      className="admin-block"
      style={{
        background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
        border: '8px solid #a47c37',
        borderRadius: 18,
        padding: '2rem 1.5rem',
        minWidth: 340,
        maxWidth: 600,
        margin: '1rem auto',
        boxShadow: '0 3px 13.5px #cfad7533',
        fontFamily: "'librebaskerville-bold', serif",
        width: '90%'
      }}
      aria-labelledby="pinManagerHeading"
    >
      <h2 id="pinManagerHeading" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#513404' }}>
        Admin PIN Management
      </h2>
      {!isAuthenticated ? (
        <form onSubmit={handleAdminAuth} style={{ marginBottom: '2rem' }}>
          <label htmlFor="adminPin" style={{ fontWeight: 600 }}>
            Admin PIN:
          </label>
          <input
            id="adminPin"
            type="password"
            value={adminPinInput}
            onChange={e => setAdminPinInput(e.target.value)}
            style={{ marginLeft: 8, marginRight: 8 }}
            autoFocus
            autoComplete="off"
            disabled={loading}
          />
          <button type="submit" disabled={loading || adminPinInput.length === 0}>
            {loading ? 'Authenticating...' : 'Unlock Console'}
          </button>
          {authError && (
            <div style={{ color: '#b40000', marginTop: 8 }}>{authError}</div>
          )}
        </form>
      ) : (
        <>
          <form onSubmit={handleAddPin} className="pin-form" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="volunteer" style={{ fontWeight: 600 }}>Volunteer Name:</label>
              <input
                id="volunteer"
                type="text"
                value={volunteer}
                onChange={e => setVolunteer(e.target.value)}
                required
              />
              <label htmlFor="newPin" style={{ fontWeight: 600 }}>PIN:</label>
              <input
                id="newPin"
                type="text"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                pattern="\d{4,8}"
                title="4-8 digit PIN"
                required
              />
              <button type="submit" disabled={loading}>
                Add PIN
              </button>
            </div>
          </form>

          <div className="pin-list" role="list" style={{ marginBottom: '2rem' }}>
            {pins.length === 0 ? (
              <div>No PINs found.</div>
            ) : (
              pins.map(pin => (
                <div
                  key={pin.id}
                  className="pin-item"
                  role="listitem"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 8
                  }}
                >
                  <span style={{ minWidth: 120 }}>{pin.volunteer}</span>
                  <span>••••</span>
                  <button
                    onClick={() => handleDeletePin(pin.id)}
                    className="destructive"
                    aria-label={`Delete PIN for ${pin.volunteer}`}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
            Lock Admin Console
          </button>
        </>
      )}

      {status && <div className="status" role="status" style={{ marginTop: 8 }}>{status}</div>}
    </div>
  );
}

// --- ACTIVATION MANAGEMENT CONSOLE ---
interface Activation {
  id: number;
  frequency: string;
  mode: string;
  operator_name: string;
  callsign: string;
  state: string;
  start_time: string;
  end_time?: string | null;
}

function AdminActivationsManager() {
  const [activations, setActivations] = useState<Activation[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivations();
  }, []);

  const fetchActivations = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/activations');
      const data = await res.json();
      setActivations(Array.isArray(data) ? data : []);
    } catch {
      setStatus('Failed to fetch activations.');
    }
    setLoading(false);
  };

  const endActivation = async (id: number) => {
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/activations/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setStatus('Activation ended.');
        setActivations(acts =>
          acts.map(a =>
            a.id === id ? { ...a, end_time: new Date().toISOString().slice(11, 19) } : a
          )
        );
      } else {
        const data = await res.json();
        setStatus(data.error || 'Failed to end activation.');
      }
    } catch {
      setStatus('Network error.');
    }
    setLoading(false);
  };

  return (
    <div
      className="admin-block"
      style={{
        background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
        border: '8px solid #a47c37',
        borderRadius: 18,
        padding: '2rem 1.5rem',
        minWidth: 340,
        maxWidth: 600,
        margin: '1rem auto',
        boxShadow: '0 3px 13.5px #cfad7533',
        fontFamily: "'librebaskerville-regular', serif",
        width: '90%'
      }}
      aria-labelledby="activationsManagerHeading"
    >
      <h2 id="activationsManagerHeading" style={{ fontSize: '1.2rem', marginBottom: 16, color: '#513404' }}>
        Activation Management
      </h2>
      {status && <div role="status" style={{ marginBottom: 12, color: '#b40000' }}>{status}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : activations.length === 0 ? (
        <div>No activations found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.97em' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Callsign</th>
              <th>Freq</th>
              <th>Mode</th>
              <th>Operator</th>
              <th>State</th>
              <th>Start</th>
              <th>End</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activations.map(a => (
              <tr key={a.id} style={{ background: a.end_time ? '#eee' : undefined }}>
                <td>{a.id}</td>
                <td>{a.callsign}</td>
                <td>{a.frequency}</td>
                <td>{a.mode}</td>
                <td>{a.operator_name}</td>
                <td>{a.state}</td>
                <td>{a.start_time}</td>
                <td>{a.end_time || <span style={{ color: '#b40000' }}>Active</span>}</td>
                <td>
                  {!a.end_time && (
                    <button
                      onClick={() => endActivation(a.id)}
                      disabled={loading}
                      aria-label={`End activation ${a.id}`}
                      style={{
                        background: '#b40000',
                        color: 'white',
                        border: 'none',
                        borderRadius: 5,
                        padding: '0.4em 1em',
                        cursor: 'pointer'
                      }}
                    >
                      End
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- MAIN PANEL LAYOUT ---
export default function AdminActivationManager() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2.5rem',
        margin: '3rem 0',
        width: '100%',
        maxWidth: 700
      }}
      aria-label="Admin Consoles"
    >
      <PinManager />
      <AdminActivationsManager />
    </section>
  );
}
