/**
 * Uploads a file to the backend which then uploads to Cloudinary
 * @param {object} file - File object from expo-image-picker or DocumentPicker
 * @param {string} token - Firebase auth token
 * @returns {Promise<string>} The uploaded file URL
 */
export const uploadFile = async (file: any, token: string): Promise<string> => {
    const formData = new FormData();
    
    // expo-image-picker returns assets with uri, name, type
    // Fallbacks provided for edge cases
    const fileToUpload = {
        uri: file.uri,
        type: file.mimeType || 'image/jpeg',
        name: file.fileName || `upload_${Date.now()}.jpg`,
    };
    
    formData.append('file', fileToUpload as any);

    try {
        // Use your actual backend URL here, e.g. from constants or env
        const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';
        
        const response = await fetch(`${BACKEND_URL}/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
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
