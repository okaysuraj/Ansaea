import React, { useState } from 'react';
import './shared.css'; // Assuming shared.css exists, or use inline styles/tailwind

const DisputeResolution = () => {
    const [ticket, setTicket] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Dispute submitted! We will contact you soon.');
        setTicket('');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dispute Resolution</h1>
            <p className="mb-4">If you have any issues with billing, consultation quality, or other disputes, please file a ticket below.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <textarea 
                    value={ticket}
                    onChange={(e) => setTicket(e.target.value)}
                    className="border p-2 rounded h-32"
                    placeholder="Describe your dispute..."
                    required
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit Dispute</button>
            </form>
        </div>
    );
};

export default DisputeResolution;
