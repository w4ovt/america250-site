// src/app/volunteer/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import VolunteerTabs from '@/components/VolunteerTabs';

const LOCAL_STORAGE_KEY = 'volunteer_unlocked';
const PIN_STORAGE_KEY = 'volunteerPin';

export default function VolunteerPage() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [checkedPin, setCheckedPin] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState<{
    name: string;
    callsign: string;
    state: string;
    isAdmin: boolean;
  } | null>(null);

  // On mount, check localStorage for unlocked state and PIN
  useEffect(() => {
    const flag = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
    if (flag === 'true' && storedPin) {
      fetch('/api/volunteers/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: storedPin }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUnlocked(true);
            setVolunteerInfo({
              name: data.name,
              callsign: data.callsign,
              state: data.state,
              isAdmin: !!data.isAdmin,
            });
          } else {
            setUnlocked(false);
            setVolunteerInfo(null);
          }
          setCheckedPin(true);
        });
    } else {
      setUnlocked(false);
      setVolunteerInfo(null);
      setCheckedPin(true);
    }
  }, []);

  // PIN submission logic
  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    const enteredPin = pin.trim();
    fetch('/api/volunteers/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: enteredPin }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUnlocked(true);
          setVolunteerInfo({
            name: data.name,
            callsign: data.callsign,
            state: data.state,
            isAdmin: !!data.isAdmin,
          });
          setPinError('');
          localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
          localStorage.setItem(PIN_STORAGE_KEY, enteredPin);
        } else {
          setPinError('PIN not recognized. Please try again.');
        }
      });
  }

  return (
    <main
      className="parchment-bg fullwidth-block"
      style={{
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '2.5rem',
          paddingTop: '4.5rem',
          boxSizing: 'border-box',
        }}
      >
        {/* --- PIN ENTRY FORM --- */}
        {!unlocked && checkedPin && (
          <form
            onSubmit={handlePinSubmit}
            style={{
              background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
              border: '12px solid #6e4314',
              borderRadius: 27,
              padding: '3.75rem 4.5rem',
              boxShadow: '0 6px 33px #ab864e44, inset 0 0 66px #d6ba8255',
              minWidth: 555,
              maxWidth: 1050,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 0,
            }}
          >
            <div
              style={{
                fontSize: '2.55rem',
                fontWeight: 700,
                color: '#513404',
                letterSpacing: '0.03em',
                marginBottom: '3rem',
                fontFamily: "'goudystd', serif",
              }}
            >
              ENTER VOLUNTEER PIN:
            </div>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
              style={{
                fontSize: '2.25rem',
                border: '3px solid #ad782e',
                borderRadius: 12,
                padding: '1.2rem 1.65rem',
                width: 225,
                textAlign: 'center',
                letterSpacing: '0.19em',
                background: '#fff6e1',
                fontFamily: "'goudystd', serif",
                marginBottom: 15,
              }}
              maxLength={12}
              inputMode="numeric"
              autoComplete="off"
            />
            <button
              type="submit"
              style={{
                background: '#4a2e05',
                color: '#fffbea',
                border: 'none',
                borderRadius: 15,
                padding: '1.3rem 3.75rem',
                fontSize: '1.92rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                marginTop: 27,
                boxShadow: '0 3px 13.5px #7c552040',
              }}
            >
              Unlock Volunteer Tools
            </button>
            {pinError && (
              <div
                style={{
                  color: '#b40000',
                  background: '#fff3ef',
                  fontWeight: 600,
                  fontSize: '1.8rem',
                  marginTop: 24,
                  borderRadius: 9,
                  padding: '0.75rem 2rem',
                }}
              >
                {pinError}
              </div>
            )}
          </form>
        )}

        {/* --- TABBED DASHBOARD BLOCK (Always Visible) --- */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <VolunteerTabs
            volunteerInfo={volunteerInfo}
            locked={!unlocked}
            // onRemovePin={handleRemovePin}  <-- REMOVE THIS LINE ENTIRELY!
          />
        </div>
      </div>
    </main>
  );
}
