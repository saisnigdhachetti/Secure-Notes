// ── End-to-End Encryption using Web Crypto API ──

// Derive a key from the user's password
async function deriveKey(password) {
  const encoder  = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password),
    { name: 'PBKDF2' }, false, ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('secure-notes-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt text
async function encryptNote(text, password) {
  const key     = await deriveKey(password);
  const encoder = new TextEncoder();
  const iv      = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(text)
  );

  // Combine iv + encrypted data and convert to base64
  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

// Decrypt text
async function decryptNote(encryptedBase64, password) {
  try {
    const key     = await deriveKey(password);
    const decoder = new TextDecoder();

    const combined  = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv        = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return decoder.decode(decrypted);
  } catch {
    return '[Unable to decrypt]';
  }
}