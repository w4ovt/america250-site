'use client';
import React, { useState } from 'react';

interface PinEntry {
  id: number;
  pin: string;
  volunteer: string;
}

export default function PinManager() {
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pins, setPins] = useState<PinEntry[]>([]);
  const [newPin, setNewPin] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Only fetch pins after successful admin authentication
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
    <div className="pin-manager" role="region" aria-labelledby="pinManagerHeading">
      <h2 id="pinManagerHeading" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        PIN Management Console
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label htmlFor="volunteer" style={{ fontWeight: 600 }}>Volunteer Name:</label>
              <input
                id="volunteer"
                type="text"
                value={volunteer}
                onChange={e => setVolunteer(e.target.value)}
                required
                style={{ marginRight: 16 }}
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
                style={{ marginRight: 16 }}
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
