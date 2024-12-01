import { rateLimiter } from './rateLimiter';
import { logAuditEvent } from '../auditService';
import { encryptData } from './encryptionService';

export class APIProtection {
  async protectRequest(
    userId: string,
    endpoint: string,
    data: unknown
  ): Promise<{ encrypted: ArrayBuffer; remaining: number }> {
    // Check rate limits
    if (rateLimiter.isRateLimited(userId)) {
      throw new Error('Rate limit exceeded');
    }

    // Log the request
    await logAuditEvent(userId, 'api_request', {
      endpoint,
      timestamp: new Date()
    });

    // Encrypt the request data
    const serializedData = JSON.stringify(data);
    const encrypted = await encryptData(new TextEncoder().encode(serializedData));

    return {
      encrypted,
      remaining: rateLimiter.getRemainingRequests(userId)
    };
  }
}

export const apiProtection = new APIProtection();