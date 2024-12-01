```typescript
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

export async function encrypt(text: string): Promise<string> {
  const iv = crypto.randomBytes(12);
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha256');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  const result = Buffer.concat([salt, iv, authTag, encrypted]);
  return result.toString('base64');
}

export async function decrypt(encryptedText: string): Promise<string> {
  const data = Buffer.from(encryptedText, 'base64');
  
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const authTag = data.slice(28, 44);
  const encrypted = data.slice(44);
  
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha256');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
  
  return decrypted.toString('utf8');
}
```