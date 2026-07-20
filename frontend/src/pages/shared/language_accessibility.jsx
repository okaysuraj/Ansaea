import React, { useState } from 'react';

const LanguageAccessibility = () => {
    const [language, setLanguage] = useState('en');

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Language & Accessibility Settings</h1>
            <div className="max-w-sm">
                <label className="block mb-2 font-semibold">Select Language:</label>
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                </select>
                
                <label className="flex items-center gap-2">
                    <input type="checkbox" /> Enable High Contrast Mode
                </label>
                <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" /> Enable Screen Reader Assistance
                </label>
            </div>
        </div>
    );
};

export default LanguageAccessibility;
