'use client';

import React, { useState } from 'react';
import VolunteerForm from './VolunteerForm';
import K4ABoxDropzone from './K4ABoxDropzone';

const VOLUNTEER_PIN = '7317';

export default function VolunteerPage() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === VOLUNTEER_PIN) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'none',
      width: '100vw',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {!unlocked ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '7vw'
        }}>
          <form onSubmit={handlePinSubmit}
            style={{
              background: 'linear-gradient(180deg, #f8ecd8 80%, #ede0c5 100%)',
              border: '8px solid #6e4314',
              borderRadius: 18,
              padding: '2.5rem 3rem',
              boxShadow: '0 4px 22px #ab864e44, inset 0 0 44px #d6ba8255',
              minWidth: 370,
              maxWidth: 430,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <div style={{
              fontSize: '1.7rem',
              fontWeight: 700,
              color: '#513404',
              letterSpacing: '0.02em',
              marginBottom: '2rem',
              fontFamily: "'goudystd', serif"
            }}>
              ENTER PIN NUMBER:
            </div>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
              style={{
                fontSize: '1.5rem',
                border: '2px solid #ad782e',
                borderRadius: 8,
                padding: '0.8rem 1.1rem',
                width: 150,
                textAlign: 'center',
                letterSpacing: '0.19em',
                background: '#fff6e1',
                fontFamily: "'goudystd', serif",
                marginBottom: 10
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
                borderRadius: 10,
                padding: '0.85rem 2.5rem',
                fontSize: '1.28rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginTop: 18,
                boxShadow: '0 2px 9px #7c552040'
              }}
            >
              Unlock Volunteer Page
            </button>
            {pinError &&
              <div style={{
                color: '#b40000',
                background: '#fff3ef',
                fontWeight: 600,
                fontSize: '1.2rem',
                marginTop: 16,
                borderRadius: 6,
                padding: '0.5rem 1.3rem'
              }}>
                {pinError}
              </div>
            }
          </form>
        </div>
      ) : (
        <>
          <VolunteerForm />
          <K4ABoxDropzone />
        </>
      )}
    </main>
  );
}