import { api } from '../firebase'; // Assuming api is configured with axios in firebase.js or similar

/**
 * Uploads a file to the backend which then uploads to Cloudinary
 * @param {File} file 
 * @param {string} token - Firebase auth token
 * @returns {Promise<string>} The uploaded file URL
 */
export const uploadFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
