import React from 'react';

const OCRPreviewTagging = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">OCR Preview & Tagging</h1>
            <p className="mb-4">Upload lab reports or prescriptions to automatically extract text and tag them securely.</p>
            <div className="border-2 border-dashed border-gray-300 rounded h-64 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Drag & Drop medical document here</p>
            </div>
        </div>
    );
};

export default OCRPreviewTagging;
