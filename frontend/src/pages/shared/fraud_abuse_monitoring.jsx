import React from 'react';

const FraudAbuseMonitoring = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Fraud & Abuse Monitoring</h1>
            <p>Admin Dashboard for monitoring suspicious activities, fake accounts, and prescription abuse.</p>
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                Alert: No recent fraudulent activity detected.
            </div>
        </div>
    );
};

export default FraudAbuseMonitoring;
