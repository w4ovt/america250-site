'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// --- SETTINGS ---
const NAV_HEIGHT = 86; // px
const ICON_HEIGHT = Math.round(NAV_HEIGHT * 0.97);
const NAV_FONT_FAMILY = "'Goudy Old Style', serif";
const NAV_TEXT_COLOR = '#fbeac1';
const NAV_BG_GRADIENT = 'linear-gradient(90deg, #6c4624 0%, #8c6239 100%)';
// Bright center, both ends fade out, gold gradient for separator
const SEPARATOR_GRADIENT = `
  linear-gradient(
    90deg, 
    rgba(255,226,154,0) 0%,
    #ffe29a 12%,
    #d5a94a 26%,
    #fff4c0 50%,
    #d5a94a 74%,
    #ffe29a 88%,
    rgba(255,226,154,0) 100%
  )
`;

const TwoLineLabel = ({ top, bottom }: { top: string; bottom: string }) => (
  <span style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: 600,
    letterSpacing: '0.01em',
    margin: 0,
    gap: '7px', // More space between lines
    color: NAV_TEXT_COLOR,
    fontFamily: NAV_FONT_FAMILY,
  }}>
    <span style={{
      fontSize: '1.12em',
      lineHeight: 1.22,
      color: NAV_TEXT_COLOR,
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: 600,
      textShadow: '0 1px 4px #4b3012'
    }}>{top}</span>
    <span style={{
      fontSize: '0.96em',
      lineHeight: 1.09,
      color: NAV_TEXT_COLOR, // uniform color
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: 600,
      textShadow: '0 1px 4px #4b3012'
    }}>{bottom}</span>
  </span>
);

const navLinks = [
  { name: <TwoLineLabel top="MEET THE" bottom="SIGNERS" />, path: '/signers' },
  { name: <TwoLineLabel top="PATRIOT" bottom="PAGE" />, path: '/patriots' },
  { name: <TwoLineLabel top="UPCOMING" bottom="EVENTS" />, path: '/events' },
  { name: <TwoLineLabel top="VOLUNTEER" bottom="PAGE" />, path: '/volunteer' },
  { name: <TwoLineLabel top="ACTIVATIONS" bottom="HISTORY" />, path: '/history' },
  { name: 'DONATIONS', path: '/donate' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: '100vw',
        background: NAV_BG_GRADIENT,
        minHeight: `${NAV_HEIGHT}px`,
        height: `${NAV_HEIGHT}px`,
        position: 'relative',
        zIndex: 999,
        margin: 0,
        padding: 0,
        border: 'none',
        boxShadow: 'none',
        userSelect: 'none',
        overflow: 'visible'
      }}
      aria-label="Main Navigation"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: `${NAV_HEIGHT}px`,
          width: '100vw',
          maxWidth: '100vw',
          position: 'relative',
          padding: 0,
          margin: 0,
        }}
      >
        {/* Home section: icon nearly fills nav bar, margin pushes left */}
        <Link
          href="/"
          aria-label="Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: NAV_TEXT_COLOR,
            fontFamily: NAV_FONT_FAMILY,
            fontWeight: 700,
            fontSize: '2.1rem',
            letterSpacing: '0.06em',
            marginLeft: 'calc(1.9vw + 110px)', // shift left!
            marginRight: '3vw',
            height: `${ICON_HEIGHT}px`,
            minHeight: `${ICON_HEIGHT}px`,
            whiteSpace: 'nowrap',
          }}
        >
          <Image
            src="/inkwell.webp"
            alt="Home"
            width={ICON_HEIGHT}
            height={ICON_HEIGHT}
            style={{
              height: `${ICON_HEIGHT}px`,
              width: 'auto',
              minWidth: `${ICON_HEIGHT * 0.78}px`,
              margin: '0 8px 0 0',
              display: 'block',
              filter: 'drop-shadow(0 2px 6px #805a18b8) brightness(1.08)',
              background: 'none',
              verticalAlign: 'middle',
            }}
            draggable={false}
            priority
          />
          <span
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              color: NAV_TEXT_COLOR,
              fontFamily: NAV_FONT_FAMILY,
              letterSpacing: '0.07em',
              textShadow: '0 2px 4px #4b3012',
              verticalAlign: 'middle',
              marginTop: '1.5px',
              marginLeft: '0.18vw',
              whiteSpace: 'nowrap',
              textDecoration: 'none'
            }}
          >
            HOME
          </span>
        </Link>
        {/* Nav links block: centered */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${NAV_HEIGHT}px`,
            gap: '2.5vw',
            minWidth: 'min(84vw, 1600px)',
            zIndex: 10,
          }}
        >
          {navLinks.map(link => (
            <Link
              key={typeof link.name === 'string' ? link.path : link.path}
              href={link.path}
              tabIndex={0}
              style={{
                color: NAV_TEXT_COLOR,
                fontFamily: NAV_FONT_FAMILY,
                fontSize: '1.12rem',
                fontWeight: 600,
                textDecoration: 'none',
                textShadow: '0 1px 4px #5d411b66',
                padding: '0 0.37em',
                opacity: pathname === link.path ? 1 : 0.94,
                borderBottom: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
                minHeight: '56px',
                lineHeight: 1.19,
              }}
              aria-current={pathname === link.path ? "page" : undefined}
            >
              <span
                style={{
                  textAlign: 'center',
                  width: '100%',
                  letterSpacing: '0.01em',
                  fontWeight: 600,
                  margin: 0,
                  padding: 0,
                  textDecoration: 'none',
                  textTransform: 'none',
                  color: NAV_TEXT_COLOR,
                  fontFamily: NAV_FONT_FAMILY,
                }}
              >
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      {/* Gold separator at bottom, both ends fade */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100vw',
          height: '7px',
          background: SEPARATOR_GRADIENT,
          margin: 0,
          padding: 0,
          border: 'none',
          boxShadow: '0 2px 8px #a9781396',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </nav>
  );
}