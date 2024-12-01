export async function encryptData(data: ArrayBuffer): Promise<ArrayBuffer> {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );

  // Export key for storage
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  
  // Combine IV, key, and encrypted data
  const combined = new Uint8Array(iv.length + exportedKey.byteLength + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(exportedKey), iv.length);
  combined.set(new Uint8Array(encryptedData), iv.length + exportedKey.byteLength);

  return combined.buffer;
}

export async function decryptData(encryptedCombined: ArrayBuffer): Promise<ArrayBuffer> {
  const iv = new Uint8Array(encryptedCombined.slice(0, 12));
  const keyData = new Uint8Array(encryptedCombined.slice(12, 44));
  const encryptedData = new Uint8Array(encryptedCombined.slice(44));

  const key = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );

  return window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData
  );
}