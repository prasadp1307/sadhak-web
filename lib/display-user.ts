/** Short, human-friendly slice of a Firestore document id for display. */
export function formatShortRefId(id: string): string {
  const trimmed = id.trim();
  if (!trimmed) return '—';
  if (trimmed.length <= 8) return trimmed.toUpperCase();
  return trimmed.slice(-8).toUpperCase();
}
