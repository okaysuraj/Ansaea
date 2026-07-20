import React, { useState } from 'react';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([{ name: 'National Emergency', phone: '911' }]);
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Emergency Contacts</h1>
            <p className="text-red-500 mb-4">If you are experiencing a life-threatening emergency, please call your local emergency services immediately.</p>
            <div className="bg-white p-4 rounded shadow">
                <ul>
                    {contacts.map((c, i) => (
                        <li key={i} className="flex justify-between border-b py-2">
                            <span className="font-semibold">{c.name}</span>
                            <a href={`tel:${c.phone}`} className="text-blue-600">{c.phone}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EmergencyContacts;
