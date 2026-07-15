// frontend/src/utils/encryption.js
// A simple AES-GCM encryption utility for demonstration of End-to-End Encryption (E2EE)

const ENCRYPTION_KEY_STRING = "ansaea-secure-e2e-key-123456789"; // In a real scenario, this is exchanged via a secure key-exchange protocol (like Diffie-Hellman)

async function getCryptoKey() {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(ENCRYPTION_KEY_STRING),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("ansaea-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(text) {
  try {
    const key = await getCryptoKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );

    // Combine IV and ciphertext for transmission
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode.apply(null, combined));
  } catch (e) {
    console.error("Encryption failed", e);
    return text; // fallback for demo
  }
}

export async function decryptMessage(encryptedBase64) {
  try {
    const key = await getCryptoKey();
    
    // Decode base64
    const binaryStr = atob(encryptedBase64);
    const combined = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      combined[i] = binaryStr.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("Decryption failed", e);
    return encryptedBase64; // fallback if it wasn't encrypted
  }
}
