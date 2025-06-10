'use client';

import React, { useState } from "react";
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



export default function VolunteerForm({ locked = false }: { locked?: boolean }) {
  // Regular form state
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [callsign, setCallsign] = useState("");
  const [state, setState] = useState("");
  const [frequency, setFrequency] = useState("");
  const [mode, setMode] = useState("");

  // Activation number & message logic
  const [activationNumber, setActivationNumber] = useState<string | null>(null);
  const [activationMessage, setActivationMessage] = useState<string | null>(null);

  // End Activation state
  const [endActivationInput, setEndActivationInput] = useState(""); // for controlled input

  // Handle volunteer select
  function handleVolunteerChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.target.value;
    setSelectedVolunteer(name);
    const vol = VOLUNTEERS.find(v => v.name === name);
    setCallsign(vol ? vol.callsign : "");
    setState(vol ? vol.state : "");
  }

  // Handle new activation
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate assignment of unique activation number (replace with backend-generated value if needed)
    const newActivationNumber = Math.floor(10000 + Math.random() * 90000).toString();
    setActivationNumber(newActivationNumber);
    setActivationMessage(
      `Your Activation Number is: ${newActivationNumber}. Please use this number below to end your activation.`
    );
    setEndActivationInput(newActivationNumber); // auto-fill the field for user
    setSelectedVolunteer("");
    setCallsign("");
    setState("");
    setFrequency("");
    setMode("");
  }

  // Handle end activation
  function handleEndActivation(e: React.FormEvent) {
    e.preventDefault();
    // Here you would call backend API to end activation
    setActivationMessage("Your activation has ended. Thank you for volunteering!");
    setActivationNumber(null);
    setEndActivationInput("");
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