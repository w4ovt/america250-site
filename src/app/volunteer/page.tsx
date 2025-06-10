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
      {/* === FLEX CONTAINER FOR ALL BLOCKS === */}
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',  // <-- Ensures horizontal centering
          justifyContent: 'flex-start',
          gap: '2.5rem',
          paddingTop: '4.5rem',
          boxSizing: 'border-box',
        }}
      >
        {/* --- NCS GUIDE BUTTON --- */}
        <div
          style={{
            background: 'linear-gradient(90deg, #f5e1bc 0%, #c5a564 100%)',
            border: '4.5px solid #a47c37',
            borderRadius: 25.5,
            padding: '2.25rem 3.75rem',
            boxShadow: '0 6px 24px #7c552028, 0 2.25px 15px #9a7c4722',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 900,
            fontFamily: "'old claude', 'librebaskerville-bold', serif"
          }}
        >
          <a
            href="/ncs-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(180deg, #fff6e0 70%, #b49768 100%)',
              color: '#43290c',
              border: '3.75px solid #ad8a45',
              borderRadius: 13.5,
              fontWeight: 700,
              padding: '1.5rem 3.75rem',
              fontSize: '2.1rem',
              textDecoration: 'none',
              boxShadow: '0 3px 13.5px #cfad7533',
              letterSpacing: '0.045em',
              transition: 'background 0.18s, box-shadow 0.18s',
              textAlign: 'center'
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#f5e1bc')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(180deg, #fff6e0 70%, #b49768 100%)')}
          >
            <span role="img" aria-label="scroll" style={{ marginRight: 18, fontSize: '1.8em' }}>📜</span>
            View the NCS Guide (PDF)
          </a>
        </div>

        {/* --- PIN ENTRY --- */}
        <div
          style={{
            width: 900,
            maxWidth: '98vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 0,
          }}
        >
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
              display: unlocked ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 0
            }}
          >
            <div
              style={{
                fontSize: '2.55rem',
                fontWeight: 700,
                color: '#513404',
                letterSpacing: '0.03em',
                marginBottom: '3rem',
                fontFamily: "'goudystd', serif"
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
                marginBottom: 15
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
                boxShadow: '0 3px 13.5px #7c552040'
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
                  padding: '0.75rem 2rem'
                }}
              >
                {pinError}
              </div>
            )}
          </form>
        </div>

        {/* --- VOLUNTEER FORM --- */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <VolunteerForm locked={!unlocked} />
        </div>

        {/* --- K4A LOG DROPBOX --- */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <K4ABoxDropzone locked={!unlocked} />
        </div>
      </div>
    </main>
  );
}
