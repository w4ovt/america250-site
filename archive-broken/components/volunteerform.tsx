import React, { useState } from "react";

interface FormState {
  band: string;
  frequency: string;
  mode: string;
  name: string;
  callsign: string;
  state: string;
  comments: string;
}

const initialFormState: FormState = {
  band: "",
  frequency: "",
  mode: "",
  name: "",
  callsign: "",
  state: "",
  comments: "",
};

const VolunteerForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const validate = () => {
    if (!form.band) return "Band is required.";
    if (!form.frequency || isNaN(Number(form.frequency)) || Number(form.frequency) < 0)
      return "Valid frequency is required.";
    if (!form.mode) return "Mode is required.";
    if (!form.name) return "Name is required.";
    if (!form.callsign) return "Callsign is required.";
    if (!form.state) return "State is required.";
    if (form.comments.length > 20) return "Comments must be 20 characters or less.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          frequency: Number(form.frequency),
          comments: form.comments || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setSuccess("Activation submitted successfully!");
      setForm(initialFormState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="activation-form-title">
      <h2 id="activation-form-title">Volunteer Activation</h2>
      <div>
        <label htmlFor="band">Band*</label>
        <input
          id="band"
          name="band"
          type="text"
          value={form.band}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="frequency">Frequency (MHz)*</label>
        <input
          id="frequency"
          name="frequency"
          type="number"
          step="0.001"
          min="0"
          value={form.frequency}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="mode">Mode*</label>
        <input
          id="mode"
          name="mode"
          type="text"
          value={form.mode}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="name">Name*</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="callsign">Callsign*</label>
        <input
          id="callsign"
          name="callsign"
          type="text"
          value={form.callsign}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="state">State*</label>
        <input
          id="state"
          name="state"
          type="text"
          value={form.state}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="comments">Comments (max 20 chars)</label>
        <textarea
          id="comments"
          name="comments"
          maxLength={20}
          value={form.comments}
          onChange={handleChange}
        />
      </div>
      {error && <div role="alert" style={{ color: "red" }}>{error}</div>}
      {success && <div role="status" style={{ color: "green" }}>{success}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Activation"}
      </button>
    </form>
  );
};

export default VolunteerForm;
