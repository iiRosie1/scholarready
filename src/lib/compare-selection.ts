export const COMPARE_SELECTION_KEY = "scholarready.compare-selection";
export const MAX_COMPARE_SELECTIONS = 3;

export function toggleCompareSelection(selectedIds: readonly string[], scholarshipId: string, max = MAX_COMPARE_SELECTIONS): string[] {
  if (selectedIds.includes(scholarshipId)) return selectedIds.filter(id => id !== scholarshipId);
  if (selectedIds.length >= max) return [...selectedIds];
  return [...selectedIds, scholarshipId];
}

export function normalizeCompareSelection(value: unknown, validIds: readonly string[], max = MAX_COMPARE_SELECTIONS): string[] {
  if (!Array.isArray(value)) return [];
  const valid = new Set(validIds);
  const seen = new Set<string>();
  return value.filter((id): id is string => {
    if (typeof id !== "string" || !valid.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, max);
}
