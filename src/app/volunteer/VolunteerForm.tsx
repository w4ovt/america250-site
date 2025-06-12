'use client';

import React, { useState, useEffect } from "react";
import styles from "./VolunteerForm.module.css";

const VOLUNTEERS = [
  { name: "Marc", callsign: "W4OVT", state: "NC" },
  { name: "Ken", callsign: "K7ARN", state: "AZ" },
  { name: "Michelle", callsign: "N3YRZ", state: "MD" },
  { name: "Jim", callsign: "KE4ZUN", state: "NC" },
  { name: "BJ", callsign: "KO7T", state: "WA" },
  { name: "Tony", callsign: "KA3BPN", state: "PA" },
  { name: "Molly", callsign: "W3NY", state: "PA" },
  { name: "Joe", callsign: "K4PX", state: "KY" },
  { name: "Alex", callsign: "W7HU", state: "FL" },
  { name: "Jim", callsign: "KQ4LBM", state: "TN" }
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const MODES = [
  "SSB","CW","AM","FM","FT8","FT4","PSK31","Olivia","EchoLink"
];

const LOCAL_STORAGE_KEY = "a250_volunteer_activation";

export default function VolunteerForm({ locked = false }: { locked?: boolean }) {
  // Regular form state
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [callsign, setCallsign] = useState("");
  const [state, setState] = useState("");
  const [frequency, setFrequency] = useState("");
  const [mode, setMode] = useState("");
  const [activationNumber, setActivationNumber] = useState<string | null>(null);
  const [activationId, setActivationId] = useState<number | null>(null);
  const [activationMessage, setActivationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // End Activation state
  const [endActivationInput, setEndActivationInput] = useState(""); // for controlled input

  // === PERSIST ACTIVATION ON PAGE LOAD ===
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const { activationNumber, activationId, activationMessage } = JSON.parse(stored);
        if (activationNumber && activationId) {
          setActivationNumber(activationNumber);
          setActivationId(activationId);
          setEndActivationInput(activationNumber);
          setActivationMessage(activationMessage);
        }
      }
    } catch {}
  }, []);

  // Handle volunteer select
  function handleVolunteerChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.target.value;
    setSelectedVolunteer(name);
    const vol = VOLUNTEERS.find(v => v.name === name);
    setCallsign(vol ? vol.callsign : "");
    setState(vol ? vol.state : "");
  }

  // Handle new activation
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // Use Zulu time for start_time (format: "hh:mm:ss")
    const now = new Date();
    const start_time = now.toISOString().substr(11, 8);

    const payload = {
      frequency,
      mode,
      operator_name: selectedVolunteer,
      callsign,
      state,
      start_time
    };

    const response = await fetch('/api/activations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      setActivationNumber(result.activation_number?.toString() || null);
      setActivationId(result.activation_id ?? null);
      const msg = `Your Activation Number is: ${result.activation_number}. Please use this number below to end your activation.`;
      setActivationMessage(msg);
      setEndActivationInput(result.activation_number?.toString() || "");

      // Persist to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          activationNumber: result.activation_number?.toString() || null,
          activationId: result.activation_id ?? null,
          activationMessage: msg
        }));
      } catch {}

      setSelectedVolunteer("");
      setCallsign("");
      setState("");
      setFrequency("");
      setMode("");
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || "Failed to start activation.");
    }
  }

  // Handle end activation
  async function handleEndActivation(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!activationId) {
      setErrorMessage("No activation in progress.");
      return;
    }

    // Use Zulu time for end_time (format: "hh:mm:ss")
    const now = new Date();
    const end_time = now.toISOString().substr(11, 8);

    // PATCH or POST to an endpoint to end activation
    const response = await fetch(`/api/activations/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activation_id: activationId,
        end_time
      }),
    });

    const result = await response.json();

    if (result.success) {
      setActivationMessage("Your activation has ended. Thank you for volunteering!");
      setActivationNumber(null);
      setActivationId(null);
      setEndActivationInput("");

      // Remove persisted activation info
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}

      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || "Failed to end activation.");
    }
  }

  return (
    <div className={styles.panelContainer} aria-disabled={locked}>
      <div className={styles.panelTitle}>Volunteer Activation Form</div>
      {/* Show activation assignment message */}
      {activationMessage && (
        <div
          style={{
            background: "#fdf3ce",
            color: "#714800",
            fontWeight: 600,
            fontSize: "1.5rem",
            margin: "2rem 0 0.7rem 0",
            borderRadius: 8,
            padding: "0.9rem 2rem",
            textAlign: "center",
            letterSpacing: "0.01em",
            boxShadow: "0 0 6px #efdbb3"
          }}
          aria-live="polite"
        >
          {activationMessage}
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            background: "#fff3ef",
            color: "#b40000",
            fontWeight: 600,
            fontSize: "1.15rem",
            margin: "1rem 0",
            borderRadius: 8,
            padding: "0.75rem 2rem",
            textAlign: "center",
            boxShadow: "0 0 6px #efdbb3"
          }}
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      )}
      {/* --- ACTIVATE SECTION --- */}
      <form className={styles.formFields} onSubmit={handleSubmit} autoComplete="off">
        <label className={styles.label} htmlFor="operatorName">Operator Name</label>
        <select
          className={styles.select}
          id="operatorName"
          value={selectedVolunteer}
          onChange={handleVolunteerChange}
          required
          disabled={locked}
        >
          <option value="" disabled>Select Operator</option>
          {VOLUNTEERS.map(vol => (
            <option key={vol.callsign} value={vol.name}>{vol.name}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="callsign">Call Sign</label>
        <select
          className={styles.select}
          id="callsign"
          value={callsign}
          onChange={e => setCallsign(e.target.value)}
          required
          disabled={locked}
        >
          <option value="" disabled>Select Callsign</option>
          {VOLUNTEERS.map(vol => (
            <option key={vol.callsign} value={vol.callsign}>{vol.callsign}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="state">State</label>
        <select
          className={styles.select}
          id="state"
          value={state}
          onChange={e => setState(e.target.value)}
          required
          disabled={locked}
        >
          <option value="" disabled>Select State</option>
          {STATES.map(abbr => (
            <option key={abbr} value={abbr}>{abbr}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="frequency">Frequency (MHz)</label>
        <input
          className={styles.input}
          id="frequency"
          type="text"
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
          required
          disabled={locked}
          autoComplete="off"
        />

        <label className={styles.label} htmlFor="mode">Mode</label>
        <select
          className={styles.select}
          id="mode"
          value={mode}
          onChange={e => setMode(e.target.value)}
          required
          disabled={locked}
        >
          <option value="" disabled>Select Mode</option>
          {MODES.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>

        <button className={styles.submitButton} type="submit" disabled={locked}>
          Submit Activation
        </button>
      </form>

      {/* --- END ACTIVATION SECTION --- */}
      <div style={{ margin: "2rem 0 0 0", width: "100%" }}>
        <form onSubmit={handleEndActivation} className={styles.formFields} autoComplete="off">
          <label className={styles.label} htmlFor="activationNumber">Activation Number</label>
          <input
            className={styles.input}
            id="activationNumber"
            type="text"
            value={endActivationInput}
            onChange={e => setEndActivationInput(e.target.value)}
            placeholder="Activation Number"
            required
            disabled={locked || !activationNumber}
            autoComplete="off"
          />
          <button
            className={styles.endButton}
            type="submit"
            disabled={locked || !activationNumber}
          >
            End Activation
          </button>
        </form>
      </div>
      {locked && (
        <div
          style={{
            background: "#ffe1b2",
            color: "#842100",
            fontWeight: 600,
            marginTop: "1.2rem",
            padding: "0.9rem 1.6rem",
            borderRadius: 10,
            fontSize: "1.11rem",
            textAlign: "center",
            letterSpacing: "0.01em",
            boxShadow: "0 0 6px #efdbb3"
          }}
          aria-live="polite"
        >
          Please enter the Volunteer PIN above to activate this form.
        </div>
      )}
    </div>
  );
}
