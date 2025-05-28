import React, { useState, useEffect } from 'react';

export default function SourceAppVolunteer() {
    const [formData, setFormData] = useState({
        frequency: '',
        mode: '',
        operator_name: '',
        state: '',
        start_time: '',
        end_time: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [activationCount, setActivationCount] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/activations/count')
            .then(res => res.json())
            .then(data => setActivationCount(data.count))
            .catch(() => setActivationCount(null));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage('');

        try {
            const response = await fetch('/api/activations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            setStatusMessage('Activation submitted successfully.');
            setFormData({
                frequency: '',
                mode: '',
                operator_name: '',
                state: '',
                start_time: '',
                end_time: '',
            });
            // Refresh activation count
            fetch('/api/activations/count')
                .then(res => res.json())
                .then(data => setActivationCount(data.count))
                .catch(() => setActivationCount(null));
        } catch (error) {
            console.error(error);
            setStatusMessage('Error submitting activation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="parchment-bg">
            <div className="form-wrapper">
                <h1 className="form-title">Volunteer Activation Form</h1>
                <div className="activation-count-banner" style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    {activationCount !== null
                        ? <>Current activation number: <span style={{ color: '#7a5230' }}>{activationCount}</span></>
                        : <>Loading activation number...</>
                    }
                </div>
                <form onSubmit={handleSubmit} className="activation-form">
                    <label>
                        Frequency:
                        <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} required />
                    </label>

                    <label>
                        Mode:
                        <input type="text" name="mode" value={formData.mode} onChange={handleChange} required />
                    </label>

                    <label>
                        Operator Name:
                        <input type="text" name="operator_name" value={formData.operator_name} onChange={handleChange} required />
                    </label>

                    <label>
                        State:
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                    </label>

                    <label>
                        Start Time:
                        <input type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} required />
                    </label>

                    <label>
                        End Time:
                        <input type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} />
                    </label>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Activation'}
                    </button>

                    {statusMessage && <p className="form-status">{statusMessage}</p>}
                </form>
            </div>
        </main>
    );
}