// Simple in-memory limiter. Good enough to start, but each serverless instance has
// its own memory, so replace with Upstash Redis (@upstash/ratelimit) before real traffic.
const hits = new Map<string, number[]>();

export function allow(key: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
