// src/components/AdminDashboard.tsx

import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";

// Volunteer type
type Volunteer = {
  id: number;
  name: string;
  callsign: string;
  state: string;
  pin: string;
  is_admin: boolean;
};

// Activation type
type Activation = {
  id: number;
  frequency: string;
  mode: string;
  operator_name: string;
  callsign: string;
  state: string;
  start_time: string;
  end_time: string | null;
};

// Props
interface AdminDashboardProps {
  disabled: boolean;
  onAdminAction?: () => void;
}

export default function AdminDashboard({ disabled, onAdminAction }: AdminDashboardProps) {
  // State
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PIN registration
  const [pinForm, setPinForm] = useState({ name: "", callsign: "", state: "", pin: "" });

  // Admin rights
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>("");
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  // End activation
  const [endActivationId, setEndActivationId] = useState<string>("");

  // Archive/reset all activations
  const [archiveConfirm, setArchiveConfirm] = useState(false);

  // Fetch volunteers/activations
  useEffect(() => {
    if (!disabled) {
      fetchVolunteers();
      fetchActivations();
    }
  }, [disabled]);

  async function fetchVolunteers() {
    try {
      const res = await fetch("/api/volunteers");
      const data = await res.json();
      if (Array.isArray(data)) setVolunteers(data);
    } catch {
      setError("Failed to load volunteers.");
    }
  }

  async function fetchActivations() {
    try {
      const res = await fetch("/api/activations");
      const data = await res.json();
      if (Array.isArray(data)) setActivations(data);
    } catch {
      setError("Failed to load activations.");
    }
  }

  // Register PIN handler
  async function handlePinRegister(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!pinForm.name || !pinForm.callsign || !pinForm.state || !pinForm.pin) {
      setError("All fields are required.");
      return;
    }
    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pinForm, callsign: pinForm.callsign.toUpperCase() })
    });
    if (res.ok) {
      setStatus("Volunteer PIN registered.");
      setPinForm({ name: "", callsign: "", state: "", pin: "" });
      fetchVolunteers();
      onAdminAction && onAdminAction();
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed.");
    }
  }

  // Assign/remove admin rights
  async function handleAdminAssign(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!selectedVolunteer) {
      setError("Select a volunteer.");
      return;
    }
    try {
      const res = await fetch("/api/volunteers/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callsign: selectedVolunteer, is_admin: isAdminChecked })
      });
      if (res.ok) {
        setStatus(isAdminChecked ? "Admin rights granted." : "Admin rights removed.");
        fetchVolunteers();
        onAdminAction && onAdminAction();
      } else {
        setError("Failed to update admin rights.");
      }
    } catch {
      setError("API error updating admin rights.");
    }
  }

  // End activation handler
  async function handleEndActivation(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!endActivationId) {
      setError("Activation ID required.");
      return;
    }
    try {
      const res = await fetch("/api/activations/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(endActivationId) })
      });
      if (res.ok) {
        setStatus("Activation ended.");
        setEndActivationId("");
        fetchActivations();
        onAdminAction && onAdminAction();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to end activation.");
      }
    } catch {
      setError("API error ending activation.");
    }
  }

  // Archive/reset all activations
  async function handleArchiveAll() {
    if (!archiveConfirm) return;
    setStatus(null);
    setError(null);
    try {
      const res = await fetch("/api/activations/reset", { method: "POST" });
      if (res.ok) {
        setStatus("All activations archived and reset.");
        fetchActivations();
        setArchiveConfirm(false);
        onAdminAction && onAdminAction();
      } else {
        setError("Failed to reset activations.");
      }
    } catch {
      setError("API error during archive/reset.");
    }
  }

  // Overlay for non-admins
  const adminLockedOverlay = (
    <div className={styles.adminOverlay}>
      <div>
        <span className={styles.lockedMessage}>
          Admin functions are only available to authorized volunteers.
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.adminPanelWrapper}>
      <div className={`${styles.adminContent} ${disabled ? styles.grayedOut : ""}`}>
        <h2 className={styles.adminHeader}>Admin Dashboard</h2>

        {/* Section: PIN Registration */}
        <section className={styles.section}>
          <h3>Register Volunteer PIN</h3>
          <form className={styles.formRow} onSubmit={handlePinRegister}>
            <input
              className={styles.input}
              type="text"
              placeholder="Name"
              value={pinForm.name}
              onChange={e => setPinForm({ ...pinForm, name: e.target.value })}
              autoComplete="off"
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Callsign"
              value={pinForm.callsign}
              onChange={e => setPinForm({ ...pinForm, callsign: e.target.value })}
              autoComplete="off"
              style={{ textTransform: "uppercase" }}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="State"
              value={pinForm.state}
              onChange={e => setPinForm({ ...pinForm, state: e.target.value })}
              autoComplete="off"
              maxLength={2}
              style={{ textTransform: "uppercase" }}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="PIN"
              value={pinForm.pin}
              onChange={e => setPinForm({ ...pinForm, pin: e.target.value })}
              autoComplete="off"
              maxLength={8}
            />
            <button className={styles.button} type="submit">Register PIN</button>
          </form>
          <ul className={styles.list}>
            {volunteers.map(v => (
              <li key={v.callsign} className={styles.listItem}>
                {v.name} ({v.callsign}) — <span className={styles.adminLabel}>{v.is_admin ? "ADMIN" : "Volunteer"}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section: Assign Admin Rights */}
        <section className={styles.section}>
          <h3>Assign Admin Rights</h3>
          <form className={styles.formRow} onSubmit={handleAdminAssign}>
            <select
              className={styles.input}
              value={selectedVolunteer}
              onChange={e => setSelectedVolunteer(e.target.value)}
            >
              <option value="">Select Volunteer</option>
              {volunteers.map(v => (
                <option key={v.callsign} value={v.callsign}>
                  {v.name} ({v.callsign})
                </option>
              ))}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <input
                type="checkbox"
                checked={isAdminChecked}
                onChange={e => setIsAdminChecked(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Grant Admin
            </label>
            <button className={styles.buttonSecondary} type="submit">
              Update Rights
            </button>
          </form>
        </section>

        {/* Section: End Activation by Number */}
        <section className={styles.section}>
          <h3>End Activation</h3>
          <form className={styles.formRow} onSubmit={handleEndActivation}>
            <input
              className={styles.input}
              type="number"
              placeholder="Activation ID"
              value={endActivationId}
              onChange={e => setEndActivationId(e.target.value)}
              min={1}
              style={{ width: 120 }}
            />
            <button className={styles.buttonSecondary} type="submit">
              End Activation
            </button>
          </form>
        </section>

        {/* Section: Reset/Archive All Activations */}
        <section className={styles.section}>
          <h3>Archive and Reset All Activations</h3>
          <div className={styles.formRow}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <input
                type="checkbox"
                checked={archiveConfirm}
                onChange={e => setArchiveConfirm(e.target.checked)}
                style={{ marginRight: 7 }}
              />
              Confirm deletion/archival of ALL activation records.
            </label>
            <button
              className={styles.buttonDanger}
              onClick={handleArchiveAll}
              disabled={!archiveConfirm}
              type="button"
            >
              Archive & Reset
            </button>
          </div>
        </section>

        {/* Status/Error */}
        {status && <div className={styles.success}>{status}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
      {disabled && adminLockedOverlay}
    </div>
  );
}
