// src/app/volunteer/VolunteerTabs.tsx

'use client';

import React, { useState } from 'react';
import styles from './VolunteerTabs.module.css';
import VolunteerDashboard from '@/components/VolunteerDashboard';
import AdminDashboard from '@/components/AdminDashboard';

// -----------------------------------------------------------
// VolunteerTabsProps
//   - Props interface for VolunteerTabs component
//   - Only serializable data types allowed (no function props)
// -----------------------------------------------------------
export interface VolunteerTabsProps {
  volunteerInfo: {
    name: string;
    callsign: string;
    state: string;
    isAdmin: boolean;
  } | null;
  locked: boolean;
}

// -----------------------------------------------------------
// Tab definitions for navigation
// -----------------------------------------------------------
const TAB_LIST = [
  { key: 'volunteer', label: 'Volunteer Dashboard' },
  { key: 'admin', label: 'Admin Dashboard' },
];

// ===========================================================
// VolunteerTabs component
//   - Main tabbed interface for Volunteer/Admin dashboards
//   - Does NOT pass down function props; all logic self-contained
// ===========================================================
export default function VolunteerTabs({
  volunteerInfo,
  locked,
}: VolunteerTabsProps) {
  // State: Track which tab is active
  const [activeTab, setActiveTab] = useState<'volunteer' | 'admin'>('volunteer');

  // Determine admin privileges for UI
  const isAdmin = !!volunteerInfo?.isAdmin;

  return (
    <div className={styles.tabsWrapper}>
      {/* =================== TAB BAR =================== */}
      <div className={styles.tabBar} role="tablist">
        {TAB_LIST.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.key as 'volunteer' | 'admin')}
            type="button"
            aria-selected={activeTab === tab.key}
            role="tab"
            tabIndex={activeTab === tab.key ? 0 : -1}
            disabled={tab.key === 'admin' && !isAdmin}
            style={{
              cursor: tab.key === 'admin' && !isAdmin ? 'not-allowed' : 'pointer',
              opacity: tab.key === 'admin' && !isAdmin ? 0.55 : 1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB PANELS ================= */}
      <div className={styles.tabPanel}>
        {/* ----------- Volunteer Dashboard Tab ----------- */}
        {activeTab === 'volunteer' && (
          <VolunteerDashboard
            volunteerInfo={volunteerInfo}
            locked={locked}
            // Do NOT pass onRemovePin; handled internally by VolunteerDashboard
          />
        )}

        {/* ----------- Admin Dashboard Tab -------------- */}
        {activeTab === 'admin' && (
          <div className={styles.adminPanelWrapper}>
            <div className={`${styles.adminContent} ${!isAdmin ? styles.grayedOut : ''}`}>
              <AdminDashboard disabled={!isAdmin} />
            </div>
            {/* Overlay/Lock if not admin */}
            {!isAdmin && (
              <div className={styles.adminOverlay}>
                <div className={styles.lockedMessage}>
                  <strong>Admin access required.</strong>
                  <br />
                  Please enter an Admin PIN to unlock these controls.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



