interface RateLimit {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  private readonly WINDOW_MS = 3600000; // 1 hour
  private readonly MAX_REQUESTS = 100;

  isRateLimited(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.limits.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(userId, {
        count: 1,
        resetTime: now + this.WINDOW_MS
      });
      return false;
    }

    if (userLimit.count >= this.MAX_REQUESTS) {
      return true;
    }

    userLimit.count++;
    return false;
  }

  getRemainingRequests(userId: string): number {
    const userLimit = this.limits.get(userId);
    if (!userLimit || Date.now() > userLimit.resetTime) {
      return this.MAX_REQUESTS;
    }
    return Math.max(0, this.MAX_REQUESTS - userLimit.count);
  }

  resetLimit(userId: string): void {
    this.limits.delete(userId);
  }
}

export const rateLimiter = new RateLimiter();