type CacheRecord<T> = {
  status: "pending" | "completed";
  updatedAt: number;
  value?: T;
};

const submissionCache = new Map<string, CacheRecord<unknown>>();
const CACHE_TTL_MS = 1000 * 60 * 10;

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of submissionCache.entries()) {
    if (now - record.updatedAt > CACHE_TTL_MS) {
      submissionCache.delete(key);
    }
  }
}

export function getCompletedSubmission<T>(key: string): T | null {
  cleanupExpiredEntries();
  const record = submissionCache.get(key);
  if (!record || record.status !== "completed") {
    return null;
  }
  return record.value as T;
}

export function markSubmissionPending(key: string): boolean {
  cleanupExpiredEntries();
  const existing = submissionCache.get(key);
  if (existing?.status === "pending") {
    return false;
  }

  submissionCache.set(key, {
    status: "pending",
    updatedAt: Date.now(),
  });
  return true;
}

export function markSubmissionComplete<T>(key: string, value: T) {
  submissionCache.set(key, {
    status: "completed",
    updatedAt: Date.now(),
    value,
  });
}

export function clearSubmissionPending(key: string) {
  const existing = submissionCache.get(key);
  if (existing?.status === "pending") {
    submissionCache.delete(key);
  }
}
