'use client';

import React, { useState, useEffect } from 'react';
import SourceAppVolunteer from './sourceappvolunteer';

export default function VolunteerProtectedPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // On mount, check if access was previously granted (sessionStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const granted = sessionStorage.getItem('volunteer_access_granted');
      if (granted === 'true') setAccessGranted(true);
    }
  }, []);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const response = await fetch('/api/verify-access-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: enteredCode }),
    });
    const result = await response.json();
    if (result.valid) {
      setAccessGranted(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('volunteer_access_granted', 'true');
      }
    } else {
      setErrorMsg('Incorrect access code. Please try again.');
      setEnteredCode('');
    }
  };

  if (!accessGranted) {
    return (
      <main className="parchment-bg" style={{ minHeight: '100vh' }}>
        <div className="form-wrapper">
          <h1 className="form-title">Volunteer Access</h1>
          <form onSubmit={handleCodeSubmit} className="activation-form">
            <label>
              Enter Volunteer Access Code:
              <input
                type="password"
                value={enteredCode}
                onChange={e => setEnteredCode(e.target.value)}
                autoFocus
                style={{ marginLeft: 8 }}
                required
              />
            </label>
            <button type="submit" style={{ marginTop: 16 }}>
              Enter
            </button>
            {errorMsg && <p className="form-status" style={{ color: 'darkred' }}>{errorMsg}</p>}
          </form>
        </div>
      </main>
    );
  }

  // If access granted, render the protected Volunteer Activation Form
  return (
    <main className="parchment-bg">
      <div className="form-wrapper">
        <SourceAppVolunteer />
      </div>
    </main>
  );
}